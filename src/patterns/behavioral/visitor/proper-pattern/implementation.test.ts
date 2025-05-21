import {
    Shape,
    Circle,
    Rectangle,
    Triangle,
    AreaCalculator,
    DrawingVisitor,
    JsonExportVisitor,
    PerimeterCalculator,
    ShapeProcessor,
    ShapeVisitor,
} from './implementation';

describe('Visitor Proper Pattern Tests', () => {
    let circle: Circle;
    let rectangle: Rectangle;
    let triangle: Triangle;

    beforeEach(() => {
        circle = new Circle(5, 10, 15);
        rectangle = new Rectangle(4, 5, 10, 15);
        triangle = new Triangle(3, 4, 5, 10, 15);
    });

    test('AreaCalculator calculates areas correctly', () => {
        const areaCalculator = new AreaCalculator();

        expect(circle.accept(areaCalculator)).toBeCloseTo(Math.PI * 25);
        expect(rectangle.accept(areaCalculator)).toBe(20);
        expect(triangle.accept(areaCalculator)).toBe(6);
    });

    test('DrawingVisitor generates correct drawing instructions', () => {
        const drawingVisitor = new DrawingVisitor();

        expect(circle.accept(drawingVisitor)).toBe('Drawing Circle at (10, 15) with radius 5');
        expect(rectangle.accept(drawingVisitor)).toBe(
            'Drawing Rectangle at (10, 15) with width 4 and height 5',
        );
        expect(triangle.accept(drawingVisitor)).toBe(
            'Drawing Triangle at (10, 15) with sides 3, 4, 5',
        );
    });

    test('JsonExportVisitor exports shapes to JSON correctly', () => {
        const jsonExportVisitor = new JsonExportVisitor();

        const circleJson = JSON.parse(circle.accept(jsonExportVisitor));
        expect(circleJson).toEqual({
            type: 'circle',
            radius: 5,
            position: { x: 10, y: 15 },
        });

        const rectangleJson = JSON.parse(rectangle.accept(jsonExportVisitor));
        expect(rectangleJson).toEqual({
            type: 'rectangle',
            width: 4,
            height: 5,
            position: { x: 10, y: 15 },
        });

        const triangleJson = JSON.parse(triangle.accept(jsonExportVisitor));
        expect(triangleJson).toEqual({
            type: 'triangle',
            sides: { a: 3, b: 4, c: 5 },
            position: { x: 10, y: 15 },
        });
    });

    test('PerimeterCalculator calculates perimeters correctly', () => {
        const perimeterCalculator = new PerimeterCalculator();

        expect(circle.accept(perimeterCalculator)).toBeCloseTo(2 * Math.PI * 5);
        expect(rectangle.accept(perimeterCalculator)).toBe(2 * (4 + 5));
        expect(triangle.accept(perimeterCalculator)).toBe(3 + 4 + 5);
    });

    test('ShapeProcessor processes all shapes with all visitors', () => {
        const shapes: Shape[] = [circle, rectangle, triangle];
        const processor = new ShapeProcessor();
        processor.processShapes(shapes);

        // Verify results were collected correctly
        expect(processor.results.areas.length).toBe(3);
        expect(processor.results.drawings.length).toBe(3);
        expect(processor.results.jsonExports.length).toBe(3);
        expect(processor.results.perimeters.length).toBe(3);

        // Verify specific values
        expect(processor.results.areas[0]).toBeCloseTo(Math.PI * 25); // Circle area
        expect(processor.results.areas[1]).toBe(20); // Rectangle area
        expect(processor.results.areas[2]).toBe(6); // Triangle area

        expect(processor.results.drawings[0]).toContain('Drawing Circle');
        expect(processor.results.drawings[1]).toContain('Drawing Rectangle');
        expect(processor.results.drawings[2]).toContain('Drawing Triangle');

        expect(processor.results.perimeters[0]).toBeCloseTo(2 * Math.PI * 5); // Circle perimeter
        expect(processor.results.perimeters[1]).toBe(2 * (4 + 5)); // Rectangle perimeter
        expect(processor.results.perimeters[2]).toBe(3 + 4 + 5); // Triangle perimeter
    });

    test('demonstrates adding a new visitor without modifying shape classes', () => {
        // Create a new visitor for scaling shapes
        class ScalingVisitor implements ShapeVisitor {
            constructor(private scaleFactor: number) {}

            visitCircle(circle: Circle): Circle {
                return new Circle(
                    circle.getRadius() * this.scaleFactor,
                    circle.getX(),
                    circle.getY(),
                );
            }

            visitRectangle(rectangle: Rectangle): Rectangle {
                return new Rectangle(
                    rectangle.getWidth() * this.scaleFactor,
                    rectangle.getHeight() * this.scaleFactor,
                    rectangle.getX(),
                    rectangle.getY(),
                );
            }

            visitTriangle(triangle: Triangle): Triangle {
                return new Triangle(
                    triangle.getA() * this.scaleFactor,
                    triangle.getB() * this.scaleFactor,
                    triangle.getC() * this.scaleFactor,
                    triangle.getX(),
                    triangle.getY(),
                );
            }
        }

        // Use the new visitor
        const scalingVisitor = new ScalingVisitor(2);
        const scaledCircle = circle.accept(scalingVisitor);
        const scaledRectangle = rectangle.accept(scalingVisitor);
        const scaledTriangle = triangle.accept(scalingVisitor);

        // Verify the scaling worked correctly
        expect(scaledCircle.getRadius()).toBe(10);
        expect(scaledRectangle.getWidth()).toBe(8);
        expect(scaledRectangle.getHeight()).toBe(10);
        expect(scaledTriangle.getA()).toBe(6);
        expect(scaledTriangle.getB()).toBe(8);
        expect(scaledTriangle.getC()).toBe(10);
    });

    test('demonstrates benefits of the visitor pattern', () => {
        // Benefit 1: Adding new operations without modifying shape classes
        class DescriptionVisitor implements ShapeVisitor {
            visitCircle(circle: Circle): string {
                return `A circle with radius ${circle.getRadius()} at position (${circle.getX()}, ${circle.getY()})`;
            }

            visitRectangle(rectangle: Rectangle): string {
                return `A rectangle with width ${rectangle.getWidth()} and height ${rectangle.getHeight()} at position (${rectangle.getX()}, ${rectangle.getY()})`;
            }

            visitTriangle(triangle: Triangle): string {
                return `A triangle with sides ${triangle.getA()}, ${triangle.getB()}, ${triangle.getC()} at position (${triangle.getX()}, ${triangle.getY()})`;
            }
        }

        const descriptionVisitor = new DescriptionVisitor();
        expect(circle.accept(descriptionVisitor)).toContain('A circle with radius 5');
        expect(rectangle.accept(descriptionVisitor)).toContain(
            'A rectangle with width 4 and height 5',
        );
        expect(triangle.accept(descriptionVisitor)).toContain('A triangle with sides 3, 4, 5');

        // Benefit 2: Related operations are grouped together in visitor classes
        // All area calculations are in AreaCalculator, all drawing operations in DrawingVisitor, etc.

        // Benefit 3: Shapes only need to implement the accept method
        // No need to modify shape classes when adding new operations

        // Benefit 4: Follows the Open/Closed Principle
        // Existing classes are open for extension but closed for modification

        // Benefit 5: Separates algorithms from the objects they operate on
        // Shape classes focus on data, visitor classes focus on operations
    });
});
