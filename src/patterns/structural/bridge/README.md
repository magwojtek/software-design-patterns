# Bridge Pattern

## Overview

The Bridge pattern is a structural design pattern that separates an abstraction from its implementation, allowing the two to vary independently. It involves creating a bridge interface that acts as a connector between two separate class hierarchies: an abstraction hierarchy and an implementation hierarchy.

## Problem

When you need to handle multiple variations of related objects, a simple inheritance hierarchy can quickly become complex and difficult to maintain. For example:

- Different types of UI elements with different rendering methods
- Different shapes with different drawing implementations
- Remote controls for different devices
- Different database connections with common operations

As the number of variations grows, the class hierarchy explodes in complexity, causing maintenance challenges and code duplication.

## Diagram

```
┌─────────────────┐                   ┌─────────────────┐
│                 │                   │                 │
│   Abstraction   │                   │ Implementation  │
│                 │─┬─────────────────│    Interface    │
└────────┬────────┘ │                 │                 │
         │          │                 └────────┬────────┘
         ▼          │                          ▲
┌─────────────────┐ │                          │
│                 │ │                 ┌────────┴────────┐
│ RefinedAbstract │ │                 │                 │
│                 │─┘                 │ConcreteImplement│
└─────────────────┘                   │                 │
                                      └─────────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach often involves using inheritance and creating a separate class for each combination of abstraction and implementation.

#### Pseudo Code (Anti-Pattern)

```typescript
// Without Bridge Pattern: Explosion of classes with tightly coupled abstractions and implementations

// Shapes with different rendering methods
class Circle {
    radius: number;
    
    constructor(radius: number) {
        this.radius = radius;
    }
    
    drawOnCanvas() {
        console.log(`Drawing a circle with radius ${this.radius} on canvas`);
        // Canvas specific drawing code
    }
    
    drawOnSVG() {
        console.log(`Drawing a circle with radius ${this.radius} on SVG`);
        // SVG specific drawing code
    }
    
    drawOnWebGL() {
        console.log(`Drawing a circle with radius ${this.radius} on WebGL`);
        // WebGL specific drawing code
    }
}

class Rectangle {
    width: number;
    height: number;
    
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    
    drawOnCanvas() {
        console.log(`Drawing a rectangle with width ${this.width} and height ${this.height} on canvas`);
        // Canvas specific drawing code
    }
    
    drawOnSVG() {
        console.log(`Drawing a rectangle with width ${this.width} and height ${this.height} on SVG`);
        // SVG specific drawing code
    }
    
    drawOnWebGL() {
        console.log(`Drawing a rectangle with width ${this.width} and height ${this.height} on WebGL`);
        // WebGL specific drawing code
    }
}

// If we add a new shape, we need to implement all rendering methods
class Triangle {
    a: number;
    b: number;
    c: number;
    
    constructor(a: number, b: number, c: number) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    
    drawOnCanvas() {
        console.log(`Drawing a triangle with sides ${this.a}, ${this.b}, ${this.c} on canvas`);
        // Canvas specific drawing code
    }
    
    drawOnSVG() {
        console.log(`Drawing a triangle with sides ${this.a}, ${this.b}, ${this.c} on SVG`);
        // SVG specific drawing code
    }
    
    drawOnWebGL() {
        console.log(`Drawing a triangle with sides ${this.a}, ${this.b}, ${this.c} on WebGL`);
        // WebGL specific drawing code
    }
}

// If we add a new rendering method, we need to modify all shape classes
```

#### Issues with Anti-Pattern:

1. **Class explosion**: Each new shape or rendering method requires multiple new classes/methods
2. **Code duplication**: Similar rendering logic duplicated across different shape classes
3. **Poor extensibility**: Adding a new shape or rendering method requires modifying multiple classes
4. **Tight coupling**: Shapes are tightly coupled with rendering implementations
5. **Maintainability issues**: Changes to rendering logic must be updated in multiple places

### Proper Pattern Implementation

The proper implementation separates the abstraction (shapes) from the implementation (rendering methods), allowing them to vary independently.

#### Pseudo Code (Proper Pattern)

```typescript
// Renderer Interface (Implementation)
interface Renderer {
    renderCircle(radius: number): void;
    renderRectangle(width: number, height: number): void;
    renderTriangle(a: number, b: number, c: number): void;
}

