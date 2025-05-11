# Adapter Pattern

## Overview

The Adapter pattern allows objects with incompatible interfaces to collaborate. It acts as a bridge between two incompatible interfaces by wrapping an instance of one class into an adapter class with an interface expected by the clients.

## Problem

Sometimes you have existing classes that you can't change, but their interfaces don't match what your client code requires. For example:

- Using a third-party library with an incompatible interface
- Integrating legacy code with a new system
- Making classes with different interfaces work together
- Connecting to external services or APIs that have different data formats

## Diagram

```
┌───────────────────┐           ┌───────────────────┐
│      Client       │           │  Target Interface │
│                   │ ◄─────────┤                   │
└───────────────────┘           │ + request()       │
         │                      └───────────────────┘
         │                                ▲
         │                                │
         │                                │ implements
         │                      ┌──────────────────┐           ┌────────────────────┐
         │                      │     Adapter      │           │    Adaptee         │
         └────────────────────► │                  │ ─────────►│ (incompatible      │
                                │ + request()      │           │  interface)        │
                                └──────────────────┘           │                    │
                                         │                     │ + specificRequest()│
                                         └────────────────────►│                    │
                                                               └────────────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach often involves modifying client code to work directly with multiple incompatible interfaces or creating tight coupling between components.

#### Pseudo Code (Anti-Pattern)

```typescript
// Legacy third-party payment processor
class LegacyPaymentProcessor {
    processPayment(amount: number, account: string): boolean {
        console.log(`Processing $${amount} payment to account ${account} via legacy system`);
        // Legacy payment processing logic
        return true;
    }
}

// Modern payment processor
class ModernPaymentProcessor {
    makePayment(paymentData: { sum: number; target: string }): { success: boolean } {
        console.log(`Making payment of $${paymentData.sum} to ${paymentData.target}`);
        // Modern payment processing logic
        return { success: true };
    }
}

// Client code
class PaymentService {
    processPayment(processor: any, amount: number, accountId: string): boolean {
        // Problem: Client code needs to know which type of processor it's working with
        if (processor instanceof LegacyPaymentProcessor) {
            return processor.processPayment(amount, accountId);
        } else if (processor instanceof ModernPaymentProcessor) {
            const result = processor.makePayment({ sum: amount, target: accountId });
            return result.success;
        } else {
            throw new Error("Unsupported payment processor");
        }
    }
}
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Client code needs detailed knowledge of each processor type
2. **Violation of Open/Closed Principle**: Adding new processors requires modifying client code
3. **Hard to maintain**: Conditional logic grows with each new processor type
4. **Testing complexity**: Client code has multiple execution paths based on processor type
5. **Fragile code**: Changes to any processor interface affect client code

### Proper Pattern Implementation

The proper implementation uses an adapter to convert the interface of one class into an interface expected by the clients.

#### Pseudo Code (Proper Pattern)

```typescript
// Target interface that client expects
interface PaymentProcessor {
    pay(amount: number, accountId: string): boolean;
}

// Legacy third-party payment processor
class LegacyPaymentProcessor {
    processPayment(amount: number, account: string): boolean {
        console.log(`Processing $${amount} payment to account ${account} via legacy system`);
        // Legacy payment processing logic
        return true;
    }
}

// Modern payment processor
class ModernPaymentProcessor {
    makePayment(paymentData: { sum: number; target: string }): { success: boolean } {
        console.log(`Making payment of $${paymentData.sum} to ${paymentData.target}`);
        // Modern payment processing logic
        return { success: true };
    }
}

// Adapter for legacy payment processor
class LegacyPaymentProcessorAdapter implements PaymentProcessor {
    private legacyProcessor: LegacyPaymentProcessor;
    
    constructor(legacyProcessor: LegacyPaymentProcessor) {
        this.legacyProcessor = legacyProcessor;
    }
    
    pay(amount: number, accountId: string): boolean {
        // Adapt the call to the legacy processor interface
        return this.legacyProcessor.processPayment(amount, accountId);
    }
}

// Adapter for modern payment processor
class ModernPaymentProcessorAdapter implements PaymentProcessor {
    private modernProcessor: ModernPaymentProcessor;
    
    constructor(modernProcessor: ModernPaymentProcessor) {
        this.modernProcessor = modernProcessor;
    }
    
    pay(amount: number, accountId: string): boolean {
        // Adapt the call to the modern processor interface
        const result = this.modernProcessor.makePayment({ 
            sum: amount, 
            target: accountId 
        });
        return result.success;
    }
}

// Client code
class PaymentService {
    processPayment(processor: PaymentProcessor, amount: number, accountId: string): boolean {
        // Client works with a single, unified interface
        return processor.pay(amount, accountId);
    }
}
```

