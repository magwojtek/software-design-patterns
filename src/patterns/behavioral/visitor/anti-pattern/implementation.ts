/**
 * Visitor Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Adding new operations requires modifying all shape classes
 * 2. Operations are scattered across different classes
 * 3. Related operations are not grouped together
 * 4. Hard to add new operations without modifying existing code
 * 5. Violates the Open/Closed Principle
 */

// Shape classes with operations directly embedded in them
export class Circle {
    private radius: number;
    private x: number;
    private y: number;

    constructor(radius: number, x: number, y: number) {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }

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
            position: { x: this.x, y: this.y },
        });
    }

    // If we want to add a new operation, we need to modify this class
    // For example: calculate perimeter, scale, rotate, etc.
}

export class Rectangle {
    private width: number;
    private height: number;
    private x: number;
    private y: number;

    constructor(width: number, height: number, x: number, y: number) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

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
            position: { x: this.x, y: this.y },
        });
    }

    // If we want to add a new operation, we need to modify this class
    // For example: calculate perimeter, scale, rotate, etc.
}

export class Triangle {
    private a: number;
    private b: number;
    private c: number;
    private x: number;
    private y: number;

    constructor(a: number, b: number, c: number, x: number, y: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.x = x;
        this.y = y;
    }

    // Operation 1: Calculate area (using Heron's formula)
    public calculateArea(): number {
        const s = (this.a + this.b + this.c) / 2;
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }

    // Operation 2: Draw the shape
    public draw(): string {
        return `Drawing Triangle at (${this.x}, ${this.y}) with sides ${this.a}, ${this.b}, ${this.c}`;
    }

    // Operation 3: Export to JSON
    public exportToJson(): string {
        return JSON.stringify({
            type: 'triangle',
            sides: { a: this.a, b: this.b, c: this.c },
            position: { x: this.x, y: this.y },
        });
    }

    // If we want to add a new operation, we need to modify this class
    // For example: calculate perimeter, scale, rotate, etc.
}

// Client code that uses the shapes
export class ShapeProcessor {
    public results: {
        areas: number[];
        drawings: string[];
        jsonExports: string[];
    } = {
        areas: [],
        drawings: [],
        jsonExports: [],
    };

    public processShapes(shapes: (Circle | Rectangle | Triangle)[]): void {
        this.results = {
            areas: [],
            drawings: [],
            jsonExports: [],
        };

        for (const shape of shapes) {
            this.results.areas.push(shape.calculateArea());
            this.results.drawings.push(shape.draw());
            this.results.jsonExports.push(shape.exportToJson());
        }

        // Log results to console (but test can access this.results directly)
        console.log('Areas:', this.results.areas);
        console.log('Drawings:', this.results.drawings);
        console.log('JSON Exports:', this.results.jsonExports);
    }
}
