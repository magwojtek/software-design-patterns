# Visitor Pattern

## Overview

The Visitor pattern is a behavioral design pattern that lets you separate algorithms from the objects on which they operate. It allows you to add new operations to existing object structures without modifying those structures.

## Problem

In many scenarios, we need to perform various operations on a collection of different objects:

- We want to add new operations to existing classes without modifying them
- Related operations should be grouped together rather than scattered across classes
- Operations need to work with objects of different types in a class hierarchy
- We need to maintain a clean separation between data and the algorithms that operate on that data

## Diagram

```
┌─────────────────────┐       ┌───────────────────────────┐
│      Element        │       │        Visitor            │
├─────────────────────┤       ├───────────────────────────┤
│ + accept(visitor)   │------>│ + visitElementA(elementA) │
└─────────┬───────────┘       │ + visitElementB(elementB) │
          │                   │ + visitElementC(elementC) │
          │                   └─────────────┬─────────────┘
          │                                 │
    ┌─────┴─────────┐                   ┌───┴──────────┐
    │               │                   │              │
┌───▼─────┐     ┌───▼─────┐       ┌─────▼─────┐   ┌────▼──────┐
│ElementA │     │ElementB │       │VisitorA   │   │VisitorB   │
├─────────┤     ├─────────┤       ├───────────┤   ├───────────┤
│+accept()│     │+accept()│       │+visitElemA│   │+visitElemA│
└───┬─────┘     └───┬─────┘       │+visitElemB│   │+visitElemB│
    │               │             │+visitElemC│   │+visitElemC│
    │               │             └───────────┘   └───────────┘
    │               │
    └───────────────┴───┐
                        │
                        ▼
          for each element in structure:
             element.accept(visitor)
          
          // Inside ElementA.accept(visitor):
          visitor.visitElementA(this)
```

## Scenario

Imagine you're building a graphics application that works with different geometric shapes (circles, rectangles, triangles). You need to implement various operations on these shapes such as calculating area, drawing, exporting to different formats, and more.

**The problem:**
1. Each shape requires multiple operations (calculate area, draw, export)
2. New operations need to be added regularly without modifying existing shape classes
3. Related operations should be grouped together (all drawing operations in one place)
4. The system should be easily extensible for both new shapes and new operations

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach embeds operations directly in the shape classes, making it difficult to add new operations without modifying existing code.

#### Pseudo Code (Anti-Pattern)

```typescript
// Each shape class implements all operations directly
export class Circle {
    constructor(private radius: number, private x: number, private y: number) {}
    
    // Operation 1: Calculate area
    public calculateArea(): number {
        return Math.PI * this.radius * this.radius;
    }
    
    // Operation 2: Draw the shape
    public draw(): string {
        return `Drawing Circle at (${this.x}, ${this.y}) with radius ${this.radius}`;
    }
    
    // Operation 3: Export to JSON
    public exportToJson(): string {
        return JSON.stringify({
            type: 'circle',
            radius: this.radius,
            position: { x: this.x, y: this.y }
        });
    }
    
    // If we want to add a new operation, we need to modify this class
    // For example: calculate perimeter, scale, rotate, etc.
}

export class Rectangle {
    constructor(
        private width: number, 
        private height: number, 
        private x: number, 
        private y: number
    ) {}
    
    // Operation 1: Calculate area
    public calculateArea(): number {
        return this.width * this.height;
    }
    
    // Operation 2: Draw the shape
    public draw(): string {
        return `Drawing Rectangle at (${this.x}, ${this.y}) with width ${this.width} and height ${this.height}`;
    }
    
    // Operation 3: Export to JSON
    public exportToJson(): string {
        return JSON.stringify({
            type: 'rectangle',
            width: this.width,
            height: this.height,
            position: { x: this.x, y: this.y }
        });
    }
    
    // If we want to add a new operation, we need to modify this class
}

// Client code that uses the shapes
const circle = new Circle(5, 10, 15);
const rectangle = new Rectangle(4, 5, 10, 15);

console.log(circle.calculateArea());
console.log(circle.draw());
console.log(circle.exportToJson());

console.log(rectangle.calculateArea());
console.log(rectangle.draw());
console.log(rectangle.exportToJson());

// Adding a new operation requires modifying ALL shape classes
```

