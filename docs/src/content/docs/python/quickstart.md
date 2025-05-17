---
title: Quickstart
description: Quickstart guide.
sidebar:
  order: 10
---

Dipend is a lightweight dependency injection container for Python that supports interface-based registration.

Follow these simple steps to get started:

### Prerequisites

Before getting started, make sure you have:

- Pythom ≥ 3.12

### Setup from Scratch

Install the core Dipend package:

```bash
pip install dipend
```

**Optional**: If you want to visualize your dependency graph in a browser, install dipend-graph:

```bash
pip install dipend-graph
```

### Define Your Interfaces and Classes

```python title="logger.py"
from abc import ABC, abstractmethod

class ILogger(ABC):
    @abstractmethod
    def info(self, message: str) -> None:
        pass

class ConsoleLogger(ILogger):
    def info(self, message: str):
        print(f"[INFO]: {message}")

```

### Create a Class with Dependencies

```python title="greeter.py"
from .logger import ILogger

class Greeter:
    def __init__(self, logger: ILogger):
        self._logger = logger

    def greet(name: str) -> str:
        message = f"Hello, {name}!"
        self._logger.info(message)
        return message

```

### Register and Resolve Dependencies

```python title="app.py"
from dipend import DependencyContainer
from dipend_graph import DipendGraphServer
from .logger import ILogger, ConsoleLogger
from .greeter import Greeter

dependency_container = DependencyContainer()

dependency_container.add_singleton(ILogger, ConsoleLogger)
dependency_container.add_transient(Greeter)

dependency_container.build_singletons()

dipend_graph_server = DipendGraphServer(dependency_container)

dipend_graph_server.start()

const greeter = dependency_container.get_dependency(Greeter)
print(greeter.greet("World")) # Hello, World!

dipend_graph_server.hang()
```

With Graph Visualization (Optional):

```python title="app.py" ins={2,13-14,19}
from dipend import DependencyContainer
from dipend_graph import DipendGraphServer
from .logger import ILogger, ConsoleLogger
from .greeter import Greeter

dependency_container = DependencyContainer()

dependency_container.add_singleton(ILogger, ConsoleLogger)
dependency_container.add_transient(Greeter)

dependency_container.build_singletons()

dipend_graph_server = DipendGraphServer(dependency_container)
dipend_graph_server.start()

greeter = dependency_container.get_dependency(Greeter)
print(greeter.greet("World"))  # Hello, World!

dipend_graph_server.hang()

```

### Run Your Application

```bash
python app.py
```

#### That's It!

You're now using fully typed, interface-based dependency injection in python, with no extra boilerplate or custom tokens.
