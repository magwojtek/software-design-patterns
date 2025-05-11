/**
 * Bridge Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Separation of concerns: Abstractions and implementations evolve independently
 * 2. Open/Closed Principle: Adding new shapes or renderers doesn't require modifying existing code
 * 3. Composition over inheritance: Uses object composition for more flexibility
 * 4. Runtime flexibility: Can change implementations at runtime
 * 5. Reduces class count: No need for a class for each combination of abstraction and implementation
 */
import { logger } from '~/utils/logger';

// The Implementation interface declares rendering operations for all supported platforms
export interface Renderer {
    renderCircle(x: number, y: number, radius: number): void;
    renderRectangle(x: number, y: number, width: number, height: number): void;
    renderTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    getLastRenderedOperation(): string | null;
}

// Concrete Implementations for specific platforms
export class CanvasRenderer implements Renderer {
    private lastOperation: string | null = null;

    renderCircle(x: number, y: number, radius: number): void {
        this.lastOperation = `Canvas: Drawing circle at (${x}, ${y}) with radius ${radius}`;
        logger.info(this.lastOperation);
        // Actual canvas drawing code would be here
    }

    renderRectangle(x: number, y: number, width: number, height: number): void {
        this.lastOperation = `Canvas: Drawing rectangle at (${x}, ${y}) with width ${width} and height ${height}`;
        logger.info(this.lastOperation);
        // Actual canvas drawing code would be here
    }

    renderTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.lastOperation = `Canvas: Drawing triangle with points (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})`;
        logger.info(this.lastOperation);
        // Actual canvas drawing code would be here
    }

    getLastRenderedOperation(): string | null {
        return this.lastOperation;
    }
}

export class SVGRenderer implements Renderer {
    private lastOperation: string | null = null;

    renderCircle(x: number, y: number, radius: number): void {
        this.lastOperation = `SVG: Drawing circle at (${x}, ${y}) with radius ${radius}`;
        logger.info(this.lastOperation);
        // Actual SVG drawing code would be here
    }

    renderRectangle(x: number, y: number, width: number, height: number): void {
        this.lastOperation = `SVG: Drawing rectangle at (${x}, ${y}) with width ${width} and height ${height}`;
        logger.info(this.lastOperation);
        // Actual SVG drawing code would be here
    }

    renderTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.lastOperation = `SVG: Drawing triangle with points (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})`;
        logger.info(this.lastOperation);
        // Actual SVG drawing code would be here
    }

    getLastRenderedOperation(): string | null {
        return this.lastOperation;
    }
}

export class WebGLRenderer implements Renderer {
    private lastOperation: string | null = null;

    renderCircle(x: number, y: number, radius: number): void {
        this.lastOperation = `WebGL: Drawing circle at (${x}, ${y}) with radius ${radius}`;
        logger.info(this.lastOperation);
        // Actual WebGL drawing code would be here
    }

    renderRectangle(x: number, y: number, width: number, height: number): void {
        this.lastOperation = `WebGL: Drawing rectangle at (${x}, ${y}) with width ${width} and height ${height}`;
        logger.info(this.lastOperation);
        // Actual WebGL drawing code would be here
    }

    renderTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.lastOperation = `WebGL: Drawing triangle with points (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})`;
        logger.info(this.lastOperation);
        // Actual WebGL drawing code would be here
    }

    getLastRenderedOperation(): string | null {
        return this.lastOperation;
    }
}

// We can easily add a new renderer without changing any shape code
export class ThreeDPrinterRenderer implements Renderer {
    private lastOperation: string | null = null;

    renderCircle(x: number, y: number, radius: number): void {
        this.lastOperation = `3D Printer: Creating circle at (${x}, ${y}) with radius ${radius}`;
        logger.info(this.lastOperation);
        // Actual 3D printer code would be here
    }

    renderRectangle(x: number, y: number, width: number, height: number): void {
        this.lastOperation = `3D Printer: Creating rectangle at (${x}, ${y}) with width ${width} and height ${height}`;
        logger.info(this.lastOperation);
        // Actual 3D printer code would be here
    }

    renderTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.lastOperation = `3D Printer: Creating triangle with points (${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})`;
        logger.info(this.lastOperation);
        // Actual 3D printer code would be here
    }

    getLastRenderedOperation(): string | null {
        return this.lastOperation;
    }
}