#### Anti-Pattern Diagram

```
┌───────────────────────────┐     ┌───────────────────────────┐
│          Circle           │     │        Rectangle          │
├───────────────────────────┤     ├───────────────────────────┤
│ - radius: number          │     │ - width: number           │
│ - x: number               │     │ - height: number          │
│ - y: number               │     │ - x: number               │
├───────────────────────────┤     │ - y: number               │
│ + calculateArea(): number │     ├───────────────────────────┤
│ + draw(): string          │     │ + calculateArea(): number │
│ + exportToJson(): string  │     │ + draw(): string          │
└───────────────────────────┘     │ + exportToJson(): string  │
                                  └───────────────────────────┘
                                  
// Each class implements all operations
// Adding a new operation requires modifying all classes
```

#### Issues with Anti-Pattern:

1. **Violates Open/Closed Principle**: Existing classes need to be modified to add new operations
2. **Operations scattered**: Related operations are spread across different classes
3. **Difficult to maintain**: Changes to operations require modifying multiple classes
4. **Poor organization**: Related algorithms are not grouped together
5. **Tight coupling**: Shape classes are coupled with all operations they support

### Proper Pattern Implementation

The proper implementation separates operations into visitor classes, allowing new operations to be added without modifying shape classes.

#### Pseudo Code (Proper Pattern)

```typescript
// Visitor interface
export interface ShapeVisitor {
    visitCircle(circle: Circle): any;
    visitRectangle(rectangle: Rectangle): any;
    visitTriangle(triangle: Triangle): any;
}

// Shape interface with accept method
export interface Shape {
    accept(visitor: ShapeVisitor): any;
}

// Concrete shape classes
export class Circle implements Shape {
    constructor(
        private radius: number,
        private x: number,
        private y: number
    ) {}
    
    public getRadius(): number { return this.radius; }
    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    
    // The accept method allows visitors to access the shape
    public accept(visitor: ShapeVisitor): any {
        return visitor.visitCircle(this);
    }
}

export class Rectangle implements Shape {
    constructor(
        private width: number,
        private height: number,
        private x: number,
        private y: number
    ) {}
    
    public getWidth(): number { return this.width; }
    public getHeight(): number { return this.height; }
    public getX(): number { return this.x; }
    public getY(): number { return this.y; }
    
    // The accept method allows visitors to access the shape
    public accept(visitor: ShapeVisitor): any {
        return visitor.visitRectangle(this);
    }
}

// Concrete visitor implementations
export class AreaCalculator implements ShapeVisitor {
    public visitCircle(circle: Circle): number {
        return Math.PI * circle.getRadius() * circle.getRadius();
    }
    
    public visitRectangle(rectangle: Rectangle): number {
        return rectangle.getWidth() * rectangle.getHeight();
    }
    
    public visitTriangle(triangle: Triangle): number {
        // Triangle area calculation
    }
}

export class DrawingVisitor implements ShapeVisitor {
    public visitCircle(circle: Circle): string {
        return `Drawing Circle at (${circle.getX()}, ${circle.getY()}) with radius ${circle.getRadius()}`;
    }
    
    public visitRectangle(rectangle: Rectangle): string {
        return `Drawing Rectangle at (${rectangle.getX()}, ${rectangle.getY()}) with width ${rectangle.getWidth()} and height ${rectangle.getHeight()}`;
    }
    
    public visitTriangle(triangle: Triangle): string {
        // Triangle drawing implementation
    }
}

// Client code
const circle = new Circle(5, 10, 15);
const rectangle = new Rectangle(4, 5, 10, 15);

const areaCalculator = new AreaCalculator();
const drawingVisitor = new DrawingVisitor();

console.log(circle.accept(areaCalculator));
console.log(circle.accept(drawingVisitor));

console.log(rectangle.accept(areaCalculator));
console.log(rectangle.accept(drawingVisitor));

// Adding a new operation is as simple as creating a new visitor
export class PerimeterCalculator implements ShapeVisitor {
    public visitCircle(circle: Circle): number {
        return 2 * Math.PI * circle.getRadius();
    }
    
    public visitRectangle(rectangle: Rectangle): number {
        return 2 * (rectangle.getWidth() + rectangle.getHeight());
    }
    
    public visitTriangle(triangle: Triangle): number {
        // Triangle perimeter calculation
    }
}
```

