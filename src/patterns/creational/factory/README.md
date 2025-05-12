# Factory Pattern

## Overview

The Factory pattern is a creational pattern that provides an interface for creating objects without specifying their concrete classes. It encapsulates object creation logic, promoting loose coupling between client code and concrete implementations.

## Problem

Creating objects directly using the `new` operator leads to tight coupling between the client code and concrete implementations. This makes the code less flexible and harder to maintain, especially when:

- The exact type of objects to be created is determined at runtime
- You want to add new types of objects without modifying existing code
- You want to hide complex creation logic from client code
- You need to test code that uses different implementations

## Diagram

### Simple Factory Pattern

```
┌─────────────┐         ┌───────────────┐
│             │ creates │   Product     │
│   Factory   ├────────►│   Interface   │
│             │         └───────┬───────┘
└─────────────┘                 │
                                │ implements
                      ┌─────────┼─────────┐
                      │         │         │
               ┌──────▼─┐ ┌─────▼──┐ ┌────▼───┐
               │ProductA│ │ProductB│ │ProductC│
               └────────┘ └────────┘ └────────┘
```

### Factory Method Pattern

```
┌────────────────┐          ┌────────────┐
│  CreatorBase   │          │  Product   │
│  (abstract)    │          │ Interface  │
├────────────────┤          └──────┬─────┘
│ createProduct()│                 │
└───────┬────────┘                 │
        │                          │
┌───────┼───────┐                  │implements
│       │       │                  │
┌───────▼┐ ┌────▼────────┐   ┌─────▼───┐
│CreatorA│ │CreatorB     │   │ProductA │
├────────┤ ├────────────┐│   └─────────┘
│create  │ │createProduct│    ┌─────────┐
│Product │ └─────────────┘    │ProductB │
└────────┘                    └─────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing a factory typically involves direct instantiation with conditional logic scattered throughout the client code.

#### Pseudo Code (Anti-Pattern)

```typescript
// Product classes without a common interface
class Rectangle {
    private width: number;
    private height: number;
    
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    
    public getArea(): number {
        return this.width * this.height;
    }
}

class Circle {
    private radius: number;
    
    constructor(radius: number) {
        this.radius = radius;
    }
    
    public getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
}

class Triangle {
    private base: number;
    private height: number;
    
    constructor(base: number, height: number) {
        this.base = base;
        this.height = height;
    }
    
    public getArea(): number {
        return (this.base * this.height) / 2;
    }
}

// Client code with conditional logic for object creation
function createShape(type: string, ...params: number[]): any {
    if (type === 'rectangle' && params.length >= 2) {
        return new Rectangle(params[0], params[1]);
    } else if (type === 'circle' && params.length >= 1) {
        return new Circle(params[0]);
    } else if (type === 'triangle' && params.length >= 2) {
        return new Triangle(params[0], params[1]);
    } else {
        throw new Error(`Cannot create shape of type ${type}`);
    }
}

// Usage:
const myCircle = createShape('circle', 5);
const myRectangle = createShape('rectangle', 4, 6);
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Client code is directly coupled to concrete classes
2. **Violation of Open/Closed Principle**: Adding new shapes requires modifying the existing `createShape` function
3. **Hard to test**: Difficult to mock object creation for testing
4. **Type safety issues**: Return type is non-specific (`any`)
5. **Scattered creation logic**: Object creation logic may be duplicated across the codebase

### Proper Pattern Implementation

The proper implementation uses interfaces and dedicated factory classes to decouple object creation.

#### Pseudo Code (Proper Pattern)

```typescript
// Common interface for all shapes
interface Shape {
    getArea(): number;
    toString(): string;
}

// Concrete shape implementations
class Rectangle implements Shape {
    constructor(private width: number, private height: number) {}
    
    public getArea(): number {
        return this.width * this.height;
    }
    
    public toString(): string {
        return `Rectangle with width: ${this.width}, height: ${this.height}`;
    }
}

class Circle implements Shape {
    constructor(private radius: number) {}
    
    public getArea(): number {
        return Math.PI * this.radius * this.radius;
    }
    
    public toString(): string {
        return `Circle with radius: ${this.radius}`;
    }
}

class Triangle implements Shape {
    constructor(private base: number, private height: number) {}
    
    public getArea(): number {
        return (this.base * this.height) / 2;
    }
    
    public toString(): string {
        return `Triangle with base: ${this.base}, height: ${this.height}`;
    }
}

// Factory interface
interface ShapeFactory {
    createShape(...params: number[]): Shape;
}

// Concrete factories
class RectangleFactory implements ShapeFactory {
    createShape(width: number, height: number): Shape {
        return new Rectangle(width, height);
    }
}

class CircleFactory implements ShapeFactory {
    createShape(radius: number): Shape {
        return new Circle(radius);
    }
}

class TriangleFactory implements ShapeFactory {
    createShape(base: number, height: number): Shape {
        return new Triangle(base, height);
    }
}

// Factory producer - an abstract factory approach
class ShapeFactoryProducer {
    static getFactory(shapeType: string): ShapeFactory {
        switch (shapeType.toLowerCase()) {
            case 'rectangle':
                return new RectangleFactory();
            case 'circle':
                return new CircleFactory();
            case 'triangle':
                return new TriangleFactory();
            default:
                throw new Error(`No factory found for shape type: ${shapeType}`);
        }
    }
}

// Usage:
const circleFactory = ShapeFactoryProducer.getFactory('circle');
const myCircle = circleFactory.createShape(5);

const rectangleFactory = ShapeFactoryProducer.getFactory('rectangle');
const myRectangle = rectangleFactory.createShape(4, 6);
```