// Concrete Renderers (Concrete Implementations)
class CanvasRenderer implements Renderer {
    renderCircle(radius: number): void {
        console.log(`Rendering circle with radius ${radius} on Canvas`);
        // Canvas-specific circle rendering
    }
    
    renderRectangle(width: number, height: number): void {
        console.log(`Rendering rectangle with width ${width} and height ${height} on Canvas`);
        // Canvas-specific rectangle rendering
    }
    
    renderTriangle(a: number, b: number, c: number): void {
        console.log(`Rendering triangle with sides ${a}, ${b}, ${c} on Canvas`);
        // Canvas-specific triangle rendering
    }
}

class SVGRenderer implements Renderer {
    renderCircle(radius: number): void {
        console.log(`Rendering circle with radius ${radius} on SVG`);
        // SVG-specific circle rendering
    }
    
    renderRectangle(width: number, height: number): void {
        console.log(`Rendering rectangle with width ${width} and height ${height} on SVG`);
        // SVG-specific rectangle rendering
    }
    
    renderTriangle(a: number, b: number, c: number): void {
        console.log(`Rendering triangle with sides ${a}, ${b}, ${c} on SVG`);
        // SVG-specific triangle rendering
    }
}

class WebGLRenderer implements Renderer {
    renderCircle(radius: number): void {
        console.log(`Rendering circle with radius ${radius} on WebGL`);
        // WebGL-specific circle rendering
    }
    
    renderRectangle(width: number, height: number): void {
        console.log(`Rendering rectangle with width ${width} and height ${height} on WebGL`);
        // WebGL-specific rectangle rendering
    }
    
    renderTriangle(a: number, b: number, c: number): void {
        console.log(`Rendering triangle with sides ${a}, ${b}, ${c} on WebGL`);
        // WebGL-specific triangle rendering
    }
}

// Shape abstraction
abstract class Shape {
    protected renderer: Renderer;
    
    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }
    
    abstract draw(): void;
    
    // Can change renderer at runtime
    setRenderer(renderer: Renderer): void {
        this.renderer = renderer;
    }
}

// Refined abstractions
class Circle extends Shape {
    private radius: number;
    
    constructor(renderer: Renderer, radius: number) {
        super(renderer);
        this.radius = radius;
    }
    
    draw(): void {
        this.renderer.renderCircle(this.radius);
    }
}

class Rectangle extends Shape {
    private width: number;
    private height: number;
    
    constructor(renderer: Renderer, width: number, height: number) {
        super(renderer);
        this.width = width;
        this.height = height;
    }
    
    draw(): void {
        this.renderer.renderRectangle(this.width, this.height);
    }
}

class Triangle extends Shape {
    private a: number;
    private b: number;
    private c: number;
    
    constructor(renderer: Renderer, a: number, b: number, c: number) {
        super(renderer);
        this.a = a;
        this.b = b;
        this.c = c;
    }
    
    draw(): void {
        this.renderer.renderTriangle(this.a, this.b, this.c);
    }
}

// Client code
const canvasRenderer = new CanvasRenderer();
const svgRenderer = new SVGRenderer();

const circle = new Circle(canvasRenderer, 5);
circle.draw(); // "Rendering circle with radius 5 on Canvas"

// Can switch renderer at runtime
circle.setRenderer(svgRenderer);
circle.draw(); // "Rendering circle with radius 5 on SVG"

// Adding new shapes or renderers is straightforward and doesn't affect existing code
```

#### Benefits of Proper Implementation:

1. **Separation of concerns**: Abstractions and implementations evolve independently
2. **Open/Closed Principle**: Adding new shapes or renderers doesn't require modifying existing code
3. **Composition over inheritance**: Uses object composition for more flexibility
4. **Runtime flexibility**: Can change implementations at runtime
5. **Reduces class count**: No need for a class for each combination of abstraction and implementation

## Visual Comparison

```
┌───────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                                │
└───────────────────────────────────────────────────────────────────┘
┌───────────┐          ┌───────────┐          ┌───────────┐
│           │          │           │          │           │
│  Circle   │          │ Rectangle │          │ Triangle  │
│           │          │           │          │           │
└─────┬─────┘          └─────┬─────┘          └─────┬─────┘
      │                      │                      │      
