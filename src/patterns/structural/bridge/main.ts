/**
 * Bridge Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Bridge pattern.
 */
import {
    Circle as AntiPatternCircle,
    Rectangle as AntiPatternRectangle,
    Triangle as AntiPatternTriangle,
    DrawingUtility,
} from './anti-pattern/implementation';
import {
    CanvasRenderer,
    SVGRenderer,
    WebGLRenderer,
    ThreeDPrinterRenderer,
    Circle,
    Rectangle,
    Triangle,
    DrawingManager,
} from './proper-pattern/implementation';
import { logger, LogColor } from '~/utils/logger';

// Helper function for creating visual separators in the console
const separator = (title?: string) => {
    const line = '═'.repeat(80);
    if (title) {
        const paddedTitle = ` ${title} `;
        const startPos = Math.floor((line.length - paddedTitle.length) / 2);
        const paddedLine =
            line.substring(0, startPos) +
            paddedTitle +
            line.substring(startPos + paddedTitle.length);
        return paddedLine;
    }
    return line;
};

logger.success(separator('BRIDGE PATTERN EXAMPLE'));

// Anti-pattern demonstration
async function runAntiPatternExample() {
    logger.error(separator('ANTI-PATTERN EXAMPLE'));
    logger.info(
        'In the anti-pattern approach, each shape class has methods for all rendering platforms:',
    );

    // Create shapes
    logger.warn('\nCreating shapes with tight coupling to all rendering methods:');
    const circle = new AntiPatternCircle(5);
    const rectangle = new AntiPatternRectangle(10, 20);
    const triangle = new AntiPatternTriangle(3, 4, 5);

    // Draw shapes on different platforms (each shape knows how to draw itself on multiple platforms)
    logger.warn('\nDrawing circle on multiple platforms:');
    circle.drawOnCanvas();
    circle.drawOnSVG();
    circle.drawOnWebGL();

    logger.warn('\nDrawing rectangle on multiple platforms:');
    rectangle.drawOnCanvas();
    rectangle.drawOnSVG();
    rectangle.drawOnWebGL();

    logger.warn('\nDrawing triangle on multiple platforms:');
    triangle.drawOnCanvas();
    triangle.drawOnSVG();
    triangle.drawOnWebGL();

    // Using utility to draw shapes
    logger.warn('\nDrawing all shapes with utility class:');
    DrawingUtility.drawAllShapesOnCanvas([circle, rectangle, triangle]);

    // Trying to add a new rendering platform
    logger.warn('\nAttempting to draw on 3D printer (new platform):');
    DrawingUtility.drawAllShapesOn3DPrinter([circle, rectangle, triangle]);

    // Highlighting the limitations
    logger.error('\nProblems with Anti-Pattern:');
    logger.error('1. Each shape contains code for all rendering platforms');
    logger.error('2. Adding a new shape requires implementing all rendering methods');
    logger.error('3. Adding a new rendering platform requires modifying all shape classes');
    logger.error('4. Code duplication across different shape classes');
    logger.error('5. Cannot change rendering platform at runtime easily');
}

// Proper pattern demonstration
async function runProperPatternExample() {
    logger.success('\n' + separator('PROPER PATTERN EXAMPLE'));
    logger.info('In the proper implementation, shapes and renderers are separated:');

    // Create renderers
    logger.success('\nCreating different renderers:');
    const canvasRenderer = new CanvasRenderer();
    const svgRenderer = new SVGRenderer();
    const webGLRenderer = new WebGLRenderer();
    const threeDPrinterRenderer = new ThreeDPrinterRenderer();

    // Create shapes with initial renderers
    logger.success('\nCreating shapes with initial renderers:');
    const circle = new Circle(0, 0, 5, canvasRenderer);
    const rectangle = new Rectangle(0, 0, 10, 20, svgRenderer);
    const triangle = new Triangle(0, 0, 3, 4, 6, 0, webGLRenderer);

    // Create drawing manager
    const drawingManager = new DrawingManager();
    drawingManager.addShape(circle);
    drawingManager.addShape(rectangle);
    drawingManager.addShape(triangle);

    // Draw all shapes with their initial renderers
    logger.success('\nDrawing shapes with their initial renderers:');
    drawingManager.drawAll();

    // Change renderers at runtime
    logger.log('\nChanging renderer for circle from Canvas to WebGL:', LogColor.PHONE_DISPLAY);
    circle.setRenderer(webGLRenderer);
    circle.draw();

    logger.log('\nChanging renderer for rectangle from SVG to 3D Printer:', LogColor.WEB_DISPLAY);
    rectangle.setRenderer(threeDPrinterRenderer);
    rectangle.draw();

    // Change all renderers at once
    logger.success('\nChanging all renderers to Canvas:');
    drawingManager.useRenderer(canvasRenderer);

    // Draw again with new renderers
    logger.success('\nDrawing all shapes after switching renderers:');
    drawingManager.drawAll();

    // Highlighting the benefits
    logger.success('\nBenefits of the Bridge Pattern:');
    logger.success('1. Shapes and renderers can evolve independently');
    logger.success("2. Adding a new shape doesn't affect existing renderers");
    logger.success("3. Adding a new renderer doesn't affect existing shapes");
    logger.success('4. Can change renderers at runtime');
    logger.success('5. No code duplication across different shape classes');
}

// Run both examples
async function runDemonstration() {
    await runAntiPatternExample();
    await runProperPatternExample();
    logger.success('\n' + separator('END OF BRIDGE PATTERN EXAMPLE'));
}

runDemonstration().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error in demonstration: ${errorMessage}`);
});
