/**
 * Singleton Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Singleton pattern.
 */
import { DatabaseConnection as AntiPatternDB } from './anti-pattern/implementation';
import { DatabaseConnection as ProperPatternDB } from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

/**
 * Demonstrates the anti-pattern approach to implementing a singleton
 * which incorrectly allows creation of multiple instances
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating and using global instance:');
    AntiPatternDB.instance.connect();
    AntiPatternDB.instance.executeQuery('SELECT * FROM users');

    logger.info('\nCreating second instance (which should not be possible in a true singleton):');
    const secondInstance = new AntiPatternDB();
    secondInstance.connectionString = 'another-connection';
    secondInstance.connect();
    logger.warn(`Are instances the same object? ${AntiPatternDB.instance === secondInstance}`);
    logger.error('Problem: Multiple instances exist, breaking the singleton guarantee');
}

/**
 * Demonstrates the proper implementation of the Singleton pattern
 * ensuring only one instance is created and used throughout the application
 */
function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Getting singleton instance:');
    const db1 = ProperPatternDB.getInstance();
    db1.connect('production-db-connection');
    db1.executeQuery('SELECT * FROM users');

    logger.info('\nGetting another reference to the singleton:');
    const db2 = ProperPatternDB.getInstance();
    logger.success(`Are instances the same object? ${db1 === db2}`);
    logger.success(`Using connection string from first initialization: ${db2.isConnected()}`);
    db2.executeQuery('SELECT count(*) FROM users');

    logger.success(
        '\nBenefit: Only one database connection is maintained throughout the application',
    );
}

logger.info('=== Singleton Pattern Example ===\n');

// Run the anti-pattern demonstration
demonstrateAntiPattern();

// Run the proper pattern demonstration
demonstrateProperPattern();

logger.info('\n=== End of Singleton Pattern Example ===');