#### Benefits of Proper Implementation:

1. **Decoupling**: Client code works with a single interface, unaware of adaptee details
2. **Adheres to Open/Closed Principle**: New processors can be added without changing client code
3. **Separation of concerns**: Adaptation logic is isolated in adapter classes
4. **Easier testing**: Client code can be tested with mock adapters
5. **Reusability**: Adapters can be reused throughout the application

## Visual Comparison

```
┌───────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                                │
└───────────────────────────────────────────────────────────────────┘
┌───────────┐          ┌───────────┐          ┌───────────┐
│           │          │           │          │           │
│  Client   │─────────►│  if/else  │─────────►│ Processor │
│           │          │  checks   │          │   Type A  │
└───────────┘          │           │          │           │
                       │           │          └───────────┘
                       │           │
                       │           │          ┌───────────┐
                       │           │          │           │
                       │           │─────────►│ Processor │
                       │           │          │   Type B  │
                       └───────────┘          │           │
                                              └───────────┘

┌───────────────────────────────────────────────────────────────────┐
│                       PROPER PATTERN                              │
└───────────────────────────────────────────────────────────────────┘
                       ┌──────────────────┐
                       │                  │
                       │ «interface»      │
                       │ PaymentProcessor │
                       │                  │
                       └───────┬──────────┘
                               ▲
                               │
           ┌─────────────────┬─┴─────────────────┐
           │                 │                   │
┌──────────┴─────────┐ ┌─────┴───────────┐ ┌─────┴───────────┐
│                    │ │                 │ │                 │
│ LegacyProcessor    │ │ ModernProcessor │ │ FutureProcessor │
│     Adapter        │ │    Adapter      │ │    Adapter      │
│                    │ │                 │ │                 │
└──────────┬─────────┘ └────────┬────────┘ └─────┬───────────┘
           │                    │                │
┌──────────┴─────────┐ ┌────────┴────────┐ ┌─────┴───────────┐
│                    │ │                 │ │                 │
│ LegacyProcessor    │ │ ModernProcessor │ │ FutureProcessor │
│  (Adaptee)         │ │  (Adaptee)      │ │  (Adaptee)      │
│                    │ │                 │ │                 │
└────────────────────┘ └─────────────────┘ └─────────────────┘

```

## Best Practices

1. Create a consistent target interface that meets client needs
2. Use composition over inheritance for more flexibility
3. Make adapters focused on interface translation without adding business logic
4. Consider using the Adapter pattern when integrating third-party libraries
5. Document adapter behavior for future maintenance

## When to Use

- When you need to use an existing class with an incompatible interface
- When you want to reuse existing classes with incompatible interfaces
- When you need to integrate components that weren't designed to work together
- When you're building a framework that should work with various types of components
- When you need to integrate with legacy systems or third-party libraries

## When to Avoid

- When adding a new adapter would significantly increase complexity
- When direct refactoring of incompatible classes is feasible
- When the adaptation process would lose critical functionality or performance
- When a simpler solution like modifying the client code is more practical
- When it creates unnecessary indirection for simple interfaces

## Further Considerations

- **Class vs Object Adapter**: Choose between inheritance (class) and composition (object) approaches
- **Two-Way Adapters**: Consider implementing bidirectional adapters when needed
- **Default Implementation**: Provide sensible defaults for adapter functionality if appropriate
- **Performance Overhead**: Be aware of potential overhead from the extra method calls
- **Caching**: Consider caching results if the adapter performs expensive operations