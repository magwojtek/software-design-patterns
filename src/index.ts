import path from 'path';
import fs from 'fs';
import { logger } from './utils/logger';
import { PatternType, PatternCategories } from '~/enums';

// Use existing enum mappings instead of hardcoded values
// PatternCategories already maps each pattern type to its category

/**
 * Main entry point for running pattern examples
 */
const runPatternExample = async (patternName: string) => {
    try {
        // Convert patternName to PatternType if it's a valid pattern
        const patternType = Object.values(PatternType).find((type) => type === patternName);

        if (!patternType) {
            logger.error(`Unknown pattern: ${patternName}`);
            logger.info('Available patterns:');
            Object.values(PatternType).forEach((pattern) => {
                const category = PatternCategories[pattern as PatternType];
                logger.info(`- ${pattern} (${category})`);
            });
            process.exit(1);
        }

        // Get the category for the pattern from the enum mapping
        const category = PatternCategories[patternType as PatternType];
        const patternPath = path.join(__dirname, 'patterns', category, patternName, 'main.ts');

        if (!fs.existsSync(patternPath)) {
            logger.error(`Pattern implementation not found: ${patternPath}`);
            process.exit(1);
        }

        // Using dynamic import instead of require
        await import(patternPath);
    } catch (error) {
        logger.error(`Error running pattern example: ${patternName}`);
        logger.error(`${error}`);
    }
};

// Get pattern name from command line arguments
const patternName = process.argv[2];

if (!patternName) {
    logger.warn('Please specify a pattern name');
    logger.info('Example: npm run start:pattern -- singleton');
    logger.info('Available patterns:');
    Object.values(PatternType).forEach((pattern) => {
        const category = PatternCategories[pattern as PatternType];
        logger.info(`- ${pattern} (${category})`);
    });
    process.exit(1);
}

logger.info(`Running ${patternName} pattern example...`);
void runPatternExample(patternName);