// Shape abstraction - base class for all shapes
export abstract class Shape {
    protected x: number;
    protected y: number;
    protected renderer: Renderer;
    protected lastOperation: string | null = null;

    constructor(x: number, y: number, renderer: Renderer) {
        this.x = x;
        this.y = y;
        this.renderer = renderer;
    }

    // Bridge method that delegates to the implementation
    abstract draw(): void;

    // Allow changing the renderer at runtime
    setRenderer(renderer: Renderer): void {
        this.lastOperation = `Changing renderer for ${this.constructor.name}`;
        logger.info(this.lastOperation);
        this.renderer = renderer;
    }

    // Common method for all shapes
    move(x: number, y: number): void {
        this.lastOperation = `Moving shape to (${x}, ${y})`;
        logger.info(this.lastOperation);
        this.x = x;
        this.y = y;
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }
}

// Refined abstractions - specific shapes
export class Circle extends Shape {
    private radius: number;

    constructor(x: number, y: number, radius: number, renderer: Renderer) {
        super(x, y, renderer);
        this.radius = radius;
    }

    draw(): void {
        this.renderer.renderCircle(this.x, this.y, this.radius);
    }

    // Methods specific to Circle
    calculateArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    setRadius(radius: number): void {
        this.radius = radius;
        logger.info(`Circle radius updated to ${radius}`);
    }
}

export class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number, renderer: Renderer) {
        super(x, y, renderer);
        this.width = width;
        this.height = height;
    }

    draw(): void {
        this.renderer.renderRectangle(this.x, this.y, this.width, this.height);
    }

    // Methods specific to Rectangle
    calculateArea(): number {
        return this.width * this.height;
    }

    setDimensions(width: number, height: number): void {
        this.width = width;
        this.height = height;
        logger.info(`Rectangle dimensions updated to width: ${width}, height: ${height}`);
    }
}

export class Triangle extends Shape {
    private x2: number;
    private y2: number;
    private x3: number;
    private y3: number;

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        renderer: Renderer,
    ) {
        super(x1, y1, renderer);
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    draw(): void {
        this.renderer.renderTriangle(this.x, this.y, this.x2, this.y2, this.x3, this.y3);
    }

    // Methods specific to Triangle
    calculateArea(): number {
        // Area of triangle using determinant
        return Math.abs(
            (this.x * (this.y2 - this.y3) +
                this.x2 * (this.y3 - this.y) +
                this.x3 * (this.y - this.y2)) /
                2,
        );
    }

    setPoints(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.x = x1;
        this.y = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        logger.info(`Triangle points updated`);
    }
}

// We can easily add a new shape without changing any renderer code
export class Square extends Shape {
    private size: number;

    constructor(x: number, y: number, size: number, renderer: Renderer) {
        super(x, y, renderer);
        this.size = size;
    }

    draw(): void {
        // Reuses the rectangle rendering but with equal width and height
        this.renderer.renderRectangle(this.x, this.y, this.size, this.size);
    }

    // Methods specific to Square
    calculateArea(): number {
        return this.size * this.size;
    }

    setSize(size: number): void {
        this.size = size;
        logger.info(`Square size updated to ${size}`);
    }
}

// Drawing manager - works with abstract shapes, not concerned with specific renderers
export class DrawingManager {
    private shapes: Shape[] = [];
    private lastOperation: string | null = null;

    addShape(shape: Shape): void {
        this.shapes.push(shape);
        this.lastOperation = `Added ${shape.constructor.name} to drawing manager`;
        logger.success(this.lastOperation);
    }

    drawAll(): void {
        this.lastOperation = 'Drawing all shapes';
        logger.success(this.lastOperation);
        this.shapes.forEach((shape, index) => {
            logger.info(`Drawing shape #${index + 1}`);
            shape.draw();
        });
    }

    // We can switch renderers for all shapes at once
    useRenderer(renderer: Renderer): void {
        this.lastOperation = 'Switching renderer for all shapes';
        logger.success(this.lastOperation);
        this.shapes.forEach((shape) => {
            shape.setRenderer(renderer);
        });
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }
}
