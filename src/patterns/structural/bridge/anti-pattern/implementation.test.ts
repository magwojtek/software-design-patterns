import { Circle, Rectangle, Triangle, DrawingUtility, Square } from './implementation';

describe('Bridge Pattern - Anti-Pattern', () => {
    describe('Shape rendering methods', () => {
        it('should render Circle on different platforms', () => {
            const circle = new Circle(5);

            // Test that Circle has methods for each rendering platform
            expect(typeof circle.drawOnCanvas).toBe('function');
            expect(typeof circle.drawOnSVG).toBe('function');
            expect(typeof circle.drawOnWebGL).toBe('function');

            // These calls should execute without error
            circle.drawOnCanvas();
            circle.drawOnSVG();
            circle.drawOnWebGL();
        });

        it('should render Rectangle on different platforms', () => {
            const rectangle = new Rectangle(10, 20);

            // Test that Rectangle has methods for each rendering platform
            expect(typeof rectangle.drawOnCanvas).toBe('function');
            expect(typeof rectangle.drawOnSVG).toBe('function');
            expect(typeof rectangle.drawOnWebGL).toBe('function');

            // These calls should execute without error
            rectangle.drawOnCanvas();
            rectangle.drawOnSVG();
            rectangle.drawOnWebGL();
        });

        it('should render Triangle on different platforms', () => {
            const triangle = new Triangle(3, 4, 5);

            // Test that Triangle has methods for each rendering platform
            expect(typeof triangle.drawOnCanvas).toBe('function');
            expect(typeof triangle.drawOnSVG).toBe('function');
            expect(typeof triangle.drawOnWebGL).toBe('function');

            // These calls should execute without error
            triangle.drawOnCanvas();
            triangle.drawOnSVG();
            triangle.drawOnWebGL();
        });

        it('should render Square on different platforms', () => {
            const square = new Square(10);

            // Test that Square has methods for each rendering platform
            expect(typeof square.drawOnCanvas).toBe('function');
            expect(typeof square.drawOnSVG).toBe('function');
            expect(typeof square.drawOnWebGL).toBe('function');

            // These calls should execute without error
            square.drawOnCanvas();
            square.drawOnSVG();
            square.drawOnWebGL();
        });
    });

    describe('DrawingUtility', () => {
        it('should draw all shapes on Canvas', () => {
            const circle = new Circle(5);
            const rectangle = new Rectangle(10, 20);
            const triangle = new Triangle(3, 4, 5);

            // We need to spy on each shape's drawOnCanvas method
            const circleSpy = jest.spyOn(circle, 'drawOnCanvas');
            const rectangleSpy = jest.spyOn(rectangle, 'drawOnCanvas');
            const triangleSpy = jest.spyOn(triangle, 'drawOnCanvas');

            // Draw all shapes
            DrawingUtility.drawAllShapesOnCanvas([circle, rectangle, triangle]);

            // Verify each shape's method was called
            expect(circleSpy).toHaveBeenCalled();
            expect(rectangleSpy).toHaveBeenCalled();
            expect(triangleSpy).toHaveBeenCalled();
        });

        it('should draw all shapes on SVG', () => {
            const circle = new Circle(5);
            const rectangle = new Rectangle(10, 20);
            const triangle = new Triangle(3, 4, 5);

            // We need to spy on each shape's drawOnSVG method
            const circleSpy = jest.spyOn(circle, 'drawOnSVG');
            const rectangleSpy = jest.spyOn(rectangle, 'drawOnSVG');
            const triangleSpy = jest.spyOn(triangle, 'drawOnSVG');

            // Draw all shapes
            DrawingUtility.drawAllShapesOnSVG([circle, rectangle, triangle]);

            // Verify each shape's method was called
            expect(circleSpy).toHaveBeenCalled();
            expect(rectangleSpy).toHaveBeenCalled();
            expect(triangleSpy).toHaveBeenCalled();
        });

        it('should draw all shapes on WebGL', () => {
            const circle = new Circle(5);
            const rectangle = new Rectangle(10, 20);
            const triangle = new Triangle(3, 4, 5);

            // We need to spy on each shape's drawOnWebGL method
            const circleSpy = jest.spyOn(circle, 'drawOnWebGL');
            const rectangleSpy = jest.spyOn(rectangle, 'drawOnWebGL');
            const triangleSpy = jest.spyOn(triangle, 'drawOnWebGL');

            // Draw all shapes
            DrawingUtility.drawAllShapesOnWebGL([circle, rectangle, triangle]);

            // Verify each shape's method was called
            expect(circleSpy).toHaveBeenCalled();
            expect(rectangleSpy).toHaveBeenCalled();
            expect(triangleSpy).toHaveBeenCalled();
        });

        // This test demonstrates the limitation of the anti-pattern approach
        it('cannot draw shapes on 3D printer without modifying all shape classes', () => {
            const circle = new Circle(5);
            const rectangle = new Rectangle(10, 20);

            // This method logs an error because the functionality is not implemented
            jest.spyOn(console, 'error').mockImplementation();
            DrawingUtility.drawAllShapesOn3DPrinter([circle, rectangle]);

            // We would need to add a new method to all shape classes to support this
            expect(circle).not.toHaveProperty('drawOn3DPrinter');
            expect(rectangle).not.toHaveProperty('drawOn3DPrinter');
        });
    });

    describe('Shape-specific functionality', () => {
        it('should calculate Circle area correctly', () => {
            const circle = new Circle(5);
            expect(circle.calculateArea()).toBeCloseTo(78.54, 2);
        });

        it('should calculate Rectangle area correctly', () => {
            const rectangle = new Rectangle(10, 20);
            expect(rectangle.calculateArea()).toBe(200);
        });

        it('should calculate Triangle area correctly', () => {
            const triangle = new Triangle(3, 4, 5);
            expect(triangle.calculateArea()).toBe(6);
        });

        it('should calculate Square area correctly', () => {
            const square = new Square(10);
            expect(square.calculateArea()).toBe(100);
        });
    });
});
