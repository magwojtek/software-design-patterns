/**
 * Strategy Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Strategy pattern.
 */
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';
import { logger } from '~/utils/logger';
import {
    NavigationApp,
    RoutingStrategyFactory,
    RoutingStrategyType,
} from './proper-pattern/implementation';

logger.info('=== Strategy Pattern Example ===\n');

// Anti-pattern demonstration
export function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Navigation app with embedded conditional logic for different routing strategies:');

    // Run the anti-pattern demonstration
    AntiPattern.demonstrateAntiPatternUsage();

    logger.error('\nProblems with the Anti-pattern approach:');
    logger.error('1. Adding a new routing mode requires modifying the NavigationApp class');
    logger.error('2. Conditional logic is duplicated across multiple methods');
    logger.error('3. Violates Single Responsibility Principle - class does too many things');
    logger.error('4. Hard to test routing algorithms in isolation');
    logger.error('5. No clear separation between routing algorithms and app logic');
}

// Proper pattern demonstration
export function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Navigation app using composition with routing strategy interface:');

    // Run the proper pattern demonstration
    ProperPattern.demonstrateProperPatternUsage();

    logger.success('\nBenefits of the Strategy Pattern:');
    logger.success('1. Easy to add new routing strategies without modifying existing code');
    logger.success('2. Clear separation of concerns and single responsibility for each class');
    logger.success('3. Strategies can be switched at runtime');
    logger.success('4. Better testability with clear interfaces and decoupled components');
    logger.success(
        '5. Follows Open/Closed principle - open for extension, closed for modification',
    );
}

// When this module is run directly
logger.info('=== STRATEGY PATTERN DEMONSTRATION ===');
logger.info(
    'The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
);
logger.info('It lets the algorithm vary independently from clients that use it.');

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Uses conditional statements to select behavior');
logger.error('- Mixes multiple routing implementations in a single class');
logger.error('- Code becomes more complex as new strategies are added');
logger.error('- Hard to maintain and extend');

logger.success('\nProper pattern approach:');
logger.success('- Encapsulates each algorithm in separate strategy classes');
logger.success('- Uses composition over inheritance');
logger.success('- Makes strategies interchangeable at runtime');
logger.success('- Follows SOLID principles');
logger.success('- Simplifies adding new strategies');

// Demonstrate enum-based factory usage
logger.info('\n--- Enum-Based Factory Example ---');
const navigation = new NavigationApp();

// Use the enum values for type safety and better IDE completion
navigation.setRoutingStrategy(RoutingStrategyFactory.createStrategy(RoutingStrategyType.CAR));
navigation.displayETA('Airport', 'Hotel');

navigation.setRoutingStrategy(
    RoutingStrategyFactory.createStrategy(RoutingStrategyType.PUBLIC_TRANSPORT),
);
navigation.displayETA('Airport', 'Hotel');

navigation.setRoutingStrategy(RoutingStrategyFactory.createStrategy(RoutingStrategyType.WALKING));
navigation.displayETA('Airport', 'Hotel');

logger.info('Using enum-based strategy selection prevents typos and provides IDE autocompletion');

logger.info('\n=== End of Strategy Pattern Example ===');