┌─────┴──────────────────────┴──────────────────────┴─────┐
│                                                         │
│ ● drawOnCanvas()                                        │
│ ● drawOnSVG()                                           │
│ ● drawOnWebGL()                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
         Each shape has all rendering methods


┌───────────────────────────────────────────────────────────────────┐
│                       PROPER PATTERN                              │
└───────────────────────────────────────────────────────────────────┘
Abstraction Hierarchy         ◄───Bridge───►    Implementation Hierarchy
┌───────────┐                                   ┌───────────────┐
│           │                                   │               │
│   Shape   │─────────────────────────────────► │   Renderer    │
│           │                                   │   Interface   │
└─────┬─────┘                                   └───────┬───────┘
      │                                                 │
      ▼                                                 ▼
┌──────┬─────────┬────────┐                  ┌────────┬────────┬────────┐
│      │         │        │                  │        │        │        │
│Circle│Rectangle│Triangle│                  │Canvas  │ SVG    │ WebGL  │
│      │         │        │                  │Renderer│Renderer│Renderer│
└──────┴─────────┴────────┘                  └────────┴────────┴────────┘
                                                 
```

## Best Practices

1. Define the abstraction interface first, then the implementation interface
2. Use the pattern when you want to avoid a permanent binding between abstraction and implementation
3. Consider using the Bridge when you have orthogonal dimensions in your system (e.g., shapes and renderers)
4. Composition is key in this pattern, not inheritance
5. Bridge works well with the Adapter pattern when you need to adapt existing implementations

## When to Use

- When you want to avoid a permanent binding between abstractions and implementations
- When both the abstractions and the implementations should be extensible independently
- When changes in the implementation shouldn't impact the client code
- When you have a class hierarchy that would benefit from being split along orthogonal dimensions
- When you want to share an implementation among multiple objects

## When to Avoid

- When a simple inheritance hierarchy is sufficient for your needs
- When there's only one implementation and it's unlikely to change
- When the complexity of introducing the bridge outweighs its benefits
- When performance is critical (the bridge adds a level of indirection)

## Real-World Examples

### GUI Framework Architecture
Modern cross-platform GUI frameworks like Qt and JavaFX use the Bridge pattern to separate the platform-independent API (abstraction) from the platform-specific implementation. This allows applications to run on multiple operating systems while maintaining a consistent interface for developers.

### Device Drivers
Operating systems use the Bridge pattern to separate device-independent code from device-specific drivers. The OS provides an abstraction layer with standard operations while hardware vendors implement the specific device drivers, allowing hardware to evolve independently of the OS.

### Persistence Frameworks
ORM tools like Hibernate and Entity Framework use the Bridge pattern to separate database operations (abstractions) from specific database providers (implementations). Applications can switch between MySQL, PostgreSQL, or SQL Server without changing the core business logic.

### Graphics Libraries
Graphics systems like DirectX and OpenGL use the Bridge pattern to separate graphics primitives from rendering implementations. The same drawing operations can be rendered using different hardware acceleration methods or software fallbacks based on available resources.

### Remote Service Communication
Distributed application frameworks use the Bridge pattern to separate service interfaces from their communication protocols. A service can be accessed through different protocols (HTTP, gRPC, WebSockets) while maintaining the same API, allowing the communication method to change without affecting service consumers.

## Further Considerations

- **Interface Segregation**: Consider splitting large implementation interfaces into smaller ones
- **Lazy Loading**: You can use bridge to implement lazy loading of implementation objects
- **State Pattern Combo**: Combine with the State pattern to change behavior at runtime
- **Hierarchies**: Both abstraction and implementation can form hierarchies
- **Factories**: Consider using factories to create appropriate implementations for abstractions