import { logger } from '~/utils/logger';

/**
 * Visitor Proper Implementation
 *
 * Benefits of this implementation:
 * 1. New operations can be added without modifying the shape classes
 * 2. Related operations are grouped together in visitor classes
 * 3. Shapes only need to implement the accept method
 * 4. Follows the Open/Closed Principle
 * 5. Separates algorithms from the objects they operate on
 */

// Visitor interface
export interface ShapeVisitor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitCircle(circle: Circle): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitRectangle(rectangle: Rectangle): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visitTriangle(triangle: Triangle): any;
}

// Shape interface with accept method
export interface Shape {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accept(visitor: ShapeVisitor): any;
}

// Concrete shape classes
export class Circle implements Shape {
    constructor(
        private radius: number,
        private x: number,
        private y: number,
    ) {}

    public getRadius(): number {
        return this.radius;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    // The accept method allows visitors to access the shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public accept(visitor: ShapeVisitor): any {
        return visitor.visitCircle(this);
    }
}

export class Rectangle implements Shape {
    constructor(
        private width: number,
        private height: number,
        private x: number,
        private y: number,
    ) {}

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    // The accept method allows visitors to access the shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public accept(visitor: ShapeVisitor): any {
        return visitor.visitRectangle(this);
    }
}

export class Triangle implements Shape {
    constructor(
        private a: number,
        private b: number,
        private c: number,
        private x: number,
        private y: number,
    ) {}

    public getA(): number {
        return this.a;
    }

    public getB(): number {
        return this.b;
    }

    public getC(): number {
        return this.c;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    // The accept method allows visitors to access the shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public accept(visitor: ShapeVisitor): any {
        return visitor.visitTriangle(this);
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
        const a = triangle.getA();
        const b = triangle.getB();
        const c = triangle.getC();
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
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
        return `Drawing Triangle at (${triangle.getX()}, ${triangle.getY()}) with sides ${triangle.getA()}, ${triangle.getB()}, ${triangle.getC()}`;
    }
}

export class JsonExportVisitor implements ShapeVisitor {
    public visitCircle(circle: Circle): string {
        return JSON.stringify({
            type: 'circle',
            radius: circle.getRadius(),
            position: { x: circle.getX(), y: circle.getY() },
        });
    }

    public visitRectangle(rectangle: Rectangle): string {
        return JSON.stringify({
            type: 'rectangle',
            width: rectangle.getWidth(),
            height: rectangle.getHeight(),
            position: { x: rectangle.getX(), y: rectangle.getY() },
        });
    }

    public visitTriangle(triangle: Triangle): string {
        return JSON.stringify({
            type: 'triangle',
            sides: { a: triangle.getA(), b: triangle.getB(), c: triangle.getC() },
            position: { x: triangle.getX(), y: triangle.getY() },
        });
    }
}

// New operation added without modifying shape classes
export class PerimeterCalculator implements ShapeVisitor {
    public visitCircle(circle: Circle): number {
        return 2 * Math.PI * circle.getRadius();
    }

    public visitRectangle(rectangle: Rectangle): number {
        return 2 * (rectangle.getWidth() + rectangle.getHeight());
    }

    public visitTriangle(triangle: Triangle): number {
        return triangle.getA() + triangle.getB() + triangle.getC();
    }
}

// Client code that uses the shapes and visitors
export class ShapeProcessor {
    public results: {
        areas: number[];
        drawings: string[];
        jsonExports: string[];
        perimeters: number[];
    } = {
        areas: [],
        drawings: [],
        jsonExports: [],
        perimeters: [],
    };

    public processShapes(shapes: Shape[]): void {
        const areaCalculator = new AreaCalculator();
        const drawingVisitor = new DrawingVisitor();
        const jsonExportVisitor = new JsonExportVisitor();
        const perimeterCalculator = new PerimeterCalculator();

        this.results = {
            areas: [],
            drawings: [],
            jsonExports: [],
            perimeters: [],
        };

        for (const shape of shapes) {
            this.results.areas.push(shape.accept(areaCalculator));
            this.results.drawings.push(shape.accept(drawingVisitor));
            this.results.jsonExports.push(shape.accept(jsonExportVisitor));
            this.results.perimeters.push(shape.accept(perimeterCalculator));
        }

        // Log results using the injected logger
        logger.info('Areas: ' + JSON.stringify(this.results.areas));
        logger.info('Drawings: ' + JSON.stringify(this.results.drawings));
        logger.info('JSON Exports: ' + JSON.stringify(this.results.jsonExports));
        logger.info('Perimeters: ' + JSON.stringify(this.results.perimeters));
    }
}
