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
    private lastOperation: string | null = null;

    createShape(width: number, height: number): Shape {
        this.lastOperation = `Created Rectangle with width: ${width}, height: ${height}`;
        return new Rectangle(width, height);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }
}

export class CircleFactory implements ShapeFactory {
    private lastOperation: string | null = null;

    createShape(radius: number): Shape {
        this.lastOperation = `Created Circle with radius: ${radius}`;
        return new Circle(radius);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }
}

export class TriangleFactory implements ShapeFactory {
    private lastOperation: string | null = null;

    createShape(base: number, height: number): Shape {
        this.lastOperation = `Created Triangle with base: ${base}, height: ${height}`;
        return new Triangle(base, height);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }
}

// Abstract factory that returns the right concrete factory
export class ShapeFactoryProducer {
    private static lastOperation: string | null = null;

    static getFactory(shapeType: ShapeType): ShapeFactory {
        let factory: ShapeFactory;
        switch (shapeType) {
            case ShapeType.RECTANGLE:
                factory = new RectangleFactory();
                this.lastOperation = `Created RectangleFactory`;
                break;
            case ShapeType.CIRCLE:
                factory = new CircleFactory();
                this.lastOperation = `Created CircleFactory`;
                break;
            case ShapeType.TRIANGLE:
                factory = new TriangleFactory();
                this.lastOperation = `Created TriangleFactory`;
                break;
            default:
                this.lastOperation = `No factory found for shape type: ${shapeType}`;
                throw new Error(this.lastOperation);
        }
        return factory;
    }

    static getLastOperation(): string | null {
        return this.lastOperation;
    }
}
