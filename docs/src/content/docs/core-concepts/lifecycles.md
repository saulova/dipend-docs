---
title: Lifecycles
description: Lifecycles guide.
sidebar:
  order: 20
---

When registering dependencies in Dipend, you choose how they are **instantiated** and **managed** over time. This is known as their **lifecycle**.

Dipend supports two lifecycles out of the box:

| Lifecycle   | Instantiated When                       | Instance Reused?   | Suitable For                            |
| ----------- | --------------------------------------- | ------------------ | --------------------------------------- |
| Singleton   | Once (on demand or eagerly)             | Yes                | Configs, services, loggers              |
| Transient   | Every request                           | No                 | Request-based, stateful logic           |
| Per Context | Once per context (on demand or eagerly) | Yes (same context) | Unit of work, scoped services, batching |

### Singleton

A **singleton** is created **once** and reused throughout the entire application.

#### Use When:

- The class is stateless or expensive to construct.
- You want shared behavior or shared state (e.g., configuration, database connection, loggers).

#### Behavior:

- Instantiated once.
- Always the same instance is returned.

#### Example:

```ts title=TypeScript
dependencyContainer.addSingleton<ILogger, Logger>();

const logger1 = dependencyContainer.getDependency<ILogger>();
const logger2 = dependencyContainer.getDependency<ILogger>();

console.log(logger1 === logger2); // true ✅
```

```python title=Python
dependency_container.add_singleton(UserService)

service1 = dependency_container.get_dependency(UserService)
service2 = dependency_container.get_dependency(UserService)

print(service1 is service2) # True ✅
```

---

### Transient

A **transient** dependency is created **every time** it is requested.

#### Use When:

- The class holds request-specific or temporary state.
- You need complete isolation between usages.

#### Behavior:

- A **new instance** is created for every `getDependency` call.
- Dependencies of a transient service are resolved fresh as well.

#### Example:

```ts title=TypeScript
dependencyContainer.addTransient<UserService>();

const service1 = dependencyContainer.getDependency<UserService>();
const service2 = dependencyContainer.getDependency<UserService>();

console.log(service1 === service2); // false ✅
```

```python title=Python
dependency_container.add_transient(UserService)

service1 = dependency_container.get_dependency(UserService)
service2 = dependency_container.get_dependency(UserService)

print(service1 is service2) # False ✅
```

---

### Per Context (Python Only)

A per context dependency is created once per resolution scope, perfect for scenarios where you want consistency within a request, job, or transaction, without sharing across the entire app.

#### Use When:

- You want all dependencies in a single operation (e.g., a request) to share the same instance.
- You need consistency across a batch of operations but not globally.

Useful for Unit of Work, scoped caching, or transactional logic.

#### Behavior:

- A new instance is created per resolution context.
- That instance is reused only within that context of resolutions.
- Outside of that context, a new instance is created.

#### Example:

```python title=Python
dependency_container.add_per_context(UserService)

with api.context():
    service1 = dependency_container.get_dependency(UserService)

with api.context():
    service2 = dependency_container.get_dependency(UserService)
    service3 = dependency_container.get_dependency(UserService)
    print(service2 is service3) # True ✅

print(service1 is service2) # False ✅
```

---

### Mixing Lifecycles

Dipend handles mixed dependencies gracefully. For example:

- A `Singleton` can depend on other `Singletons` or `Transients` (read below).
- A `Transient` can depend on `Singletons` or other `Transients`.
- A `Per Context` can depend on `Singletons`, `Transients`, or other `Per Context` dependencies **within the same context**.

However:

> ⚠️ **A Singleton depending on a Transient** will resolve the transient only **once** — when the singleton is created.

This is expected behavior, but it's important to be aware if you're injecting anything stateful into a singleton.

> ⚠️ **A Singleton depending on a Per Context** will not receive context-scoped behavior. The dependency will be resolved once, outside of any context.

To preserve correct scoping, avoid injecting context-bound services (like `Per Context`) into singletons unless you're managing resolution manually within the context.
