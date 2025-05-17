---
title: Quickstart
description: Quickstart guide.
sidebar:
  order: 10
---

Dipend is a lightweight dependency injection container for TypeScript that supports interface-based registration, a feature no other TypeScript DI library offers natively.

Follow these simple steps to get started:

### Prerequisites

Before getting started, make sure you have:

- Node.js ≥ 18.x
- TypeScript installed (tsc)
- ts-node (optional, to run .ts files without compiling)

### Setup from Scratch

Follow these steps to create a new project using Dipend:

```bash
# 1. Create a new directory and initialize the project
mkdir my-app && cd my-app
npm init -y

# 2. Install TypeScript (as a dev dependency)
npm install --save-dev typescript

# 3. Initialize TypeScript configuration
npx tsc --init

# 4. (Optional) Install ts-node to run TypeScript files directly
npm install --save-dev ts-node

# 5. Initialize Dipend
npx dipend init

# 6. Install project dependencies
npm install
```

This will:

- Add `dipend` to your `package.json`
- Update your `tsconfig.json` with the required options

**Optional**: If you want to visualize your dependency graph in a browser, install dipend-graph:

```bash
npm install dipend-graph
```

### When You Run `npx dipend init`:

Dipend automatically updates your `package.json` to ensure the TypeScript build process is correctly configured.

If your project already has a build script like:

```json title="package.json"
{
  "scripts": {
    "build": "tsc"
  }
}
```

It will automatically update it to:

```json title="package.json"
{
  "scripts": {
    "build": "dipend tsc"
  }
}
```

If no script exists, it will NOT add one for you.

By running `dipend tsc` instead of plain `tsc`, Dipend is able to:

- Analyze and map interface-to-class relationships
- Generate metadata required for dependency resolution

### Define Your Interfaces and Classes

```ts title="logger.ts"
export interface ILogger {
  info(message: string): void;
}

export class ConsoleLogger implements ILogger {
  info(message: string) {
    console.log(`[INFO]: ${message}`);
  }
}
```

### Create a Class with Dependencies

```ts title="greeter.ts"
import { ILogger } from "./logger";

export class Greeter {
  constructor(private logger: ILogger) {}

  greet(name: string): string {
    const message = `Hello, ${name}!`;
    this.logger.info(message);
    return message;
  }
}
```

### Register and Resolve Dependencies

```ts title="index.ts"
import { DependencyContainer } from "dipend";
import { ILogger, ConsoleLogger } from "./logger";
import { Greeter } from "./greeter";

const dependencyContainer = new DependencyContainer();

dependencyContainer.addSingleton<ILogger, ConsoleLogger>();
dependencyContainer.addTransient<Greeter>();

dependencyContainer.buildSingletons();

const greeter = dependencyContainer.getDependency<Greeter>();
console.log(greeter.greet("World"));
```

With Graph Visualization (Optional):

```ts title="index.ts" ins={2,13-14}
import { DependencyContainer } from "dipend";
import { DipendGraphServer } from "dipend-graph";
import { ILogger, ConsoleLogger } from "./logger";
import { Greeter } from "./greeter";

const dependencyContainer = new DependencyContainer();

dependencyContainer.addSingleton<ILogger, ConsoleLogger>();
dependencyContainer.addTransient<Greeter>();

dependencyContainer.buildSingletons();

const dipendGraphServer = new DipendGraphServer(dependencyContainer);
dipendGraphServer.start();

const greeter = dependencyContainer.getDependency<Greeter>();
console.log(greeter.greet("World"));
```

### Add Dev Script

```json title="package.json"
{
  "scripts": {
    "dev": "dipend ts-node ./index.ts"
  }
}
```

### Run Your Application

```bash
npm run dev
```

#### That's It!

You're now using fully typed, interface-based dependency injection in TypeScript, with no extra boilerplate or custom tokens.
