import {
    Renderer,
    CanvasRenderer,
    SVGRenderer,
    WebGLRenderer,
    ThreeDPrinterRenderer,
    Circle,
    Rectangle,
    Triangle,
    Square,
    DrawingManager,
} from './implementation';

describe('Bridge Pattern - Proper Implementation', () => {
    describe('Renderers', () => {
        let canvasRenderer: Renderer;
        let svgRenderer: Renderer;
        let webglRenderer: Renderer;
        let threeDPrinterRenderer: Renderer;

        beforeEach(() => {
            canvasRenderer = new CanvasRenderer();
            svgRenderer = new SVGRenderer();
            webglRenderer = new WebGLRenderer();
            threeDPrinterRenderer = new ThreeDPrinterRenderer();
        });

        it('should have implementations for all required rendering methods', () => {
            // All renderers should implement the same interface
            const rendererMethods = ['renderCircle', 'renderRectangle', 'renderTriangle'];

            [canvasRenderer, svgRenderer, webglRenderer, threeDPrinterRenderer].forEach(
                (renderer) => {
                    rendererMethods.forEach((method) => {
                        expect(typeof renderer[method as keyof Renderer]).toBe('function');
                    });
                },
            );
        });
    });

    describe('Shapes', () => {
        let canvasRenderer: Renderer;
        let svgRenderer: Renderer;

        beforeEach(() => {
            canvasRenderer = new CanvasRenderer();
            svgRenderer = new SVGRenderer();
        });

        it('should initialize Circle with a renderer', () => {
            const circle = new Circle(10, 10, 5, canvasRenderer);
            expect(circle).toBeDefined();
        });

        it('should initialize Rectangle with a renderer', () => {
            const rectangle = new Rectangle(10, 10, 20, 30, canvasRenderer);
            expect(rectangle).toBeDefined();
        });

        it('should initialize Triangle with a renderer', () => {
            const triangle = new Triangle(0, 0, 10, 10, 20, 0, canvasRenderer);
            expect(triangle).toBeDefined();
        });

        it('should initialize Square with a renderer', () => {
            const square = new Square(10, 10, 20, canvasRenderer);
            expect(square).toBeDefined();
        });

        it('should allow changing the renderer at runtime', () => {
            const circle = new Circle(10, 10, 5, canvasRenderer);

            // Initially using canvas renderer
            circle.draw();
            expect(canvasRenderer.getLastRenderedOperation()).toContain('Canvas: Drawing circle');
            expect(canvasRenderer.getLastRenderedOperation()).toContain('radius 5');

            // Switch to SVG renderer
            circle.setRenderer(svgRenderer);
            circle.draw();
            expect(svgRenderer.getLastRenderedOperation()).toContain('SVG: Drawing circle');
            expect(svgRenderer.getLastRenderedOperation()).toContain('radius 5');
        });

        it('should calculate areas correctly', () => {
            const circle = new Circle(10, 10, 5, canvasRenderer);
            expect(circle.calculateArea()).toBeCloseTo(78.54, 2);

            const rectangle = new Rectangle(10, 10, 20, 30, canvasRenderer);
            expect(rectangle.calculateArea()).toBe(600);

            const triangle = new Triangle(0, 0, 0, 4, 3, 0, canvasRenderer);
            expect(triangle.calculateArea()).toBe(6);

            const square = new Square(10, 10, 20, canvasRenderer);
            expect(square.calculateArea()).toBe(400);
        });

        it('should allow shapes to move', () => {
            const circle = new Circle(10, 10, 5, canvasRenderer);
            circle.move(20, 20);

            // Verify the circle's position changed using the new coordinates
            circle.draw();
            expect(canvasRenderer.getLastRenderedOperation()).toContain(
                'Drawing circle at (20, 20)',
            );
        });
    });

    describe('DrawingManager', () => {
        let canvasRenderer: CanvasRenderer;
        let svgRenderer: SVGRenderer;
        let manager: DrawingManager;
        let circle: Circle;
        let rectangle: Rectangle;

        beforeEach(() => {
            canvasRenderer = new CanvasRenderer();
            svgRenderer = new SVGRenderer();
            manager = new DrawingManager();
            circle = new Circle(10, 10, 5, canvasRenderer);
            rectangle = new Rectangle(20, 20, 30, 40, canvasRenderer);
        });

        it('should add shapes to the drawing manager', () => {
            manager.addShape(circle);
            manager.addShape(rectangle);

            // We'll use spies to verify the shapes are drawn
            const circleSpy = jest.spyOn(circle, 'draw');
            const rectangleSpy = jest.spyOn(rectangle, 'draw');

            manager.drawAll();

            expect(circleSpy).toHaveBeenCalled();
            expect(rectangleSpy).toHaveBeenCalled();
        });

        it('should change renderer for all shapes at once', () => {
            manager.addShape(circle);
            manager.addShape(rectangle);

            // Switch all renderers to SVG
            manager.useRenderer(svgRenderer);

            // Draw all shapes
            manager.drawAll();

            // Verify that SVG renderer was used
            expect(svgRenderer.getLastRenderedOperation()).toContain('SVG: Drawing');
        });
    });

    describe('Adding new renderers or shapes', () => {
        it('should support adding a new renderer (3D Printer) without changing shape classes', () => {
            const threeDPrinterRenderer = new ThreeDPrinterRenderer();
            const circle = new Circle(10, 10, 5, threeDPrinterRenderer);

            circle.draw();

            expect(threeDPrinterRenderer.getLastRenderedOperation()).toContain(
                '3D Printer: Creating circle',
            );
            expect(threeDPrinterRenderer.getLastRenderedOperation()).toContain('radius 5');
        });

        it('should support adding a new shape (Square) without changing renderer classes', () => {
            const canvasRenderer = new CanvasRenderer();
            const square = new Square(10, 10, 20, canvasRenderer);

            square.draw();

            expect(canvasRenderer.getLastRenderedOperation()).toContain(
                'Canvas: Drawing rectangle at (10, 10)',
            );
            expect(canvasRenderer.getLastRenderedOperation()).toContain('width 20 and height 20');
        });
    });
});
