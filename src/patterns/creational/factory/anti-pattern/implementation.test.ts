import { createShape, Rectangle, Circle, Triangle, ShapeType } from './implementation';

describe('Factory Anti-Pattern Tests', () => {
    test('should create rectangle with correct dimensions', () => {
        const shape = createShape(ShapeType.RECTANGLE, 5, 10);
        expect(shape).toBeInstanceOf(Rectangle);
        expect(shape.getArea()).toBe(50);
        expect(shape.toString()).toBe('Rectangle with width: 5, height: 10');
    });

    test('should create circle with correct radius', () => {
        const shape = createShape(ShapeType.CIRCLE, 5);
        expect(shape).toBeInstanceOf(Circle);
        expect(shape.getArea()).toBeCloseTo(78.54, 1);
        expect(shape.toString()).toBe('Circle with radius: 5');
    });

    test('should create triangle with correct dimensions', () => {
        const shape = createShape(ShapeType.TRIANGLE, 6, 8);
        expect(shape).toBeInstanceOf(Triangle);
        expect(shape.getArea()).toBe(24);
        expect(shape.toString()).toBe('Triangle with base: 6, height: 8');
    });

    test('should throw error for unknown shape type', () => {
        // @ts-expect-error - Testing with invalid shape type
        expect(() => createShape('hexagon', 5)).toThrow();
    });

    test('should throw error for insufficient parameters', () => {
        expect(() => createShape(ShapeType.RECTANGLE, 5)).toThrow();
    });

    // Demonstrating the problem: Need to modify factory function when adding new shapes
    test('demonstrates extensibility problem - need to modify factory function', () => {
        // If we want to add a new shape type, we have to modify the createShape function
        // This violates the open-closed principle
        const types = Object.values(ShapeType);
        expect(types.length).toBe(3); // Currently only supports 3 shapes

        // To add a 'square' shape, we'd need to modify the createShape function
        // @ts-expect-error - Testing with invalid shape type
        expect(() => createShape('square', 5)).toThrow();
    });
});
