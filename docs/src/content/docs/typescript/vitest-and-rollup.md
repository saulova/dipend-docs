---
title: Vitest and Rollup
description: How to use Vitest and Rollup with Dipend.
sidebar:
  order: 30
---

Dipend integrates cleanly with modern development tools like [Vitest](https://vitest.dev/) for testing and [Rollup](https://rollupjs.org/) for bundling. This guide walks you through how to configure each.

## Using Vitest for Testing

[Vitest](https://vitest.dev) is a fast unit test framework built on top of Vite, with first-class TypeScript support.

### Install Vitest and Related Tools

```bash
npm install --save-dev vitest @vitest/ui @rollup/plugin-typescript ts-patch
```

### Initialize Dipend

If not already done:

```bash
npx dipend init
```

### Example Vitest Configuration

Create or edit a file called `vitest.config.ts`:

```ts title="vitest.config.ts" ins={2-3,15}
import { defineConfig } from "vitest/config";
import tsPlugin from "@rollup/plugin-typescript";
const tspCompiler = require("ts-patch/compiler");

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: ["**/node_modules/**", "**/vitest.config.ts", "**/dist/**"],
    },
  },
  server: {
    host: "127.0.0.1",
  },
  plugins: [tsPlugin({ typescript: tspCompiler })],
});
```

### Writing a Simple Test

Create a test like this:

```ts title="greeter.test.ts"
import { describe, it, expect, vi } from "vitest";
import { DependencyContainer } from "dipend";
import { Greeter } from "./greeter";
import { ILogger } from "./logger";

describe("Greeter", () => {
  const dependencyContainer = new DependencyContainer();

  afterEach(() => {
    vi.restoreAllMocks();
    dependencyContainer.reset(); // clean the container
  });

  it("greets with a name", () => {
    const logger: ILogger = { info: vi.fn() };

    dependencyContainer.addSingletonInstance<ILogger>({ instance: logger });
    dependencyContainer.addSingleton<Greeter>();

    const greeter = dependencyContainer.getDependency<Greeter>();

    expect(greeter.greet("Alice")).toBe("Hello, Alice!");
    expect(logger.info).toHaveBeenCalledWith("Hello, Alice!");
  });
});
```

### Run Tests

```bash
npx vitest run
```

Or with UI:

```bash
npx vitest --ui
```

---

## Using Rollup for Bundling

[Rollup](https://rollupjs.org/) is a modern bundler ideal for building TypeScript libraries and applications.

### Install Rollup

```bash
npm install --save-dev rollup @rollup/plugin-typescript ts-patch
```

### Initialize Dipend

If not already done:

```bash
npx dipend init
```

### Basic Rollup Configuration

Create a `rollup.config.js` file:

```ts title="rollup.config.js" ins={1-2,11}
import typescript from "@rollup/plugin-typescript";
const tspCompiler = require("ts-patch/compiler");

export default {
  input: "./index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [typescript({ typescript: tspCompiler })],
};
```

### Build with Rollup

```bash
npx rollup -c
```

This will bundle your application or library into the `dist` folder.

---

You’re now set up for a full development workflow using Dipend, Vitest, and Rollup!
