---
title: Mapped Dependencies
description: Mapped Dependencies guide.
sidebar:
  order: 20
---

Mapped Dependencies allow you to register and resolve services based on a qualifier token, such as a class constructor. This enables scenarios where multiple services implement the same interface, and you want to resolve the correct one based on some dynamic context.

## When to Use

Use mapped dependencies when:

- You have multiple implementations of the same interface.
- You need to resolve a specific implementation based on runtime data (e.g., request type).
- You want to decouple your logic from concrete types using class-based mappings.

## Registering Mapped Dependencies

To register a mapped dependency, use:

```python title="Python"
dependency_container.add_mapped_singleton(Interface, SomeClass, Implementation)
```

This tells the container: _“Whenever I ask for an implementation of **Interface** using **SomeClass** as the qualifier, give me **Implementation**.”_

## Resolving Mapped Dependencies

Use `get_mapped_dependency` and provide the qualifier:

```python title="Python"
instance = dependency_container.get_mapped_dependency(Interface, SomeClass)
```

## Example: Handling Requests Dynamically

Consider a scenario where we want to handle different request types using different handlers, all implementing a common interface.

### Step 1: Define the interfaces

```python title="Python"
class IRequest(ABC):
    pass

TRequest = TypeVar('TRequest', bound=IRequest)
TResponse = TypeVar('TResponse')

class IRequestHandler(ABC, Generic[TRequest, TResponse]):
    @abstractmethod
    def handle_async(self, request: TRequest) -> Awaitable[TResponse]:
        pass
```

### Step 2: Implement a request and its handler

```python title="Python"
class ILogger(ABC):
    @abstractmethod
    def info(self, message: str) -> None:
        pass

@dataclass
class SayHelloCommand(IRequest):
    name: str

class SayHelloCommandHandler:
    def __init__(self, logger: ILogger) -> None:
        self._logger = logger

    async def handle_async(self, request: SayHelloCommand) -> str:
        self._logger.info(f"{self.__class__.__name__} executed by {request.name}")
        return f"Hello {request.name}"
```

### Step 3: Register the handler using `addMappedSingleton`

```python title="Python"
dependency_container.add_mapped_singleton(
  IRequestHandler[SayHelloCommand, str],
  SayHelloCommand,
  SayHelloCommandHandler
)
```

### Step 4: Resolve the correct handler dynamically

The `RequestMediator` takes care of resolving the correct handler based on the type of request:

```python title="Python"
TRequest = TypeVar("TRequest", bound=IRequest)
TResponse = TypeVar("TResponse")

class RequestMediator:
    def __init__(self, dependency_container: DependencyContainer) -> None:
        self._dependency_container = dependency_container

    def _get_request_handler(self, request: IRequest) -> IRequestHandler[IRequest, TResponse]:
        handler = self._dependency_container.get_mapped_dependency(
            IRequestHandler[IRequest, TResponse],
            type(request)
        )
        return cast(IRequestHandler[IRequest, TResponse], handler)

    async def send_async(self, request: IRequest) -> TResponse:
        handler = self._get_request_handler(request)
        response = await handler.handle_async(request)
        return response
```

### Step 5: Send a request

```python title="Python"
command = SayHelloCommand("John Doe")
response: str = await request_mediator.send_async(command)
print(response) # Hello John Doe
```

## Injecting Mapped Dependencies via Constructor

In addition to resolving mapped dependencies manually with `get_mapped_dependency`, you can **inject them automatically** into constructors using the decorator:

```python title="Python"
@inject_mapped_dependency(constructor_index: int, qualifier_token: Any)
```

This works as constructor injection and uses a **qualifier** to resolve the correct implementation at runtime.

### Key Concepts

- `constructor_index`: The index of the constructor argument where the dependency should be injected.
- `qualifier_token`: The key used to identify the correct mapped implementation.

You can inject mapped dependencies directly into constructors using `@inject_mapped_dependency`. The qualifier token can be **any unique value**: a class, string, symbol, etc.

## Example: Injecting by Qualifier

Let's create a `StartupService` that the `IRequestHandler` dependency is injected using a mapped dependency identified by `SayHelloCommand`.

### Step 1: Register the Mapped Dependency

```python title="Python"
dependency_container.add_mapped_singleton(
  IRequestHandler[SayHelloCommand, str],
  SayHelloCommand,
  SayHelloCommandHandler
)
```

### Step 2: Define the Service with Injection

We use the `@inject_mapped_dependency` decorator on the constructor to tell the container to inject a mapped instance of `IRequestHandler` using `SayHelloCommand` as the key (qualifierToken).

```python title="Python"
@InjectMappedDependency(0, SayHelloCommand)
class StartupService:
    def __init__(self, say_hello_handler: IRequestHandler[SayHelloCommand, str]):
        self._say_hello_handler = say_hello_handler

    async def greet_user(name: str):
        command = SayHelloCommand(name)
        response = await self._say_hello_handler.handle_async(command)
        print(response)

```

This automatically injects the correct IRequestHandler for SayHelloCommand without any manual lookup or conditional logic.

### Step 3: Register and Use the Service

```python title="Python"
dependency_container.add_singleton(StartupService)
dependency_container.build_singletons()

startup_service = dependency_container.get_dependency(StartupService)
await startup_service.greet_user("John Doe") # Hello John Doe
```
