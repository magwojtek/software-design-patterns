/**
 * Factory Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Decouples client code from concrete product classes
 * 2. Easy to extend with new product types
 * 3. Better testability with interfaces
 * 4. Follows open/closed principle
 */

// Shape type enum to replace string literals
export enum ShapeType {
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
    TRIANGLE = 'triangle',
}

// Common interface for all shapes
export interface Shape {
    getArea(): number;
    toString(): string;
}

// Concrete shape implementations
export class Rectangle implements Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public getArea(): number {
        return this.width * this.height;
    }

    public toString(): string {
        return `Rectangle with width: ${this.width}, height: ${this.height}`;
    }
}

export class Circle implements Shape {
    private radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    public getArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    public toString(): string {
        return `Circle with radius: ${this.radius}`;
    }
}

export class Triangle implements Shape {
    private base: number;
    private height: number;

    constructor(base: number, height: number) {
        this.base = base;
        this.height = height;
    }

    public getArea(): number {
        return (this.base * this.height) / 2;
    }

    public toString(): string {
        return `Triangle with base: ${this.base}, height: ${this.height}`;
    }
}

// Factory interface
export interface ShapeFactory {
    createShape(...params: number[]): Shape;
}

// Concrete factories
export class RectangleFactory implements ShapeFactory {
    createShape(width: number, height: number): Shape {
        return new Rectangle(width, height);
    }
}

export class CircleFactory implements ShapeFactory {
    createShape(radius: number): Shape {
        return new Circle(radius);
    }
}

export class TriangleFactory implements ShapeFactory {
    createShape(base: number, height: number): Shape {
        return new Triangle(base, height);
    }
}

// Abstract factory that returns the right concrete factory
export class ShapeFactoryProducer {
    static getFactory(shapeType: ShapeType): ShapeFactory {
        switch (shapeType) {
            case ShapeType.RECTANGLE:
                return new RectangleFactory();
            case ShapeType.CIRCLE:
                return new CircleFactory();
            case ShapeType.TRIANGLE:
                return new TriangleFactory();
            default:
                throw new Error(`No factory found for shape type: ${shapeType}`);
        }
    }
}
