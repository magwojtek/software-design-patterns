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

## Scenario

Imagine you're building a payment processing system for an e-commerce platform that needs to work with multiple payment providers. Your company has been using a legacy payment gateway for years, but now wants to integrate with modern payment processors to offer customers more options.

**The problem:**
1. The legacy payment gateway has a completely different API from modern payment processors
2. You cannot modify the code of either the legacy system or the new payment processors
3. Your e-commerce platform needs a consistent way to process payments regardless of which provider is used
4. The system should be able to easily add new payment processors in the future
5. There should be minimal changes to the existing client code that processes payments

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

## Real-World Examples

### Legacy System Integration
Organizations often use adapters to integrate legacy systems with modern applications. For example, a modern web application might need to access data from a legacy mainframe system. An adapter translates API calls from the web application into a format the legacy system understands, and vice versa.

### Data Format Conversion
Media libraries and document processing systems use adapters to convert between different file formats. For instance, an image processing application might use adapters to handle various image formats (JPEG, PNG, TIFF) through a unified interface.

### SDK Wrappers
When working with multiple third-party SDKs that serve similar purposes (e.g., payment gateways, cloud storage providers), developers create adapter wrappers that present a consistent interface to the application while hiding the complexity of each SDK's specific implementation details.

### Cross-platform Development
Mobile application frameworks often employ adapters to handle platform-specific features. An adapter might provide a common interface for accessing device features (camera, notifications, storage) while implementing platform-specific code for iOS and Android.

### ORM (Object-Relational Mapping)
Database ORMs like Hibernate or Sequelize serve as adapters between object-oriented code and relational databases. They adapt relational data to object structures that are more natural to work with in programming languages.

## Open-Source Examples

Here are some examples of the Adapter pattern in popular open-source TypeScript projects:

- **TypeORM**: Uses adapters to support different database drivers through a consistent interface.
  - [TypeORM Database Driver](https://github.com/typeorm/typeorm/blob/master/src/driver/Driver.ts)
  - Example: Each database type (MySQL, PostgreSQL, etc.) has an adapter that implements the common Driver interface

- **Axios**: Adapts different environments (browser, Node.js) to provide a consistent HTTP client API.
  - [Axios Adapters](https://github.com/axios/axios/tree/master/lib/adapters)
  - The library uses adapters to handle HTTP requests consistently across platforms

- **NestJS**: Uses adapters for various transports and protocols in its microservices module.
  - [NestJS Transport Adapters](https://github.com/nestjs/nest/tree/master/integration/microservices/src)
  - Each transport (Redis, MQTT, gRPC) has an adapter implementing a common interface

## Further Considerations

- **Class vs Object Adapter**: Choose between inheritance (class) and composition (object) approaches
- **Two-Way Adapters**: Consider implementing bidirectional adapters when needed
- **Default Implementation**: Provide sensible defaults for adapter functionality if appropriate
- **Performance Overhead**: Be aware of potential overhead from the extra method calls
- **Caching**: Consider caching results if the adapter performs expensive operations