#### Proper Pattern Diagram

```
┌───────────────┐       ┌─────────────────────────┐
│    Shape      │       │     ShapeVisitor        │
├───────────────┤       ├─────────────────────────┤
│ + accept()    │------>│ + visitCircle()         │
└───────┬───────┘       │ + visitRectangle()      │
        │               │ + visitTriangle()       │
        │               └───────────┬─────────────┘
        │                           │
   ┌────┴────┐                 ┌────┴───────┐
   │         │                 │            │
┌──▼─────┐  ┌───▼─────┐    ┌───▼─────┐ ┌────▼────┐
│Circle  │  │Rectangle│    │AreaCalc │ │Drawing  │
│        │  │         │    │         │ │Visitor  │
└────────┘  └─────────┘    └─────────┘ └─────────┘
```

## Visual Comparison

```
┌────────────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐               │
│  │ Circle  │       │Rectangle│       │Triangle │               │
│  ├─────────┤       ├─────────┤       ├─────────┤               │
│  │area()   │       │area()   │       │area()   │               │
│  │draw()   │       │draw()   │       │draw()   │               │
│  │export() │       │export() │       │export() │               │
│  └─────────┘       └─────────┘       └─────────┘               │
│                                                                │
│  // Problem: Adding new operation requires modifying           │
│  // all shape classes                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    PROPER PATTERN                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐               │
│  │ Circle  │       │Rectangle│       │Triangle │               │
│  ├─────────┤       ├─────────┤       ├─────────┤               │
│  │accept() │       │accept() │       │accept() │               │
│  └────┬────┘       └────┬────┘       └────┬────┘               │
│       │                 │                 │                    │
│       └────────────────────┬──────────────┘                    │
│                            │                                   │
│                            ▼                                   │
│  ┌─────────────┐  ┌───────────┐  ┌─────────────┐               │
│  │AreaVisitor  │  │DrawVisitor│  │ExportVisitor│               │
│  ├─────────────┤  ├───────────┤  ├─────────────┤               │
│  │visitCircle()│  │visitCircle│  │visitCircle()│               │
│  │visitRect()  │  │visitRect()│  │visitRect()  │               │
│  │visitTri()   │  │visitTri() │  │visitTri()   │               │
│  └─────────────┘  └───────────┘  └─────────────┘               │
│                                                                │
│  // Solution: Adding new operation = adding new visitor        │
│  // class without modifying existing shape classes             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Benefits of Visitor Pattern

1. **Separation of concerns**: Separates algorithms from the objects they operate on
2. **Open/Closed Principle**: New operations can be added without modifying existing classes
3. **Single Responsibility Principle**: Each visitor class handles one specific operation
4. **Grouping related operations**: All related operations are grouped in a single visitor class
5. **Double dispatch**: Allows selecting the appropriate operation based on both the visitor and element types

## When to Use

- When you need to perform operations on a complex object structure
- When you want to add new operations to classes without modifying them
- When related operations should be grouped together rather than scattered across classes
- When the object structure rarely changes but operations on it change frequently
- When you need to maintain a clean separation between data and algorithms

## When to Avoid

- When the object structure changes frequently (adding new element types requires modifying all visitors)
- When the operations are simple and don't need to be grouped
- When visitors need access to private members of elements (requires exposing internal state)
- When the pattern introduces unnecessary complexity for simple operations
- When the double dispatch mechanism is not needed

## Real-World Examples

1. **Document Object Model (DOM)**: Visitors can traverse and operate on DOM elements
2. **Abstract Syntax Trees**: Compilers use visitors to perform operations on AST nodes
3. **Graphics Systems**: Operations like rendering, hit testing, and transformations on shape hierarchies
4. **Report Generation**: Generating different report formats from the same data structure
5. **Validation Systems**: Running different validation rules on complex object structures

## Example in Popular Libraries

The Visitor pattern is used in many TypeScript libraries and frameworks:

```typescript
// Example inspired by TypeScript AST processing in the TypeScript Compiler API

