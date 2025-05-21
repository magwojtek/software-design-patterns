/**
 * Flyweight Pattern Usage Example
 *
 * This script demonstrates a practical usage of the Flyweight pattern
 * by creating a large number of text characters with various formatting
 * and comparing memory usage between the anti-pattern and proper pattern.
 */
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

// Create a larger text sample to better demonstrate memory benefits
function demonstrateMemoryEfficiency(): void {
    logger.info('=== FLYWEIGHT PATTERN MEMORY EFFICIENCY DEMONSTRATION ===\n');

    // Sample text with repeating content to demonstrate the benefit of flyweights
    const sampleText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ' +
        'nisi ut aliquip ex ea commodo consequat.';

    // Different formatting options to use
    const formattingOptions = [
        {
            fontFamily: 'Arial',
            fontSize: 12,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            color: 'black',
        },
        {
            fontFamily: 'Arial',
            fontSize: 12,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            color: 'black',
        },
        {
            fontFamily: 'Times New Roman',
            fontSize: 14,
            isBold: false,
            isItalic: true,
            isUnderline: false,
            color: 'blue',
        },
        {
            fontFamily: 'Courier New',
            fontSize: 12,
            isBold: false,
            isItalic: false,
            isUnderline: true,
            color: 'red',
        },
    ];

    // Create anti-pattern editor
    logger.warn('\n--- Anti-pattern Implementation ---');
    const startAntiPattern = process.hrtime();
    const antiPatternEditor = new AntiPattern.TextEditor();

    // Add characters with formatting
    for (let i = 0; i < sampleText.length; i++) {
        const char = sampleText[i];
        // Alternate formatting for visual variety
        const formatting = formattingOptions[i % formattingOptions.length];
        antiPatternEditor.addCharacter(char, formatting, i * 10, Math.floor(i / 50) * 20);
    }

    const endAntiPattern = process.hrtime(startAntiPattern);
    const antiPatternTime = endAntiPattern[0] * 1000 + endAntiPattern[1] / 1000000;

    logger.error(`Anti-pattern created ${antiPatternEditor.getCharacterCount()} characters`);
    logger.error(`Memory used: ${Math.round(antiPatternEditor.getMemoryUsage() / 1024)} KB`);
    logger.error(`Time taken: ${antiPatternTime.toFixed(2)} ms`);

    // Create proper pattern editor
    logger.success('\n--- Proper Pattern Implementation ---');
    const factory = new ProperPattern.CharacterFlyweightFactory();
    const startProperPattern = process.hrtime();
    const properPatternEditor = new ProperPattern.TextEditor(factory);

    // Add same characters with same formatting
    for (let i = 0; i < sampleText.length; i++) {
        const char = sampleText[i];
        // Alternate formatting for visual variety
        const formatting = formattingOptions[i % formattingOptions.length];
        properPatternEditor.addCharacter(char, formatting, i * 10, Math.floor(i / 50) * 20);
    }

    const endProperPattern = process.hrtime(startProperPattern);
    const properPatternTime = endProperPattern[0] * 1000 + endProperPattern[1] / 1000000;

    const stats = properPatternEditor.getFlyweightStats();
    logger.success(
        `Proper pattern created ${properPatternEditor.getCharacterCount()} characters using ${stats.count} flyweights`,
    );
    logger.success(`Memory used: ${Math.round(stats.memory / 1024)} KB`);
    logger.success(`Flyweights reused: ${stats.reused} times`);
    logger.success(`Time taken: ${properPatternTime.toFixed(2)} ms`);

    // Calculate and display memory savings
    const memorySaving = antiPatternEditor.getMemoryUsage() - stats.memory;
    const memorySavingPercent = Math.round(
        (memorySaving / antiPatternEditor.getMemoryUsage()) * 100,
    );

    logger.info('\n--- Memory Efficiency Results ---');
    logger.info(`Total characters: ${sampleText.length}`);
    logger.info(`Unique character-formatting combinations: ${stats.count}`);
    logger.info(`Memory saving: ${Math.round(memorySaving / 1024)} KB (${memorySavingPercent}%)`);
    logger.info(
        `Memory per character (Anti-pattern): ${Math.round(antiPatternEditor.getMemoryUsage() / sampleText.length)} bytes`,
    );
    logger.info(
        `Memory per character (Proper pattern): ${Math.round(stats.memory / sampleText.length)} bytes`,
    );

    logger.info('\n--- Scaling Analysis ---');
    logger.info(`With 1 million characters:`);
    logger.info(
        `  Anti-pattern would use approximately: ${Math.round(((antiPatternEditor.getMemoryUsage() / sampleText.length) * 1000000) / (1024 * 1024))} MB`,
    );
    logger.info(
        `  Proper pattern would use approximately: ${Math.round(((stats.memory / sampleText.length) * 1000000) / (1024 * 1024))} MB`,
    );
    logger.info(
        `  Memory saved: ${Math.round((((antiPatternEditor.getMemoryUsage() - stats.memory) / sampleText.length) * 1000000) / (1024 * 1024))} MB`,
    );
}

// When this module is run directly
demonstrateMemoryEfficiency();
