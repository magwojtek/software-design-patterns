/**
 * Adapter Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Adapter pattern.
 */
import {
    LegacyPaymentProcessor,
    ModernPaymentProcessor,
    NewPaymentProcessor,
    PaymentService as AntiPatternPaymentService,
} from './anti-pattern/implementation';
import {
    LegacyPaymentProcessor as ProperLegacyPaymentProcessor,
    ModernPaymentProcessor as ProperModernPaymentProcessor,
    NewPaymentProcessor as ProperNewPaymentProcessor,
    PaymentProcessor,
    PaymentService as ProperPaymentService,
    createPaymentProcessor,
} from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

logger.info('=== Adapter Pattern Example ===\n');

// Create payment processors
const legacyProcessor = new LegacyPaymentProcessor();
const modernProcessor = new ModernPaymentProcessor();
const newProcessor = new NewPaymentProcessor();

// Anti-pattern demonstration
logger.info('--- Anti-pattern Example ---');
const antiPatternService = new AntiPatternPaymentService();

// Process payments with different processors
logger.info('Processing payments with different processors:');
async function runAntiPatternExample() {
    try {
        logger.info('\n1. Legacy processor payment:');
        await antiPatternService.processPayment(legacyProcessor, 100, 'account123');

        logger.info('\n2. Modern processor payment:');
        await antiPatternService.processPayment(modernProcessor, 200, 'account456');

        logger.info('\n3. New processor payment:');
        await antiPatternService.processPayment(newProcessor, 300, 'account789');

        logger.info('\n4. Validating accounts:');
        logger.info(
            `Legacy validation result: ${antiPatternService.validateAccount(legacyProcessor, 'account123')}`,
        );
        logger.info(
            `Modern validation result: ${antiPatternService.validateAccount(modernProcessor, 'account456')}`,
        );
        logger.info(
            `New validation result: ${antiPatternService.validateAccount(newProcessor, 'account789')}`,
        );

        // Attempt with unsupported processor
        logger.info('\n5. Trying unsupported processor:');
        try {
            await antiPatternService.processPayment({}, 400, 'account000');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger.error(`Error: ${errorMessage}`);
        }

        // Show the problems with anti-pattern
        logger.error('\nProblems with Anti-Pattern:');
        logger.error('1. Client code is tightly coupled to all processor implementations');
        logger.error('2. Each new processor requires modifying client code');
        logger.error('3. Complex conditional logic grows with each new processor type');
        logger.error('4. Changes to any processor interface could break client code');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Unexpected error: ${errorMessage}`);
    }
}

// Proper pattern demonstration
async function runProperPatternExample() {
    logger.info('\n--- Proper Pattern Example ---');
    const properService = new ProperPaymentService();

    // Create the original processors
    const properLegacyProcessor = new ProperLegacyPaymentProcessor();
    const properModernProcessor = new ProperModernPaymentProcessor();
    const properNewProcessor = new ProperNewPaymentProcessor();

    logger.info('Creating adapters for different payment processors:');
    // Create adapters using factory method
    const legacyAdapter = createPaymentProcessor(properLegacyProcessor);
    const modernAdapter = createPaymentProcessor(properModernProcessor);
    const newAdapter = createPaymentProcessor(properNewProcessor);

    // Process payments through the unified interface
    logger.info('\nProcessing payments with adapters:');

    logger.info('\n1. Legacy processor (adapted):');
    await properService.processPayment(legacyAdapter, 100, 'account123');

    logger.info('\n2. Modern processor (adapted):');
    await properService.processPayment(modernAdapter, 200, 'account456');

    logger.info('\n3. New processor (adapted):');
    await properService.processPayment(newAdapter, 300, 'account789');

    // Validate accounts through the unified interface
    logger.info('\n4. Validating accounts through adapters:');
    logger.info(
        `Legacy validation result: ${properService.validateAccount(legacyAdapter, 'account123')}`,
    );
    logger.info(
        `Modern validation result: ${properService.validateAccount(modernAdapter, 'account456')}`,
    );
    logger.info(
        `New validation result: ${properService.validateAccount(newAdapter, 'account789')}`,
    );

    // Demonstrate polymorphism with adapters
    logger.info('\n5. Demonstrating polymorphism with adapters:');

    logger.info('\nIterating through different adapters with uniform interface:');
    const processors: PaymentProcessor[] = [legacyAdapter, modernAdapter, newAdapter];
    for (let i = 0; i < processors.length; i++) {
        const processor = processors[i];
        const processorName = i === 0 ? 'Legacy' : i === 1 ? 'Modern' : 'New';
        logger.info(`\nProcessor ${i + 1} (${processorName}):`);
        await properService.processPayment(processor, 150, 'common-account');
    }

    logger.info('\nBenefits of the Adapter Pattern:');
    logger.success('1. Client code works with a single, unified interface');
    logger.success('2. New processors can be added without changing client code');
    logger.success('3. Adaptation logic is isolated in adapter classes');
    logger.success('4. No conditional type-checking in client code');
    logger.success('5. Adapters can be reused throughout the application');
}

// Run both examples
async function runDemonstration() {
    await runAntiPatternExample();
    await runProperPatternExample();
    logger.info('\n=== End of Adapter Pattern Example ===');
}

runDemonstration().catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error in demonstration: ${errorMessage}`);
});
