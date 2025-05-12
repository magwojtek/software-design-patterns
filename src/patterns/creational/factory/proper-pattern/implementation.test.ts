import {
    Shape,
    Rectangle,
    Circle,
    Triangle,
    ShapeFactoryProducer,
    ShapeFactory,
    ShapeType,
} from './implementation';

// Extension test: Create a new shape without modifying existing code
class Square implements Shape {
    private side: number;

    constructor(side: number) {
        this.side = side;
    }

    getArea(): number {
        return this.side * this.side;
    }

    toString(): string {
        return `Square with side: ${this.side}`;
    }
}

class SquareFactory implements ShapeFactory {
    createShape(side: number): Shape {
        return new Square(side);
    }
}

describe('Factory Proper Pattern Tests', () => {
    test('should create rectangle with correct dimensions', () => {
        const factory = ShapeFactoryProducer.getFactory(ShapeType.RECTANGLE);
        const shape = factory.createShape(5, 10);

        expect(shape).toBeInstanceOf(Rectangle);
        expect(shape.getArea()).toBe(50);
        expect(shape.toString()).toBe('Rectangle with width: 5, height: 10');
    });

    test('should create circle with correct radius', () => {
        const factory = ShapeFactoryProducer.getFactory(ShapeType.CIRCLE);
        const shape = factory.createShape(5);

        expect(shape).toBeInstanceOf(Circle);
        expect(shape.getArea()).toBeCloseTo(78.54, 1);
        expect(shape.toString()).toBe('Circle with radius: 5');
    });

    test('should create triangle with correct dimensions', () => {
        const factory = ShapeFactoryProducer.getFactory(ShapeType.TRIANGLE);
        const shape = factory.createShape(6, 8);

        expect(shape).toBeInstanceOf(Triangle);
        expect(shape.getArea()).toBe(24);
        expect(shape.toString()).toBe('Triangle with base: 6, height: 8');
    });

    test('should throw error for unknown shape type', () => {
        // @ts-expect-error - Testing with invalid shape type
        expect(() => ShapeFactoryProducer.getFactory('hexagon')).toThrow();
    });

    test('demonstrates extensibility without modifying existing code', () => {
        // We can add a new shape type without modifying existing factory implementations
        // This follows the open-closed principle

        // Extended shape types at runtime
        const square = new Square(5);
        expect(square.getArea()).toBe(25);
        expect(square.toString()).toBe('Square with side: 5');

        // We could even extend the factory producer in a subclass without modifying it
        // Define Square shape type for the extended factory
        enum ExtendedShapeType {
            SQUARE = 'square',
        }

        class ExtendedShapeFactoryProducer extends ShapeFactoryProducer {
            static getFactory(shapeType: ShapeType | ExtendedShapeType): ShapeFactory {
                if (shapeType === ExtendedShapeType.SQUARE) {
                    return new SquareFactory();
                }
                // Fall back to parent implementation for known types
                return super.getFactory(shapeType as ShapeType);
            }
        }

        const squareFactory = ExtendedShapeFactoryProducer.getFactory(ExtendedShapeType.SQUARE);
        const squareShape = squareFactory.createShape(5);
        expect(squareShape.getArea()).toBe(25);
        expect(squareShape.toString()).toBe('Square with side: 5');
    });
});
