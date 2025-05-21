/**
 * Visitor Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Visitor pattern.
 */
import {
    Circle as AntiPatternCircle,
    Rectangle as AntiPatternRectangle,
    Triangle as AntiPatternTriangle,
    ShapeProcessor as AntiPatternProcessor,
} from './anti-pattern/implementation';
import {
    Circle,
    Rectangle,
    Triangle,
    AreaCalculator,
    DrawingVisitor,
    JsonExportVisitor,
    PerimeterCalculator,
    ShapeProcessor,
    ShapeVisitor,
} from './proper-pattern/implementation';
import { logger } from '~/utils/logger';
import * as colors from '~/utils/colors';

// Define color functions for shapes and operations
const shapeCircle = colors.shapeCircle;
const shapeRectangle = colors.shapeRectangle;
const shapeTriangle = colors.shapeTriangle;
const shapeValue = colors.shapeValue;
const antiPattern = colors.antiPattern;
const properPattern = colors.properPattern;

logger.info('=== Visitor Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the Visitor pattern
 * with operations embedded in the shape classes.
 */
function demonstrateAntiPattern(): void {
    logger.info('--- Anti-pattern Example ---');
    logger.info(antiPattern('Creating different shapes:'));

    const circle = new AntiPatternCircle(5, 10, 15);
    const rectangle = new AntiPatternRectangle(4, 5, 10, 15);
    const triangle = new AntiPatternTriangle(3, 4, 5, 10, 15);

    logger.info('\nCalculating areas:');
    logger.info(`${shapeCircle('Circle')} area: ${shapeValue(circle.calculateArea().toString())}`);
    logger.info(
        `${shapeRectangle('Rectangle')} area: ${shapeValue(rectangle.calculateArea().toString())}`,
    );
    logger.info(
        `${shapeTriangle('Triangle')} area: ${shapeValue(triangle.calculateArea().toString())}`,
    );

    logger.info('\nDrawing shapes:');
    logger.info(shapeCircle(circle.draw()));
    logger.info(shapeRectangle(rectangle.draw()));
    logger.info(shapeTriangle(triangle.draw()));

    logger.info('\nExporting to JSON:');
    logger.info(shapeCircle(circle.exportToJson()));
    logger.info(shapeRectangle(rectangle.exportToJson()));
    logger.info(shapeTriangle(triangle.exportToJson()));

    logger.info('\nProcessing shapes with ShapeProcessor:');
    const processor = new AntiPatternProcessor();
    processor.processShapes([circle, rectangle, triangle]);

    // Results are now available in processor.results
    logger.info(
        `Results collected in processor.results: 
        ${shapeValue(processor.results.areas.length.toString())} areas, 
        ${shapeValue(processor.results.drawings.length.toString())} drawings, 
        ${shapeValue(processor.results.jsonExports.length.toString())} JSON exports`,
    );

    logger.warn('\nProblems:');
    logger.warn(antiPattern('1. Adding new operations requires modifying all shape classes'));
    logger.warn(antiPattern('2. Operations are scattered across different classes'));
    logger.warn(antiPattern('3. Related operations are not grouped together'));
    logger.warn(antiPattern('4. Hard to add new operations without modifying existing code'));
    logger.warn(antiPattern('5. Violates the Open/Closed Principle\n'));
}

/**
 * Demonstrates the proper implementation of the Visitor pattern
 * with operations separated into visitor classes.
 */
function demonstrateProperPattern(): void {
    logger.info('--- Proper Pattern Example ---');
    logger.info(properPattern('Creating different shapes:'));

    const circle = new Circle(5, 10, 15);
    const rectangle = new Rectangle(4, 5, 10, 15);
    const triangle = new Triangle(3, 4, 5, 10, 15);

    const areaCalculator = new AreaCalculator();
    const drawingVisitor = new DrawingVisitor();
    const jsonExportVisitor = new JsonExportVisitor();
    const perimeterCalculator = new PerimeterCalculator();

    logger.info('\nUsing AreaCalculator visitor:');
    logger.info(
        `${shapeCircle('Circle')} area: ${shapeValue(circle.accept(areaCalculator).toString())}`,
    );
    logger.info(
        `${shapeRectangle('Rectangle')} area: ${shapeValue(rectangle.accept(areaCalculator).toString())}`,
    );
    logger.info(
        `${shapeTriangle('Triangle')} area: ${shapeValue(triangle.accept(areaCalculator).toString())}`,
    );

    logger.info('\nUsing DrawingVisitor:');
    logger.info(shapeCircle(circle.accept(drawingVisitor)));
    logger.info(shapeRectangle(rectangle.accept(drawingVisitor)));
    logger.info(shapeTriangle(triangle.accept(drawingVisitor)));

    logger.info('\nUsing JsonExportVisitor:');
    logger.info(shapeCircle(circle.accept(jsonExportVisitor)));
    logger.info(shapeRectangle(rectangle.accept(jsonExportVisitor)));
    logger.info(shapeTriangle(triangle.accept(jsonExportVisitor)));

    logger.success('\nUsing PerimeterCalculator visitor (added without modifying shape classes):');
    logger.success(
        `${shapeCircle('Circle')} perimeter: ${shapeValue(circle.accept(perimeterCalculator).toString())}`,
    );
    logger.success(
        `${shapeRectangle('Rectangle')} perimeter: ${shapeValue(rectangle.accept(perimeterCalculator).toString())}`,
    );
    logger.success(
        `${shapeTriangle('Triangle')} perimeter: ${shapeValue(triangle.accept(perimeterCalculator).toString())}`,
    );

    logger.info('\nProcessing shapes with ShapeProcessor:');
    const processor = new ShapeProcessor();
    processor.processShapes([circle, rectangle, triangle]);

    // Results are now available in processor.results
    logger.info(
        `Results collected in processor.results: 
        ${shapeValue(processor.results.areas.length.toString())} areas, 
        ${shapeValue(processor.results.drawings.length.toString())} drawings, 
        ${shapeValue(processor.results.jsonExports.length.toString())} JSON exports, 
        ${shapeValue(processor.results.perimeters.length.toString())} perimeters`,
    );

    logger.info('\nCreating a new visitor at runtime:');
    // Define a new visitor for scaling shapes
    class ScalingVisitor implements ShapeVisitor {
        constructor(private scaleFactor: number) {}

        visitCircle(circle: Circle): Circle {
            return new Circle(circle.getRadius() * this.scaleFactor, circle.getX(), circle.getY());
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

    const scalingVisitor = new ScalingVisitor(2);
    const scaledCircle = circle.accept(scalingVisitor);
    const scaledRectangle = rectangle.accept(scalingVisitor);
    const scaledTriangle = triangle.accept(scalingVisitor);

    logger.success('\nScaled shapes (using new ScalingVisitor):');
    logger.success(
        `Original ${shapeCircle('circle')} radius: ${shapeValue(circle.getRadius().toString())}, Scaled circle radius: ${shapeValue(scaledCircle.getRadius().toString())}`,
    );
    logger.success(
        `Original ${shapeRectangle('rectangle')} dimensions: ${shapeValue(rectangle.getWidth().toString())}x${shapeValue(rectangle.getHeight().toString())}, Scaled: ${shapeValue(scaledRectangle.getWidth().toString())}x${shapeValue(scaledRectangle.getHeight().toString())}`,
    );
    logger.success(
        `Original ${shapeTriangle('triangle')} sides: ${shapeValue(triangle.getA().toString())}, ${shapeValue(triangle.getB().toString())}, ${shapeValue(triangle.getC().toString())}`,
    );
    logger.success(
        `Scaled triangle sides: ${shapeValue(scaledTriangle.getA().toString())}, ${shapeValue(scaledTriangle.getB().toString())}, ${shapeValue(scaledTriangle.getC().toString())}`,
    );

    logger.success('\nBenefits:');
    logger.success(
        properPattern('1. New operations can be added without modifying the shape classes'),
    );
    logger.success(properPattern('2. Related operations are grouped together in visitor classes'));
    logger.success(properPattern('3. Shapes only need to implement the accept method'));
    logger.success(properPattern('4. Follows the Open/Closed Principle'));
    logger.success(properPattern('5. Separates algorithms from the objects they operate on'));
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of Visitor Pattern Example ===');
