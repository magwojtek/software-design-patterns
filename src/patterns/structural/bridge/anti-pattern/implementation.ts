/**
 * Bridge Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Class explosion: Each new shape or rendering method requires multiple new classes/methods
 * 2. Code duplication: Similar rendering logic duplicated across different shape classes
 * 3. Poor extensibility: Adding a new shape or rendering method requires modifying multiple classes
 * 4. Tight coupling: Shapes are tightly coupled with rendering implementations
 * 5. Maintainability issues: Changes to rendering logic must be updated in multiple places
 */
import { logger } from '~/utils/logger';

export class Circle {
    private radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    getRenderInfo(): string {
        return `circle with radius ${this.radius}`;
    }

    drawOnCanvas(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on canvas`);
        // Canvas specific drawing code would be here
    }

    drawOnSVG(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on SVG`);
        // SVG specific drawing code would be here
    }

    drawOnWebGL(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on WebGL`);
        // WebGL specific drawing code would be here
    }

    // Methods specific to Circle
    calculateArea(): number {
        return Math.PI * this.radius * this.radius;
    }
}

export class Rectangle {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getRenderInfo(): string {
        return `rectangle with width ${this.width} and height ${this.height}`;
    }

    drawOnCanvas(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on canvas`);
        // Canvas specific drawing code would be here
    }

    drawOnSVG(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on SVG`);
        // SVG specific drawing code would be here
    }

    drawOnWebGL(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on WebGL`);
        // WebGL specific drawing code would be here
    }

    // Methods specific to Rectangle
    calculateArea(): number {
        return this.width * this.height;
    }
}

export class Triangle {
    private a: number;
    private b: number;
    private c: number;

    constructor(a: number, b: number, c: number) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    getRenderInfo(): string {
        return `triangle with sides ${this.a}, ${this.b}, and ${this.c}`;
    }

    drawOnCanvas(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on canvas`);
        // Canvas specific drawing code would be here
    }

    drawOnSVG(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on SVG`);
        // SVG specific drawing code would be here
    }

    drawOnWebGL(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on WebGL`);
        // WebGL specific drawing code would be here
    }

    // Methods specific to Triangle
    calculateArea(): number {
        // Heron's formula
        const s = (this.a + this.b + this.c) / 2;
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }
}

// Attempt to create a reusable drawing utility - but still problematic
export class DrawingUtility {
    static drawAllShapesOnCanvas(shapes: Array<Circle | Rectangle | Triangle>): void {
        logger.info('Drawing all shapes on Canvas...');
        shapes.forEach((shape) => {
            // Have to check the type and call the appropriate method
            shape.drawOnCanvas();
        });
    }

    static drawAllShapesOnSVG(shapes: Array<Circle | Rectangle | Triangle>): void {
        logger.info('Drawing all shapes on SVG...');
        shapes.forEach((shape) => {
            shape.drawOnSVG();
        });
    }

    static drawAllShapesOnWebGL(shapes: Array<Circle | Rectangle | Triangle>): void {
        logger.info('Drawing all shapes on WebGL...');
        shapes.forEach((shape) => {
            shape.drawOnWebGL();
        });
    }

    // Adding a new rendering method would require modifying all shapes
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static drawAllShapesOn3DPrinter(shapes: Array<Circle | Rectangle | Triangle>): void {
        logger.error(
            `Cannot draw number of shapes ${shapes.length} on 3D printer: method not implemented in shape classes`,
        );
        // We'd need to add draw3DPrinter method to all shape classes!
    }
}

// If we decide to add a new shape, we need to implement all rendering methods
export class Square {
    private side: number;

    constructor(side: number) {
        this.side = side;
    }

    getRenderInfo(): string {
        return `square with side ${this.side}`;
    }

    drawOnCanvas(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on canvas`);
        // Canvas specific drawing code would be here
    }

    drawOnSVG(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on SVG`);
        // SVG specific drawing code would be here
    }

    drawOnWebGL(): void {
        logger.info(`Drawing a ${this.getRenderInfo()} on WebGL`);
        // WebGL specific drawing code would be here
    }

    // Methods specific to Square
    calculateArea(): number {
        return this.side * this.side;
    }
}

// We cannot easily add new rendering methods without modifying all shape classes
