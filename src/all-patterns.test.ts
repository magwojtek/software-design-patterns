/**
 * All Patterns Test
 *
 * This test suite runs tests for all design pattern examples to ensure they work correctly.
 * It verifies project structure consistency without dynamically loading test files.
 */

import fs from 'fs';
import path from 'path';
import { PatternCategory, PatternType, PatternCategories } from './enums';

/**
 * Utility function to generate pattern-related paths
 * @param category Pattern category
 * @param patternName Pattern name
 * @param subpaths Additional path segments to join
 * @returns Full path to the requested resource
 */
const getPatternPath = (
    category: PatternCategory | string,
    patternName: PatternType | string,
    ...subpaths: string[]
): string => {
    return path.join(__dirname, 'patterns', category, patternName, ...subpaths);
};

// Helper function to check if pattern follows the expected structure
const checkPatternStructure = (patternName: PatternType, category: PatternCategory): void => {
    describe(`${patternName} pattern structure`, () => {
        // Test anti-pattern implementation structure
        describe('Anti-pattern implementation', () => {
            const antiPatternTestPath = getPatternPath(
                category,
                patternName,
                'anti-pattern',
                'implementation.test.ts',
            );

            it('should have test file', () => {
                expect(fs.existsSync(antiPatternTestPath)).toBe(true);
            });
        });

        // Test proper pattern implementation structure
        describe('Proper pattern implementation', () => {
            const properPatternTestPath = getPatternPath(
                category,
                patternName,
                'proper-pattern',
                'implementation.test.ts',
            );

            it('should have test file', () => {
                expect(fs.existsSync(properPatternTestPath)).toBe(true);
            });
        });

        // Verify the README.md exists
        describe('Documentation', () => {
            it('should have README.md file', () => {
                const readmePath = getPatternPath(category, patternName, 'README.md');
                expect(fs.existsSync(readmePath)).toBe(true);
            });
        });

        // Verify the main.ts exists
        describe('Example runner', () => {
            it('should have main.ts file', () => {
                const mainPath = getPatternPath(category, patternName, 'main.ts');
                expect(fs.existsSync(mainPath)).toBe(true);
            });
        });
    });
};

// Main test suite that tests all patterns
describe('All Design Pattern Examples', () => {
    // Get all defined pattern types
    const allPatterns = Object.values(PatternType);

    it('should have at least one pattern defined', () => {
        expect(allPatterns.length).toBeGreaterThan(0);
    });

    // Check structure for each pattern
    for (const pattern of allPatterns) {
        const patternType = pattern as PatternType;
        const category = PatternCategories[patternType];
        checkPatternStructure(patternType, category);
    }
});
