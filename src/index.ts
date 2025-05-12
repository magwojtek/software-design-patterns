import path from 'path';
import fs from 'fs';
import { logger } from './utils/logger';
import { CategoryPatterns, PatternType, PatternCategory, PatternCategories } from '~/enums';

// Use existing enum mappings instead of hardcoded values
// PatternCategories already maps each pattern type to its category

/**
 * Main entry point for running pattern examples
 */
const runPatternExample = async (patternName: string) => {
    try {
        if (patternName === 'all') {
            // If 'all' is passed, run all patterns
            const allPatterns = Object.values(PatternType);
            for (const pattern of allPatterns) {
                const category = PatternCategories[pattern as PatternType];
                const patternPath = path.join(__dirname, 'patterns', category, pattern, 'main.ts');
                if (fs.existsSync(patternPath)) {
                    logger.info(`Running ${pattern} pattern example...`);
                    await import(patternPath);
                } else {
                    logger.error(`Pattern implementation not found: ${patternPath}`);
                }
            }
            return;
        }

        // Convert patternName to PatternType if it's a valid pattern
        const patternType = Object.values(PatternType).find((type) => type === patternName);

        if (!patternType) {
            logger.error(`Unknown pattern: ${patternName}`);
            logger.info('Available patterns:');
            Object.values(PatternCategory).forEach((category) => {
                logger.info(`- ${category}:`);
                CategoryPatterns[category as PatternCategory].forEach((pattern) => {
                    logger.info(`  - ${pattern}`);
                });
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

logger.info(`Running ${patternName} pattern example...`);
void runPatternExample(patternName);
