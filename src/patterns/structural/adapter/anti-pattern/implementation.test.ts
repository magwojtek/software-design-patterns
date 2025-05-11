import {
    LegacyPaymentProcessor,
    ModernPaymentProcessor,
    NewPaymentProcessor,
    PaymentService,
} from './implementation';

describe('Adapter Pattern - Anti-Pattern', () => {
    let paymentService: PaymentService;
    let legacyProcessor: LegacyPaymentProcessor;
    let modernProcessor: ModernPaymentProcessor;
    let newProcessor: NewPaymentProcessor;

    beforeEach(() => {
        paymentService = new PaymentService();
        legacyProcessor = new LegacyPaymentProcessor();
        modernProcessor = new ModernPaymentProcessor();
        newProcessor = new NewPaymentProcessor();
    });

    describe('PaymentService with different processor types', () => {
        it('should process payment with legacy processor', async () => {
            const result = await paymentService.processPayment(legacyProcessor, 100, 'account123');
            expect(result).toBe(true);
        });

        it('should process payment with modern processor', async () => {
            const result = await paymentService.processPayment(modernProcessor, 200, 'account456');
            expect(result).toBe(true);
        });

        it('should process payment with new processor', async () => {
            const result = await paymentService.processPayment(newProcessor, 300, 'account789');
            expect(result).toBe(true);
        });

        it('should fail for invalid account with legacy processor', async () => {
            const result = await paymentService.processPayment(legacyProcessor, 100, 'acc');
            expect(result).toBe(false);
        });

        it('should fail for invalid account with modern processor', async () => {
            const result = await paymentService.processPayment(modernProcessor, 200, 'acc');
            expect(result).toBe(false);
        });

        it('should throw error for unsupported processor type', async () => {
            await expect(paymentService.processPayment({}, 100, 'account123')).rejects.toThrow(
                'Unsupported payment processor type',
            );
        });
    });

    describe('Account validation with different processor types', () => {
        it('should validate account with legacy processor', () => {
            const result = paymentService.validateAccount(legacyProcessor, 'account123');
            expect(result).toBe(true);
        });

        it('should validate account with modern processor', () => {
            const result = paymentService.validateAccount(modernProcessor, 'account456');
            expect(result).toBe(true);
        });

        it('should validate account with new processor', () => {
            const result = paymentService.validateAccount(newProcessor, 'account789');
            expect(result).toBe(true);
        });

        it('should fail validation for invalid account with legacy processor', () => {
            const result = paymentService.validateAccount(legacyProcessor, 'acc');
            expect(result).toBe(false);
        });

        it('should fail validation for invalid account with modern processor', () => {
            const result = paymentService.validateAccount(modernProcessor, 'acc');
            expect(result).toBe(false);
        });

        it('should throw error for unsupported processor type', () => {
            expect(() => paymentService.validateAccount({}, 'account123')).toThrow(
                'Unsupported payment processor type',
            );
        });
    });
});
