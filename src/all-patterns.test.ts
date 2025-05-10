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

// Test for project structure consistency
describe('Project Structure', () => {
    /**
     * Checks if a file exists at the specified path relative to the pattern path
     * @param patternPath Base pattern path
     * @param segments Path segments to join with the pattern path
     */
    const checkFileExists = (patternPath: string, ...segments: string[]): void => {
        expect(fs.existsSync(path.join(patternPath, ...segments))).toBe(true);
    };

    // Check that each pattern follows the correct directory structure
    it('should have consistent directory structure for all patterns', () => {
        for (const category of Object.values(PatternCategory)) {
            const categoryPath = path.join(__dirname, 'patterns', category);

            // Skip if the directory doesn't exist yet (e.g., empty STRUCTURAL category)
            if (!fs.existsSync(categoryPath)) continue;

            const patterns = fs
                .readdirSync(categoryPath)
                .filter((dir) => fs.statSync(path.join(categoryPath, dir)).isDirectory());

            for (const pattern of patterns) {
                // Check directory structure
                const patternPath = path.join(categoryPath, pattern);

                // Check basic structure
                checkFileExists(patternPath, 'anti-pattern');
                checkFileExists(patternPath, 'proper-pattern');
                checkFileExists(patternPath, 'README.md');
                checkFileExists(patternPath, 'main.ts');

                // Check implementation files
                checkFileExists(patternPath, 'anti-pattern', 'implementation.ts');
                checkFileExists(patternPath, 'anti-pattern', 'implementation.test.ts');
                checkFileExists(patternPath, 'proper-pattern', 'implementation.ts');
                checkFileExists(patternPath, 'proper-pattern', 'implementation.test.ts');
            }
        }
    });
});
