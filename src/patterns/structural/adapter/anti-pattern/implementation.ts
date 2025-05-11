/**
 * Adapter Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Client code needs detailed knowledge of each processor type
 * 2. Adding new processors requires modifying client code
 * 3. Conditional logic grows with each new processor type
 * 4. Fragile code: changes to any processor interface affect client code
 * 5. Testing complexity due to multiple execution paths
 */
import { logger } from '~/utils/logger';

// Represents a legacy payment processor (e.g., from a third-party library we can't modify)
export class LegacyPaymentProcessor {
    // Legacy interface for processing payments
    processPayment(amount: number, account: string): boolean {
        logger.info(`Legacy system: Processing $${amount} payment to account ${account}`);
        // Simulate successful payment
        return true;
    }

    // Additional legacy method that might be used
    validateAccount(account: string): boolean {
        logger.info(`Legacy system: Validating account ${account}`);
        return account.length > 5;
    }
}

// Represents a modern payment processor with a different interface
export class ModernPaymentProcessor {
    // Different interface for making payments
    makePayment(paymentData: { sum: number; target: string }): { success: boolean } {
        logger.info(
            `Modern system: Making payment of $${paymentData.sum} to ${paymentData.target}`,
        );
        // Simulate successful payment
        return { success: true };
    }

    // Additional modern method with different signature
    verifyDestination(target: string): { valid: boolean; reason?: string } {
        logger.info(`Modern system: Verifying destination ${target}`);
        const valid = target.length > 5;
        return {
            valid,
            reason: valid ? undefined : 'Account too short',
        };
    }
}

// Represents a new payment system with yet another different interface
export class NewPaymentProcessor {
    // Different interface for executing payments
    executeTransaction(data: { amount: string; recipient: string; currency: string }): Promise<{
        status: 'completed' | 'failed';
    }> {
        const amount = parseFloat(data.amount);
        logger.info(
            `New system: Executing ${data.currency} ${amount} transaction to ${data.recipient}`,
        );
        // Simulate async successful payment
        return Promise.resolve({ status: 'completed' });
    }
}

// Client code that directly uses different payment processors
export class PaymentService {
    // Problem: Client needs to know details about each processor type and their interfaces
    async processPayment(processor: unknown, amount: number, accountId: string): Promise<boolean> {
        // Problem: Type checking and conditional logic based on processor type
        if (processor instanceof LegacyPaymentProcessor) {
            // First validate the account using the legacy method
            if (!processor.validateAccount(accountId)) {
                logger.info('Payment failed: Invalid account in legacy system');
                return false;
            }
            // Then process payment using legacy interface
            return processor.processPayment(amount, accountId);
        } else if (processor instanceof ModernPaymentProcessor) {
            // First verify the destination using modern method
            const verification = processor.verifyDestination(accountId);
            if (!verification.valid) {
                logger.info(`Payment failed: ${verification.reason}`);
                return false;
            }
            // Then make payment using modern interface
            const result = processor.makePayment({ sum: amount, target: accountId });
            return result.success;
        } else if (processor instanceof NewPaymentProcessor) {
            // Process payment using new async interface
            const result = await processor.executeTransaction({
                amount: amount.toString(),
                recipient: accountId,
                currency: 'USD',
            });
            return result.status === 'completed';
        } else {
            // Problem: Need to throw error for unknown processor types
            throw new Error('Unsupported payment processor type');
        }
    }

    // Problem: Another method that also needs to handle different processor types
    validateAccount(processor: unknown, accountId: string): boolean {
        // Duplicating the conditional logic
        if (processor instanceof LegacyPaymentProcessor) {
            return processor.validateAccount(accountId);
        } else if (processor instanceof ModernPaymentProcessor) {
            return processor.verifyDestination(accountId).valid;
        } else if (processor instanceof NewPaymentProcessor) {
            // Doesn't even have a proper validation method, would need special handling
            return accountId.length > 5;
        } else {
            throw new Error('Unsupported payment processor type');
        }
    }
}
