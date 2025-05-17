---
title: Dependency Injection
description: Dependency Injection guide.
sidebar:
  order: 10
---

**Dependency Injection (DI)** is a design pattern and programming technique where an object or component receives its dependencies from an external source rather than creating them internally. Instead of hard-coding dependencies (e.g., services, configurations, or other objects), components declare what they need, and a **IoC (Inversion of Control) Container** (or framework) supplies those dependencies at runtime.

### Purpose of Dependency Injection

DI aims to:

- **Decouple components**: Reduce tight coupling between classes.
- **Improve testability**: Simplify mocking dependencies during testing.
- **Enhance maintainability**: Make codebases easier to refactor and extend.
- **Centralize configuration**: Manage dependencies in a single location.

### How Dependency Injection Works

1. **Dependencies are Defined**  
   Components specify dependencies via constructors, properties, or methods.

2. **DI Container Configuration**  
   A container is configured to map abstractions (e.g., interfaces) to concrete implementations.

3. **Dependency Resolution**  
   At runtime, the container resolves and injects dependencies automatically.

### Why Dependency Injection Matters?

Let's see an example below:

#### Without DI

```typescript title="TypeScript"
// Without DI: Tight coupling makes it hard to switch implementations
class ReportService {
  private exporter = new PDFExporter(); // Hardcoded dependency

  generateReport() {
    return this.exporter.export();
  }
}
```

```python title="Python"
# Without DI: Tight coupling makes it hard to switch implementations
class ReportService:
    def __init__(self):
        self._exporter = PDFExporter()

    def generateReport(self):
        return self._exporter.export()
```

#### With DI

```typescript title="TypeScript"
// With DI: Flexibility to inject any exporter (PDF, Excel, CSV)
class ReportService {
  constructor(private exporter: IReportExporter) {}
}

// Usage Example
const csvService = new ReportService(new CSVExporter());
const pdfService = new ReportService(new PDFExporter());
```

```python title="Python"
# With DI: Flexibility to inject any exporter (PDF, Excel, CSV)
class ReportService:
    def __init__(self, exporter: IReportExporter):
        self._exporter = exporter

# Usage Example
csv_service = ReportService(CSVExporter())
pdf_service = ReportService(PDFExporter())
```

### Key Benefits

1. **Eliminates Tight Coupling**  
   Without DI, components often create their own dependencies, leading to rigid code that’s hard to modify. DI promotes the _Inversion of Control (IoC)_ principle, where control over dependencies is shifted to a higher layer (e.g., the DI container).

1. **Simplifies Testing**  
   By injecting mock or stub dependencies, unit tests become isolated and deterministic.

1. **Enhances Scalability**  
   Large applications benefit from DI by organizing dependencies declaratively. Adding new features or swapping implementations (e.g., changing a logging service) requires minimal code changes.

1. **Promotes Reusability**  
   Components become modular and reusable across different contexts when dependencies are explicitly declared.

1. **Abstraction**  
   Components depend on abstractions, not concrete implementations.

1. **Centralized Management**  
   Dependencies are configured in one place.

1. **Improved Readability**  
   Clear visibility of component requirements.
