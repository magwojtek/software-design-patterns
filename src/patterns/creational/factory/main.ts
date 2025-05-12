/**
 * Factory Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Factory pattern.
 */
import { createShape, ShapeType as AntiPatternShapeType } from './anti-pattern/implementation';
import { ShapeFactoryProducer, ShapeType } from './proper-pattern/implementation';
import * as colors from '~/utils/colors';
import { logger } from '~/utils/logger';

/**
 * Demonstrates the anti-pattern approach to creating objects
 * using a function with conditional logic
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating shapes using conditional function:');
    const rectangle = createShape(AntiPatternShapeType.RECTANGLE, 5, 10);
    logger.info(
        `Created: ${colors.shapeRectangle(rectangle.toString())} - Area: ${colors.shapeValue(rectangle.getArea().toString())}`,
    );

    const circle = createShape(AntiPatternShapeType.CIRCLE, 7);
    logger.info(
        `Created: ${colors.shapeCircle(circle.toString())} - Area: ${colors.shapeValue(circle.getArea().toFixed(2))}`,
    );

    const triangle = createShape(AntiPatternShapeType.TRIANGLE, 8, 6);
    logger.info(
        `Created: ${colors.shapeTriangle(triangle.toString())} - Area: ${colors.shapeValue(triangle.getArea().toString())}`,
    );

    logger.warn('\nProblem: To add new shapes, we need to modify the createShape function itself');
    logger.warn('This violates the Open/Closed principle');

    try {
        // Attempt to create a shape that isn't supported to demonstrate the limitation
        // @ts-expect-error - Testing with invalid shape type
        createShape('pentagon', 5);
    } catch (error) {
        // Properly type check the error before accessing its properties
        if (error instanceof Error) {
            logger.error(`Error: ${error.message}`);
        } else {
            logger.error(`Error: ${String(error)}`);
        }
    }
}

/**
 * Demonstrates the proper implementation of the Factory pattern
 * showing its flexibility and advantages
 */
function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Creating shapes using factory pattern:');

    const rectangleFactory = ShapeFactoryProducer.getFactory(ShapeType.RECTANGLE);
    const properRectangle = rectangleFactory.createShape(5, 10);
    logger.info(
        `Created: ${colors.shapeRectangle(properRectangle.toString())} - Area: ${colors.shapeValue(properRectangle.getArea().toString())}`,
    );

    const circleFactory = ShapeFactoryProducer.getFactory(ShapeType.CIRCLE);
    const properCircle = circleFactory.createShape(7);
    logger.info(
        `Created: ${colors.shapeCircle(properCircle.toString())} - Area: ${colors.shapeValue(properCircle.getArea().toFixed(2))}`,
    );

    const triangleFactory = ShapeFactoryProducer.getFactory(ShapeType.TRIANGLE);
    const properTriangle = triangleFactory.createShape(8, 6);
    logger.info(
        `Created: ${colors.shapeTriangle(properTriangle.toString())} - Area: ${colors.shapeValue(properTriangle.getArea().toString())}`,
    );

    logger.success('\nBenefit: To add new shapes, we just create a new factory and shape class');
    logger.success('without modifying existing code (follows the Open/Closed principle)');

    // Extension example (assuming we added a Square factory later)
    logger.info('\nExtension example (code comments):');
    logger.info('// 1. Create a new shape class implementing the Shape interface');
    logger.info('class Square implements Shape { ... }');
    logger.info('// 2. Create a new factory implementing ShapeFactory');
    logger.info('class SquareFactory implements ShapeFactory { ... }');
    logger.info('// 3. Extend the ShapeType enum');
    logger.info('enum ExtendedShapeType { SQUARE = "square", ...ShapeType }');
    logger.info('// 4. Extend factory producer or inject the new factory');
    logger.info(
        'ExtendedShapeFactoryProducer.registerFactory(ExtendedShapeType.SQUARE, new SquareFactory());',
    );
    logger.info(
        'const square = ExtendedShapeFactoryProducer.getFactory(ExtendedShapeType.SQUARE).createShape(5);',
    );
}

logger.info('=== Factory Pattern Example ===\n');

// Run the anti-pattern demonstration
demonstrateAntiPattern();

// Run the proper pattern demonstration
demonstrateProperPattern();

logger.info('\n=== End of Factory Pattern Example ===');
