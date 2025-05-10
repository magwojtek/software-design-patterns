/**
 * Factory Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Tight coupling between client code and concrete classes
 * 2. Hard to extend with new product types
 * 3. Hard to test due to direct instantiation
 * 4. Violation of open/closed principle
 */

// Define shape types as an enum for type safety
export enum ShapeType {
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
    TRIANGLE = 'triangle',
}

// Product types
export class Rectangle {
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

export class Circle {
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

export class Triangle {
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

// Client code with conditional logic to create different shapes
// Updated to use enum instead of string literals
export function createShape(type: ShapeType, ...params: number[]): Rectangle | Circle | Triangle {
    if (type === ShapeType.RECTANGLE && params.length >= 2) {
        return new Rectangle(params[0], params[1]);
    } else if (type === ShapeType.CIRCLE && params.length >= 1) {
        return new Circle(params[0]);
    } else if (type === ShapeType.TRIANGLE && params.length >= 2) {
        return new Triangle(params[0], params[1]);
    } else {
        throw new Error(`Cannot create shape of type ${type} with provided parameters`);
    }
}