#### Benefits of Proper Implementation:

1. **Loose coupling**: Client code depends on abstractions, not concrete classes
2. **Open/Closed Principle**: New shapes can be added without modifying existing code
3. **Better testability**: Easier to mock interfaces for testing
4. **Type safety**: Return types are well-defined
5. **Centralized creation logic**: Object creation is encapsulated in dedicated factory classes

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
  ┌─────────┐                            ┌─────────────┐
  │ Client  │                            │ createShape │
  └────┬────┘                            └──────┬──────┘
       │                                        │
       ├───────────────────────────────────────►│ if (type === 'rectangle')
       │                                        │     return new Rectangle()
       │                                        │ else if (type === 'circle')
       │                                        │     return new Circle()
       │                                        │ else if (type === 'triangle')
       │◄───────────────────────────────────────┤     return new Triangle()
       │                                        │
       │                                        │
  concrete object                               │

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘
  ┌─────────┐        ┌────────────────┐              ┌───────────┐
  │ Client  │───────►│ ShapeFactory   │─────────────►│  Shape    │
  └─────────┘        │  Producer      │              │ Interface │
                     └────────┬───────┘              └─────┬─────┘
                              │                            │implements
                              │                            │
                     ┌────────▼───────┐                    │
                     │ ShapeFactory   │                    │
                     │ Interface      │                    │
                     └────────┬───────┘                    │
                              │implements                  │
                ┌─────────────┼─────────┐                  │
                │             │         │                  │
        ┌───────▼───┐  ┌──────▼───┐ ┌──▼─────────┐         │
        │ Rectangle │  │ Circle   │ │ Triangle   │         │
        │ Factory   │  │ Factory  │ │ Factory    │         │
        └─────┬─────┘  └────┬─────┘ └─────┬──────┘         │
              │             │             │                │
              ▼             ▼             ▼                │
        ┌──────────┐  ┌──────────┐  ┌──────────┐ implements│
        │Rectangle │  │ Circle   │  │ Triangle │◄───────── │
        └──────────┘  └──────────┘  └──────────┘
```

## Best Practices

1. Start with a common interface for all products
2. Create factory interfaces for consistent object creation
3. Use factory methods to encapsulate object creation logic
4. Consider using an abstract factory for families of related objects
5. Implement proper error handling for unsupported types

## When to Use

- When the exact implementation of objects is determined at runtime
- When you need to work with objects through their interfaces, not concrete implementations
- When adding new types of objects without breaking existing code is important
- When creating objects involves complex logic you want to hide from client code
- When object creation requires specific resources or configurations

## When to Avoid

- When you have a simple object creation process that's unlikely to change
- When you have few concrete implementations that rarely change
- When you don't need to abstract away object creation
- When the extra abstraction adds unnecessary complexity

## Real-World Examples

### GUI Libraries
Most UI frameworks use factories to create platform-specific UI components. For example, a button factory might create different button implementations depending on the operating system (Windows, macOS, or Linux) while presenting a consistent interface to the application code.

### Database Connectors
Database access libraries often use the Factory pattern to create connections to different database systems (MySQL, PostgreSQL, MongoDB) while providing a unified interface for executing queries.

### Payment Processing Systems
E-commerce applications use factories to handle different payment methods (credit card, PayPal, cryptocurrency). Each payment processor implements a common interface, but the factory determines which concrete implementation to use based on the customer's selection.

### Game Character Creation
In game development, factories are used to generate different types of game characters or enemies. The game engine can spawn various character types through a common factory interface without needing to know the specific implementation details of each character.

### Document Converters
Document processing applications use factories to create different document format converters. For example, a document might need to be exported to PDF, HTML, or plain text, each requiring different converter implementations that share a common interface.

## Variations

### Simple Factory
A single class with a method for creating objects of different types. This is technically not a design pattern but a simple technique.

### Factory Method
Defines an interface for creating objects, but lets subclasses decide which classes to instantiate.

### Abstract Factory
Provides an interface for creating families of related or dependent objects without specifying their concrete classes.

## Further Considerations

- **Dynamic Factory Registration**: Consider allowing factories to register themselves dynamically to avoid switch statements or if-else chains
- **Factory with Parameters**: Factories can accept configuration parameters to further customize object creation
- **Lazy Initialization**: Factories can implement lazy initialization to defer expensive object creation
- **Caching/Object Pooling**: Factories can reuse objects to improve performance