// Node interface (Element)
interface Node {
  kind: SyntaxKind;
  accept<T>(visitor: Visitor<T>): T;
}

// Concrete element types
class SourceFile implements Node {
  kind = SyntaxKind.SourceFile;
  statements: Statement[];
  
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitSourceFile(this);
  }
}

class FunctionDeclaration implements Node {
  kind = SyntaxKind.FunctionDeclaration;
  name: string;
  parameters: Parameter[];
  body: Block;
  
  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitFunctionDeclaration(this);
  }
}

// Visitor interface
interface Visitor<T> {
  visitSourceFile(node: SourceFile): T;
  visitFunctionDeclaration(node: FunctionDeclaration): T;
  // Other visit methods for different node types
}

// Concrete visitor implementation
class TypeScriptPrinter implements Visitor<string> {
  visitSourceFile(node: SourceFile): string {
    return `Source file with ${node.statements.length} statements`;
  }
  
  visitFunctionDeclaration(node: FunctionDeclaration): string {
    return `Function ${node.name} with ${node.parameters.length} parameters`;
  }
  
  // Other visit implementations
}
```

## Further Considerations

### 1. Double Dispatch Mechanism

The Visitor pattern relies on a technique called "double dispatch" to determine which method to call based on both the visitor and element types:

- **Single dispatch**: In most object-oriented languages, method selection is based on the runtime type of a single object (the one the method is called on).
- **Double dispatch**: The Visitor pattern achieves method selection based on two objects: the element (through polymorphic accept method) and the visitor (through overloaded visit methods).

Understanding this mechanism is crucial for implementing the pattern correctly and diagnosing issues when they arise.

### 2. Performance Considerations

The Visitor pattern introduces some overhead that should be considered:

- **Method call overhead**: Each operation involves at least two method calls (accept and visit)
- **Type checking**: Some implementations may require type checking or casting
- **Memory usage**: Maintaining separate visitor classes for each operation can increase memory usage

For performance-critical applications, carefully evaluate whether the benefits of the pattern outweigh these costs.

### 3. Extensibility Trade-offs

The Visitor pattern makes specific trade-offs regarding extensibility:

- **Easy to add operations**: Adding new operations is as simple as creating new visitor classes
- **Hard to add element types**: Adding new element types requires modifying all existing visitor interfaces and implementations

Choose this pattern when your object structure is stable but operations change frequently. If you expect to add new element types often, consider alternative patterns.

### 4. Visitor State

Visitors can maintain state between visits to different elements, enabling operations that need context from multiple elements:

- **Stateless visitors**: Process each element independently
- **Stateful visitors**: Accumulate information while traversing the object structure

When using stateful visitors, be careful about thread safety and ensure proper initialization between uses.

### 5. Cyclic Dependencies

The Visitor pattern can introduce cyclic dependencies between the element hierarchy and visitor hierarchy. To mitigate this:

- Consider using interfaces to break direct dependencies
- Place visitors and elements in separate packages/modules
- Use dependency injection to provide visitors to elements

## Summary

The Visitor pattern allows you to add new operations to existing object structures without modifying those structures. It separates algorithms from the objects they operate on, making it easier to add new operations and maintain related operations together. The pattern is particularly useful when you have a stable object structure but need to frequently add new operations on that structure.
