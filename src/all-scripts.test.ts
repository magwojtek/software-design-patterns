import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { PatternCategory, CategoryPatterns } from './enums/pattern-category';
import { logger } from './utils/logger';

// Convert exec to a Promise-based function
const execPromise = util.promisify(exec);

// Helper function to get all pattern main script paths
function getPatternMainFiles(): string[] {
    const mainFiles: string[] = [];
    const categories = Object.values(PatternCategory);

    for (const category of categories) {
        const patterns = CategoryPatterns[category] || [];

        for (const pattern of patterns) {
            const mainFilePath = path.join(__dirname, 'patterns', category, pattern, 'main.ts');

            if (fs.existsSync(mainFilePath)) {
                mainFiles.push(mainFilePath);
            }
        }
    }

    return mainFiles;
}

describe('Example Scripts', () => {
    const mainFiles = getPatternMainFiles();
    const timeout = 10000; // 10 seconds timeout for each test

    test('should find at least one example script', () => {
        expect(mainFiles.length).toBeGreaterThan(0);
    });

    test.each(mainFiles)(
        'should compile and run %s without errors',
        async (filePath) => {
            const relativePath = path.relative(process.cwd(), filePath);

            try {
                // Run the TypeScript file using ts-node with proper tsconfig path to resolve modules
                const { stdout, stderr } = await execPromise(
                    `npx ts-node -r tsconfig-paths/register ${relativePath}`,
                );

                // Output for debugging purposes - use consistent logger
                if (stdout) {
                    logger.info(`Output from ${relativePath}: ${stdout}`);
                }

                // If there's stderr but the command didn't throw, it might be just warnings
                if (stderr) {
                    logger.warn(`Warnings from ${relativePath}: ${stderr}`);
                }

                // If we got here without an exception, the script compiled and ran successfully
                expect(true).toBe(true);
            } catch (error) {
                // Use consistent error logging
                logger.error(`Error running ${relativePath}: ${error}`);
                // Fail the test with the error message
                expect(error).toBeUndefined();
            }
        },
        timeout,
    );
});
