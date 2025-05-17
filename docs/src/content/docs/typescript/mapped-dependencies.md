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

```ts title="TypeScript"
dependencyContainer.addMappedSingleton<Interface, Implementation>({
  qualifierToken: SomeClass,
});
```

This tells the container: _“Whenever I ask for an implementation of **Interface** using **SomeClass** as the qualifier, give me **Implementation**.”_

## Resolving Mapped Dependencies

Use `getMappedDependency` and provide the qualifier:

```ts title="TypeScript"
const instance = dependencyContainer.getMappedDependency<Interface>({
  qualifierToken: SomeClass,
});
```

## Example: Handling Requests Dynamically

Consider a scenario where we want to handle different request types using different handlers, all implementing a common interface.

### Step 1: Define the interfaces

```ts title="TypeScript"
export interface IRequest {}

export interface IRequestHandler<TRequest extends IRequest, TResponse> {
  handleAsync(request: TRequest): Promise<TResponse>;
}
```

### Step 2: Implement a request and its handler

```ts title="TypeScript"
export class SayHelloCommand implements IRequest {
  constructor(public name: string) {}
}

export class SayHelloCommandHandler implements IRequestHandler<SayHelloCommand, string> {
  constructor(private logger: ILogger) {}

  public async handleAsync(request: SayHelloCommand): Promise<string> {
    this.logger.info(`${this.constructor.name} executed by ${request.name}`);
    return `Hello ${request.name}`;
  }
}
```

### Step 3: Register the handler using `addMappedSingleton`

```ts title="TypeScript"
dependencyContainer.addMappedSingleton<IRequestHandler<SayHelloCommand, string>, SayHelloCommandHandler>({
  qualifierToken: SayHelloCommand,
});
```

### Step 4: Resolve the correct handler dynamically

The `RequestMediator` takes care of resolving the correct handler based on the type of request:

```ts title="TypeScript"
import { DependencyContainer } from "dipend";
import { IRequest } from "./request.interface";
import { IRequestHandler } from "./request-handler.interface";

export class RequestMediator {
  constructor(private dependencyContainer: DependencyContainer) {}

  private getRequestHandler<TRequest extends IRequest, TResponse>(
    request: IRequest,
  ): IRequestHandler<TRequest, TResponse> {
    const requestHandler = this.dependencyContainer.getMappedDependency<IRequestHandler<TRequest, TResponse>>({
      qualifierToken: request.constructor,
    });

    return requestHandler;
  }

  public async sendAsync<TResponse>(request: IRequest): Promise<TResponse> {
    const requestHandler = this.getRequestHandler<IRequest, TResponse>(request);

    const response = await requestHandler.handleAsync(request);

    return response;
  }
}
```

### Step 5: Send a request

```ts title="TypeScript"
const command = new SayHelloCommand("John Doe");
const response = await requestMediator.sendAsync<string>(command);
console.log(response);
```

## Injecting Mapped Dependencies via Constructor

In addition to resolving mapped dependencies manually with `getMappedDependency`, you can **inject them automatically** into constructors using the decorator:

```ts title="TypeScript"
@InjectMappedDependency(constructorArgIndex: number, qualifierToken: unknown)
```

This works as constructor injection and uses a **qualifier** to resolve the correct implementation at runtime.

### Key Concepts

- `constructorArgIndex`: The index of the constructor argument where the dependency should be injected.
- `qualifierToken`: The key used to identify the correct mapped implementation.

You can inject mapped dependencies directly into constructors using `@InjectMappedDependency`. The qualifier token can be **any unique value**: a class, string, symbol, etc.

## Example: Injecting by Qualifier

Let's create a `StartupService` that the `IRequestHandler` dependency is injected using a mapped dependency identified by `SayHelloCommand`.

### Step 1: Register the Mapped Dependency

```ts title="TypeScript"
dependencyContainer.addMappedSingleton<IRequestHandler<SayHelloCommand, string>, SayHelloCommandHandler>({
  qualifierToken: SayHelloCommand,
});
```

### Step 2: Define the Service with Injection

We use the `@InjectMappedDependency` decorator on the constructor to tell the container to inject a mapped instance of `IRequestHandler` using `SayHelloCommand` as the key (qualifierToken).

```ts title="TypeScript"
import { InjectMappedDependency } from "dipend";
import { IRequestHandler } from "../mediator/request-handler.interface";
import { SayHelloCommand } from "../commands/say-hello";

@InjectMappedDependency(0, SayHelloCommand)
export class StartupService {
  constructor(private sayHelloHandler: IRequestHandler<SayHelloCommand, string>) {}

  public async greetUser(name: string) {
    const command = new SayHelloCommand(name);
    const response = await this.sayHelloHandler.handleAsync(command);
    console.log(response);
  }
}
```

This automatically injects the correct IRequestHandler for SayHelloCommand without any manual lookup or conditional logic.

### Step 3: Register and Use the Service

```ts title="TypeScript"
dependencyContainer.addSingleton(StartupService);
dependencyContainer.buildSingletons();

const startupService = dependencyContainer.getDependency(StartupService);
await startupService.greetUser("John Doe"); // Hello John Doe
```
