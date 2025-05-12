import { logger } from '~/utils/logger';
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';

export function demonstrateAntiPattern(): void {
    logger.info('\n--- DECORATOR PATTERN - ANTI-PATTERN DEMO ---');

    // Create a simple text
    const text = 'Hello, Decorator Pattern!';
    logger.info('\nOriginal text:');
    logger.info(text);

    // Format text using various formatter classes from the anti-pattern
    logger.info('\nFormatting text using individual formatters:');
    const bold = new AntiPattern.BoldTextFormatter(text);
    bold.print();

    const italic = new AntiPattern.ItalicTextFormatter(text);
    italic.print();

    const underline = new AntiPattern.UnderlineTextFormatter(text);
    underline.print();

    // Format text using combined formatters
    logger.info('\nFormatting text using combined formatters:');
    const boldItalic = new AntiPattern.BoldItalicTextFormatter(text);
    boldItalic.print();

    const boldUnderline = new AntiPattern.BoldUnderlineTextFormatter(text);
    boldUnderline.print();

    const allFormatting = new AntiPattern.BoldItalicUnderlineTextFormatter(text);
    allFormatting.print();

    // Use the Manager class
    logger.info('\nUsing TextFormattingManager:');
    logger.info(AntiPattern.TextFormattingManager.getBoldText(text));
    logger.info(AntiPattern.TextFormattingManager.getItalicText(text));
    logger.info(AntiPattern.TextFormattingManager.getBoldItalicUnderlineText(text));

    // Try to add a new formatting option - color
    logger.info('\nAdding color formatting:');
    logger.info(AntiPattern.TextFormattingManager.getColoredText(text, 'red'));

    // Show the problem of combining formats - we need to manually nest them
    logger.warn('\nTrying to combine color with bold formatting:');
    const boldText = AntiPattern.TextFormattingManager.getBoldText(text);
    const coloredBold = AntiPattern.TextFormattingManager.getColoredText(boldText, 'blue');
    logger.info(coloredBold);
    logger.error('This produces semantically incorrect HTML with tags in the wrong order');

    // Demonstrate the result of adding many formatting options
    logger.error('\nAdding more formatting options would cause class explosion:');
    logger.error('- Each combination requires a new class');
    logger.error('- For n formatting options, we need 2^n - 1 classes');
    logger.error('- With just 3 options (Bold, Italic, Underline), we needed 7 classes');
    logger.error('- Adding 1 more option (e.g., Color) would require 8 more classes');
    logger.error('- Adding another option (e.g., Font Size) would require 16 more classes');
}

export function demonstrateProperPattern(): void {
    logger.info('\n--- DECORATOR PATTERN - PROPER PATTERN DEMO ---');

    // Create a simple text component
    const text = 'Hello, Decorator Pattern!';
    const simpleText = new ProperPattern.SimpleText(text);

    logger.info('\nOriginal text:');
    simpleText.print();

    // Apply individual decorators
    logger.info('\nApplying individual decorators:');

    // Create a bold text
    const boldText = new ProperPattern.BoldDecorator(new ProperPattern.SimpleText(text));
    boldText.print();

    // Create an italic text
    const italicText = new ProperPattern.ItalicDecorator(new ProperPattern.SimpleText(text));
    italicText.print();

    // Create an underlined text
    const underlinedText = new ProperPattern.UnderlineDecorator(new ProperPattern.SimpleText(text));
    underlinedText.print();

    // Create a colored text
    const coloredText = new ProperPattern.ColorDecorator(new ProperPattern.SimpleText(text), 'red');
    coloredText.print();

    // Combined decorators
    logger.info('\nCombining multiple decorators:');

    // Bold + Italic
    const boldItalic = new ProperPattern.BoldDecorator(
        new ProperPattern.ItalicDecorator(new ProperPattern.SimpleText(text)),
    );
    boldItalic.print();

    // Bold + Italic + Underline
    const boldItalicUnderline = new ProperPattern.BoldDecorator(
        new ProperPattern.ItalicDecorator(
            new ProperPattern.UnderlineDecorator(new ProperPattern.SimpleText(text)),
        ),
    );
    boldItalicUnderline.print();

    // More complex combinations are easy with decorators
    logger.info('\nComplex combinations:');
    const complex = new ProperPattern.ColorDecorator(
        new ProperPattern.BoldDecorator(
            new ProperPattern.ItalicDecorator(
                new ProperPattern.UnderlineDecorator(
                    new ProperPattern.BackgroundDecorator(
                        new ProperPattern.SimpleText(text),
                        'yellow',
                    ),
                ),
            ),
        ),
        'blue',
    );
    complex.print();

    // Using the formatter manager
    logger.info('\nUsing TextFormatterManager:');
    const boldComponent = ProperPattern.TextFormatterManager.createBoldText(text);
    ProperPattern.TextFormatterManager.formatText(boldComponent);

    const italicComponent = ProperPattern.TextFormatterManager.createItalicText(text);
    ProperPattern.TextFormatterManager.formatText(italicComponent);

    const boldItalicComponent = ProperPattern.TextFormatterManager.createBoldItalicText(text);
    ProperPattern.TextFormatterManager.formatText(boldItalicComponent);

    // Adding new decorations to existing components
    logger.info('\nDynamically adding decorations:');
    // Fix: Use TextComponent type explicitly and cast at each step
    let component: ProperPattern.TextComponent = new ProperPattern.SimpleText(text);
    component = ProperPattern.TextFormatterManager.addFormatting(component, 'bold');
    component = ProperPattern.TextFormatterManager.addFormatting(component, 'italic');
    component = ProperPattern.TextFormatterManager.addFormatting(component, 'color', 'green');
    ProperPattern.TextFormatterManager.formatText(component);

    // Demonstrate extensibility - create a new decorator at runtime
    logger.info('\nDemonstrating extensibility with a new decorator:');

    // Define a new decorator class extending the abstract TextDecorator class
    class StrikethroughDecorator extends ProperPattern.TextDecorator {
        format(): string {
            const result = `<s>${this.component.format()}</s>`;
            return result;
        }
    }

    // Use the new decorator
    const strikethrough = new StrikethroughDecorator(new ProperPattern.SimpleText(text));
    strikethrough.print();

    // Combine with existing decorators
    const boldStrikethrough = new ProperPattern.BoldDecorator(strikethrough);
    boldStrikethrough.print();

    // Show the final structure with all decorations
    logger.info('\nFinal decorated text with various combinations:');
    const sample = ProperPattern.createSampleFormattedText();

    for (const [name, component] of Object.entries(sample.formattedComponents)) {
        logger.info(`\n${name}:`);
        component.print();
    }
}

// When this module is run directly
logger.info('=== DECORATOR PATTERN DEMONSTRATION ===');
logger.info(
    'The Decorator pattern lets you attach new behaviors to objects by placing them inside ' +
        'special wrapper objects that contain these behaviors.',
);

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Uses inheritance for each combination of behaviors');
logger.error('- Leads to class explosion as combinations grow');
logger.error("- Rigid structure that's hard to extend");
logger.error('- Changes require modifying existing code');
logger.error('- Difficult to combine behaviors at runtime');

logger.success('\nProper pattern approach:');
logger.success('- Uses composition instead of inheritance');
logger.success('- Only needs one class per behavior (decorator)');
logger.success("- Flexible structure that's easy to extend");
logger.success('- Can add new behaviors without changing existing code');
logger.success('- Can combine behaviors dynamically at runtime');
logger.success('- Follows Single Responsibility and Open/Closed principles');
