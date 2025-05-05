---
title: Lifecycles
description: Lifecycles guide.
sidebar:
  order: 20
---

When registering dependencies in Dipend, you choose how they are **instantiated** and **managed** over time. This is known as their **lifecycle**.

Dipend supports two lifecycles out of the box:

| Lifecycle | Instantiated When           | Instance Reused? | Suitable For                  |
| --------- | --------------------------- | ---------------- | ----------------------------- |
| Singleton | Once (on demand or eagerly) | Yes              | Configs, services, loggers    |
| Transient | Every request               | No               | Request-based, stateful logic |

### Singleton

A **singleton** is created **once** and reused throughout the entire application.

#### Use When:

- The class is stateless or expensive to construct.
- You want shared behavior or shared state (e.g., configuration, database connection, loggers).

#### Behavior:

- Instantiated once.
- Always the same instance is returned.

#### Example:

```ts
dependencyContainer.addSingleton<ILogger, Logger>();

const logger1 = dependencyContainer.getDependency<ILogger>();
const logger2 = dependencyContainer.getDependency<ILogger>();

console.log(logger1 === logger2); // true ✅
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

```ts
dependencyContainer.addTransient<UserService>();

const service1 = dependencyContainer.getDependency<UserService>();
const service2 = dependencyContainer.getDependency<UserService>();

console.log(service1 === service2); // false ✅
```

---

### Mixing Lifecycles

Dipend handles mixed dependencies gracefully. For example:

- A `Singleton` can depend on other `Singletons` or `Transients` (read bellow).
- A `Transient` can depend on `Singletons` or other `Transients`.

However:

> ⚠️ **A Singleton depending on a Transient** will resolve the transient only **once** — when the singleton is created.

This is expected behavior — but it's important to be aware if you're injecting anything stateful into a singleton.

---

### When Are Instances Created?

You can control when singleton instances are actually built:

```ts
container.buildSingletons(); // Eagerly builds all singletons now
```

Otherwise, Dipend will lazily build singletons the first time they are needed.
