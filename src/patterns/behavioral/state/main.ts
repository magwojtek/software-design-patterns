/**
 * State Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the State pattern.
 */
import { DocumentAntiPattern } from './anti-pattern/implementation';
import { Document } from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

logger.info('=== State Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the State pattern
 * with conditional statements and hard-coded state transitions.
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating a document:');

    const document = new DocumentAntiPattern();

    logger.info(`Document is in ${document.getState()} state`);

    logger.info('\nSubmitting document for review:');
    document.submitForReview();
    logger.info(`Document is now in ${document.getState()} state`);

    logger.info('\nTrying to submit again while in moderation:');
    document.submitForReview();

    logger.info('\nPublishing the document:');
    document.publish();
    logger.info(`Document is now in ${document.getState()} state`);

    logger.info('\nTrying to reject a published document:');
    document.reject();

    logger.info('\nEditing the published document:');
    document.edit();
    logger.info(`Document is now in ${document.getState()} state`);

    logger.info('\nSubmitting again and then rejecting:');
    document.submitForReview();
    document.reject();
    logger.info(`Document is now in ${document.getState()} state`);

    logger.info('\nResubmitting a rejected document:');
    document.submitForReview();
    logger.info(`Document is now in ${document.getState()} state`);

    logger.info('\nProblems:');
    logger.error('1. Uses conditional statements to handle state transitions');
    logger.error('2. State logic is scattered throughout the context class');
    logger.error('3. Adding new states requires modifying existing code');
    logger.error('4. State transitions are hard-coded and difficult to maintain');
    logger.error('5. Violates the Open/Closed Principle\n');
}

/**
 * Demonstrates the proper implementation of the State pattern
 * with encapsulated state objects and delegated behavior.
 */
function demonstrateProperPattern(): void {
    logger.success('--- Proper Pattern Example ---');
    logger.info('Creating a document:');

    const document = new Document();

    logger.info(`Document is in ${document.getStateName()} state`);

    logger.info('\nSubmitting document for review:');
    document.submitForReview();
    logger.info(`Document is now in ${document.getStateName()} state`);

    logger.info('\nTrying to submit again while in moderation:');
    document.submitForReview();

    logger.info('\nPublishing the document:');
    document.publish();
    logger.info(`Document is now in ${document.getStateName()} state`);

    logger.info('\nTrying to reject a published document:');
    document.reject();

    logger.info('\nEditing the published document:');
    document.edit();
    logger.info(`Document is now in ${document.getStateName()} state`);

    logger.info('\nSubmitting again and then rejecting:');
    document.submitForReview();
    document.reject();
    logger.info(`Document is now in ${document.getStateName()} state`);

    logger.info('\nResubmitting a rejected document:');
    document.submitForReview();
    logger.info(`Document is now in ${document.getStateName()} state`);

    logger.info('\nBenefits:');
    logger.success('1. Encapsulates state-specific behavior in separate classes');
    logger.success('2. Eliminates conditional statements for state transitions');
    logger.success('3. Makes adding new states easy without modifying existing code');
    logger.success('4. State transitions are managed by the state objects themselves');
    logger.success('5. Follows the Open/Closed Principle');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of State Pattern Example ===');
