/**
 * Adapter Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Client code works with a single, unified interface
 * 2. New processor types can be added without changing client code
 * 3. Adaptation logic is isolated in adapter classes
 * 4. Client code can be tested with mock adapters
 * 5. Adapters can be reused throughout the application
 */
import { logger } from '~/utils/logger';

// Target interface that client expects to work with
export interface PaymentProcessor {
    // Common payment method signature
    processPayment(amount: number, accountId: string): Promise<boolean>;

    // Common validation method signature
    validateAccount(accountId: string): boolean;
}

// Original adapter classes - These represent existing systems we can't change

// Represents a legacy payment processor (e.g., from a third-party library)
export class LegacyPaymentProcessor {
    private lastOperation: string | null = null;

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    // Legacy interface for processing payments
    processPayment(amount: number, account: string): boolean {
        this.lastOperation = `Legacy system: Processing $${amount} payment to account ${account}`;
        logger.info(this.lastOperation);
        // Simulate successful payment
        return true;
    }

    // Additional legacy method that might be used
    validateAccount(account: string): boolean {
        this.lastOperation = `Legacy system: Validating account ${account}`;
        logger.info(this.lastOperation);
        return account.length > 5;
    }
}

// Represents a modern payment processor with a different interface
export class ModernPaymentProcessor {
    private lastOperation: string | null = null;

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    // Different interface for making payments
    makePayment(paymentData: { sum: number; target: string }): { success: boolean } {
        this.lastOperation = `Modern system: Making payment of $${paymentData.sum} to ${paymentData.target}`;
        logger.info(this.lastOperation);
        // Simulate successful payment
        return { success: true };
    }

    // Additional modern method with different signature
    verifyDestination(target: string): { valid: boolean; reason?: string } {
        this.lastOperation = `Modern system: Verifying destination ${target}`;
        logger.info(this.lastOperation);
        const valid = target.length > 5;
        return {
            valid,
            reason: valid ? undefined : 'Account too short',
        };
    }
}

// Represents a new payment system with yet another different interface
export class NewPaymentProcessor {
    private lastOperation: string | null = null;

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    // Different interface for executing payments
    executeTransaction(data: { amount: string; recipient: string; currency: string }): Promise<{
        status: 'completed' | 'failed';
    }> {
        const amount = parseFloat(data.amount);
        this.lastOperation = `New system: Executing ${data.currency} ${amount} transaction to ${data.recipient}`;
        logger.info(this.lastOperation);
        // Simulate async successful payment
        return Promise.resolve({ status: 'completed' });
    }
}

// Adapter implementations - They adapt different interfaces to a common target interface

// Adapter for the legacy payment processor
export class LegacyPaymentProcessorAdapter implements PaymentProcessor {
    private legacyProcessor: LegacyPaymentProcessor;
    private lastOperation: string | null = null;

    constructor(legacyProcessor: LegacyPaymentProcessor) {
        this.legacyProcessor = legacyProcessor;
        this.lastOperation = 'Created adapter for Legacy Payment Processor';
        logger.success(this.lastOperation);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    async processPayment(amount: number, accountId: string): Promise<boolean> {
        this.lastOperation = `Adapter: Processing payment using legacy system`;
        logger.info(this.lastOperation);

        // First validate the account
        if (!this.validateAccount(accountId)) {
            return false;
        }

        // Then delegate to the adapted method
        return this.legacyProcessor.processPayment(amount, accountId);
    }

    validateAccount(accountId: string): boolean {
        // Don't update lastOperation here - we want to keep the processPayment message
        const tempOperation = `Adapter: Validating account using legacy system`;
        logger.info(tempOperation);
        return this.legacyProcessor.validateAccount(accountId);
    }
}

// Adapter for the modern payment processor
export class ModernPaymentProcessorAdapter implements PaymentProcessor {
    private modernProcessor: ModernPaymentProcessor;
    private lastOperation: string | null = null;

    constructor(modernProcessor: ModernPaymentProcessor) {
        this.modernProcessor = modernProcessor;
        this.lastOperation = 'Created adapter for Modern Payment Processor';
        logger.success(this.lastOperation);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    async processPayment(amount: number, accountId: string): Promise<boolean> {
        this.lastOperation = `Adapter: Processing payment using modern system`;
        logger.info(this.lastOperation);

        // First validate the account
        if (!this.validateAccount(accountId)) {
            return false;
        }

        // Adapt the call to the modern processor interface
        const result = this.modernProcessor.makePayment({
            sum: amount,
            target: accountId,
        });

        return result.success;
    }

    validateAccount(accountId: string): boolean {
        // Don't update lastOperation here - we want to keep the processPayment message
        const tempOperation = `Adapter: Validating account using modern system`;
        logger.info(tempOperation);
        // Adapt validation call to use the modern verification method
        const verification = this.modernProcessor.verifyDestination(accountId);
        return verification.valid;
    }
}

// Adapter for the new payment processor
export class NewPaymentProcessorAdapter implements PaymentProcessor {
    private newProcessor: NewPaymentProcessor;
    private lastOperation: string | null = null;

    constructor(newProcessor: NewPaymentProcessor) {
        this.newProcessor = newProcessor;
        this.lastOperation = 'Created adapter for New Payment Processor';
        logger.success(this.lastOperation);
    }

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    async processPayment(amount: number, accountId: string): Promise<boolean> {
        this.lastOperation = `Adapter: Processing payment using new system`;
        logger.info(this.lastOperation);

        // First validate the account
        if (!this.validateAccount(accountId)) {
            return false;
        }

        // Adapt the call to the new processor interface
        const result = await this.newProcessor.executeTransaction({
            amount: amount.toString(),
            recipient: accountId,
            currency: 'USD',
        });

        return result.status === 'completed';
    }

    validateAccount(accountId: string): boolean {
        // Don't update lastOperation here - we want to keep the processPayment message
        const tempOperation = `Adapter: Validating account using basic rules for new system`;
        logger.info(tempOperation);
        // New processor doesn't have a validation method, so implement a basic check
        return accountId.length > 5;
    }
}

// Client code that works with the unified interface
export class PaymentService {
    private lastOperation: string | null = null;

    getLastOperation(): string | null {
        return this.lastOperation;
    }

    // Client only knows about the PaymentProcessor interface, not the specific implementations
    async processPayment(
        processor: PaymentProcessor,
        amount: number,
        accountId: string,
    ): Promise<boolean> {
        this.lastOperation = `Payment service: Processing $${amount} payment to ${accountId}`;
        logger.info(this.lastOperation);

        // No conditional logic or type checking needed
        return await processor.processPayment(amount, accountId);
    }

    // Additional methods also only work with the common interface
    validateAccount(processor: PaymentProcessor, accountId: string): boolean {
        this.lastOperation = `Payment service: Validating account ${accountId}`;
        logger.info(this.lastOperation);
        return processor.validateAccount(accountId);
    }
}

// Factory method to create the appropriate adapter based on available processor
export function createPaymentProcessor(processor: unknown): PaymentProcessor {
    if (processor instanceof LegacyPaymentProcessor) {
        return new LegacyPaymentProcessorAdapter(processor);
    } else if (processor instanceof ModernPaymentProcessor) {
        return new ModernPaymentProcessorAdapter(processor);
    } else if (processor instanceof NewPaymentProcessor) {
        return new NewPaymentProcessorAdapter(processor);
    } else {
        throw new Error('Unsupported payment processor type');
    }
}
