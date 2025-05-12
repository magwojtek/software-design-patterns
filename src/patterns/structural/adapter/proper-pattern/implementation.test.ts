import {
    LegacyPaymentProcessor,
    LegacyPaymentProcessorAdapter,
    ModernPaymentProcessor,
    ModernPaymentProcessorAdapter,
    NewPaymentProcessor,
    NewPaymentProcessorAdapter,
    PaymentProcessor,
    PaymentService,
    createPaymentProcessor,
} from './implementation';

describe('Adapter Pattern - Proper Implementation', () => {
    let paymentService: PaymentService;
    let legacyProcessor: LegacyPaymentProcessor;
    let modernProcessor: ModernPaymentProcessor;
    let newProcessor: NewPaymentProcessor;
    let legacyAdapter: PaymentProcessor;
    let modernAdapter: PaymentProcessor;
    let newAdapter: PaymentProcessor;

    beforeEach(() => {
        paymentService = new PaymentService();
        // Create original processors
        legacyProcessor = new LegacyPaymentProcessor();
        modernProcessor = new ModernPaymentProcessor();
        newProcessor = new NewPaymentProcessor();

        // Create adapters
        legacyAdapter = new LegacyPaymentProcessorAdapter(legacyProcessor);
        modernAdapter = new ModernPaymentProcessorAdapter(modernProcessor);
        newAdapter = new NewPaymentProcessorAdapter(newProcessor);
    });

    describe('Individual adapters', () => {
        it('should adapt legacy processor to unified interface', async () => {
            const result = await legacyAdapter.processPayment(100, 'account123');
            expect(result).toBe(true);

            // Check that operations were tracked correctly
            expect((legacyAdapter as LegacyPaymentProcessorAdapter).getLastOperation()).toContain(
                'Processing payment using legacy system',
            );
            expect(legacyProcessor.getLastOperation()).toContain(
                'Processing $100 payment to account account123',
            );
        });

        it('should adapt modern processor to unified interface', async () => {
            const result = await modernAdapter.processPayment(200, 'account456');
            expect(result).toBe(true);

            // Check that operations were tracked correctly
            expect((modernAdapter as ModernPaymentProcessorAdapter).getLastOperation()).toContain(
                'Processing payment using modern system',
            );
            expect(modernProcessor.getLastOperation()).toContain(
                'Making payment of $200 to account456',
            );
        });

        it('should adapt new processor to unified interface', async () => {
            const result = await newAdapter.processPayment(300, 'account789');
            expect(result).toBe(true);

            // Check that operations were tracked correctly
            expect((newAdapter as NewPaymentProcessorAdapter).getLastOperation()).toContain(
                'Processing payment using new system',
            );
            expect(newProcessor.getLastOperation()).toContain(
                'Executing USD 300 transaction to account789',
            );
        });

        it('should validate accounts through legacy adapter', () => {
            expect(legacyAdapter.validateAccount('account123')).toBe(true);
            expect(legacyAdapter.validateAccount('acc')).toBe(false);
        });

        it('should validate accounts through modern adapter', () => {
            expect(modernAdapter.validateAccount('account456')).toBe(true);
            expect(modernAdapter.validateAccount('acc')).toBe(false);
        });

        it('should validate accounts through new adapter', () => {
            expect(newAdapter.validateAccount('account789')).toBe(true);
            expect(newAdapter.validateAccount('acc')).toBe(false);
        });
    });

    describe('PaymentService with adapters', () => {
        it('should process payment with legacy adapter', async () => {
            const result = await paymentService.processPayment(legacyAdapter, 100, 'account123');
            expect(result).toBe(true);
        });

        it('should process payment with modern adapter', async () => {
            const result = await paymentService.processPayment(modernAdapter, 200, 'account456');
            expect(result).toBe(true);
        });

        it('should process payment with new adapter', async () => {
            const result = await paymentService.processPayment(newAdapter, 300, 'account789');
            expect(result).toBe(true);
        });

        it('should fail for invalid account with legacy adapter', async () => {
            // Mock validateAccount to return false
            jest.spyOn(legacyAdapter, 'validateAccount').mockReturnValueOnce(false);
            const result = await legacyAdapter.processPayment(100, 'acc');
            expect(result).toBe(false);
        });

        it('should fail for invalid account with modern adapter', async () => {
            // Mock validateAccount to return false
            jest.spyOn(modernAdapter, 'validateAccount').mockReturnValueOnce(false);
            const result = await modernAdapter.processPayment(200, 'acc');
            expect(result).toBe(false);
        });
    });

    describe('Factory method for creating adapters', () => {
        it('should create legacy adapter from legacy processor', () => {
            const adapter = createPaymentProcessor(legacyProcessor);
            expect(adapter).toBeInstanceOf(LegacyPaymentProcessorAdapter);
        });

        it('should create modern adapter from modern processor', () => {
            const adapter = createPaymentProcessor(modernProcessor);
            expect(adapter).toBeInstanceOf(ModernPaymentProcessorAdapter);
        });

        it('should create new adapter from new processor', () => {
            const adapter = createPaymentProcessor(newProcessor);
            expect(adapter).toBeInstanceOf(NewPaymentProcessorAdapter);
        });

        it('should throw error for unsupported processor type', () => {
            expect(() => createPaymentProcessor({})).toThrow('Unsupported payment processor type');
        });
    });

    describe('Polymorphic behavior', () => {
        let processors: PaymentProcessor[];

        beforeEach(() => {
            processors = [legacyAdapter, modernAdapter, newAdapter];
        });

        it('should work with multiple adapters in a collection', async () => {
            // We can iterate through different adapters and call the same method
            for (const processor of processors) {
                const result = await paymentService.processPayment(processor, 100, 'account123');
                expect(result).toBe(true);
            }
        });

        it('should handle account validation for multiple adapters', () => {
            // All adapters implement the same validation interface
            for (const processor of processors) {
                expect(processor.validateAccount('account123')).toBe(true);
                expect(processor.validateAccount('acc')).toBe(false);
            }
        });
    });
});
