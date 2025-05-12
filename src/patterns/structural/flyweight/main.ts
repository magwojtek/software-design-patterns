/**
 * Flyweight Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Flyweight pattern.
 */
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

logger.info('=== Flyweight Pattern Example ===\n');

// Anti-pattern demonstration
export function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating text editor without using flyweight pattern:');

    // Create a text editor with the anti-pattern implementation
    const editor = AntiPattern.createSampleText();

    // Render the text
    editor.renderText();

    // Demonstrate trying to find characters at specific positions
    logger.info('\nFinding characters at position (30, 0):');
    const chars = editor.findCharactersAt(30, 0);

    if (chars.length > 0) {
        logger.info(`Found character: '${chars[0].getCharacter()}'`);
        const formatting = chars[0].getFormattingInfo();
        logger.info(
            `Formatting: ${formatting.fontFamily} ${formatting.fontSize}px, ` +
                `bold: ${formatting.isBold}, italic: ${formatting.isItalic}, ` +
                `underline: ${formatting.isUnderline}, color: ${formatting.color}`,
        );
    }

    // Demonstrate memory usage
    logger.error(
        `\nAnti-pattern memory footprint: ${editor.getMemoryUsage()} bytes for ${editor.getCharacterCount()} characters`,
    );
    logger.error(
        `Average bytes per character: ${Math.round(editor.getMemoryUsage() / editor.getCharacterCount())}`,
    );

    // Highlight the problems with this approach
    logger.error('\nProblems with the Anti-pattern approach:');
    logger.error('1. Each character instance stores duplicate formatting information');
    logger.error('2. Memory usage scales linearly with the number of characters');
    logger.error('3. Updating a formatting property requires changing all affected instances');
    logger.error('4. No way to share common data between similar objects');
    logger.error('5. Performance degrades as the number of objects increases');
}

// Proper pattern demonstration
export function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Creating text editor using the flyweight pattern:');

    // Create a text editor with the proper pattern implementation
    const editor = ProperPattern.createSampleText();

    // Render the text
    editor.renderText();

    // Demonstrate trying to find characters at specific positions
    logger.info('\nFinding characters at position (30, 0):');
    const chars = editor.findCharactersAt(30, 0);

    if (chars.length > 0) {
        const flyweight = chars[0].getFlyweight();
        logger.info(`Found character: '${flyweight.getCharacter()}'`);
        const formatting = flyweight.getFormatting();
        logger.info(
            `Formatting: ${formatting.fontFamily} ${formatting.fontSize}px, ` +
                `bold: ${formatting.isBold}, italic: ${formatting.isItalic}, ` +
                `underline: ${formatting.isUnderline}, color: ${formatting.color}`,
        );
    }

    // Demonstrate memory usage
    const stats = editor.getFlyweightStats();
    logger.success(
        `\nProper pattern memory footprint: ${stats.memory} bytes for ${stats.count} ` +
            `flyweight objects (${editor.getCharacterCount()} characters)`,
    );
    logger.success(
        `Average bytes per character: ${Math.round(stats.memory / editor.getCharacterCount())}`,
    );
    logger.success(`Reused flyweights ${stats.reused} times`);

    // Highlight the benefits of this approach
    logger.success('\nBenefits of the Flyweight Pattern:');
    logger.success('1. Dramatically reduces memory usage by sharing common data');
    logger.success('2. Clear separation between shared (intrinsic) and unique (extrinsic) state');
    logger.success('3. Centralized management of shared objects through the flyweight factory');
    logger.success('4. Updating shared properties updates all instances immediately');
    logger.success('5. Scales efficiently with large numbers of similar objects');

    // Show exact memory savings compared to anti-pattern
    const antiPatternMemory = 9 * 142; // Estimated based on 9 unique characters at 142 bytes each
    logger.success(
        `\nMemory saved: ${antiPatternMemory - stats.memory} bytes (${Math.round((1 - stats.memory / antiPatternMemory) * 100)}% reduction)`,
    );
}

// When this module is run directly
logger.info('=== FLYWEIGHT PATTERN DEMONSTRATION ===');
logger.info(
    'The Flyweight pattern minimizes memory usage by sharing common parts of state ' +
        'between multiple objects, instead of keeping all the data in each object.',
);

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Creates a new object for each character instance');
logger.error('- Stores redundant duplicate data in each object');
logger.error('- Memory usage grows linearly with number of objects');
logger.error('- Difficult to update shared properties');
logger.error('- Inefficient with large datasets');

logger.success('\nProper pattern approach:');
logger.success('- Shares common data through flyweight objects');
logger.success('- Separates intrinsic (shared) and extrinsic (unique) state');
logger.success('- Memory usage depends on unique combinations of shared data');
logger.success('- Single point of control for shared properties');
logger.success('- Scales efficiently with large datasets');
