import { Circle, Rectangle, Triangle, ShapeProcessor } from './implementation';

describe('Visitor Anti-Pattern Tests', () => {
    test('Circle calculates area correctly', () => {
        const circle = new Circle(5, 0, 0);
        expect(circle.calculateArea()).toBeCloseTo(Math.PI * 25);
    });

    test('Rectangle calculates area correctly', () => {
        const rectangle = new Rectangle(4, 5, 0, 0);
        expect(rectangle.calculateArea()).toBe(20);
    });

    test('Triangle calculates area correctly', () => {
        const triangle = new Triangle(3, 4, 5, 0, 0);
        expect(triangle.calculateArea()).toBe(6);
    });

    test('Circle draws correctly', () => {
        const circle = new Circle(5, 10, 15);
        expect(circle.draw()).toBe('Drawing Circle at (10, 15) with radius 5');
    });

    test('Rectangle draws correctly', () => {
        const rectangle = new Rectangle(4, 5, 10, 15);
        expect(rectangle.draw()).toBe('Drawing Rectangle at (10, 15) with width 4 and height 5');
    });

    test('Triangle draws correctly', () => {
        const triangle = new Triangle(3, 4, 5, 10, 15);
        expect(triangle.draw()).toBe('Drawing Triangle at (10, 15) with sides 3, 4, 5');
    });

    test('Circle exports to JSON correctly', () => {
        const circle = new Circle(5, 10, 15);
        const json = JSON.parse(circle.exportToJson());
        expect(json).toEqual({
            type: 'circle',
            radius: 5,
            position: { x: 10, y: 15 },
        });
    });

    test('Rectangle exports to JSON correctly', () => {
        const rectangle = new Rectangle(4, 5, 10, 15);
        const json = JSON.parse(rectangle.exportToJson());
        expect(json).toEqual({
            type: 'rectangle',
            width: 4,
            height: 5,
            position: { x: 10, y: 15 },
        });
    });

    test('Triangle exports to JSON correctly', () => {
        const triangle = new Triangle(3, 4, 5, 10, 15);
        const json = JSON.parse(triangle.exportToJson());
        expect(json).toEqual({
            type: 'triangle',
            sides: { a: 3, b: 4, c: 5 },
            position: { x: 10, y: 15 },
        });
    });

    test('ShapeProcessor processes all shapes correctly', () => {
        const shapes = [
            new Circle(5, 0, 0),
            new Rectangle(4, 5, 10, 10),
            new Triangle(3, 4, 5, 20, 20),
        ];

        const processor = new ShapeProcessor();
        processor.processShapes(shapes);

        // Verify results were collected correctly
        expect(processor.results.areas.length).toBe(3);
        expect(processor.results.drawings.length).toBe(3);
        expect(processor.results.jsonExports.length).toBe(3);

        // Verify specific values
        expect(processor.results.areas[0]).toBeCloseTo(Math.PI * 25); // Circle area
        expect(processor.results.areas[1]).toBe(20); // Rectangle area
        expect(processor.results.areas[2]).toBe(6); // Triangle area

        expect(processor.results.drawings[0]).toContain('Drawing Circle');
        expect(processor.results.drawings[1]).toContain('Drawing Rectangle');
        expect(processor.results.drawings[2]).toContain('Drawing Triangle');
    });

    test('demonstrates problems with anti-pattern implementation', () => {
        // Problem 1: Adding new operations requires modifying all shape classes
        // For example, if we want to add a "calculatePerimeter" operation:

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ExtendedCircle extends Circle {
            // We need to add this method to Circle
            public calculatePerimeter(): number {
                // Access to radius is problematic - might need to add a getter or make it protected
                return 2 * Math.PI * 5; // Hardcoded radius for demonstration
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ExtendedRectangle extends Rectangle {
            // We need to add this method to Rectangle
            public calculatePerimeter(): number {
                // Access to width and height is problematic
                return 2 * (4 + 5); // Hardcoded width and height for demonstration
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ExtendedTriangle extends Triangle {
            // We need to add this method to Triangle
            public calculatePerimeter(): number {
                // Access to sides is problematic
                return 3 + 4 + 5; // Hardcoded sides for demonstration
            }
        }

        // Problem 2: Operations are scattered across different classes
        // Each shape has its own implementation of the same operations

        // Problem 3: Related operations are not grouped together
        // All operations related to shapes are spread across different classes

        // Problem 4: Hard to add new operations without modifying existing code
        // We had to extend each class to add a new operation

        // Problem 5: Violates the Open/Closed Principle
        // Existing classes need to be modified to add new operations
    });
});
