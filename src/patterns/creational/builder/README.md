# Builder Pattern

## Overview

The Builder pattern is a creational design pattern that lets you construct complex objects step by step. It allows you to produce different types and representations of an object using the same construction code. The pattern separates the construction of a complex object from its representation.

## Problem

Imagine you need to create a complex object that requires multiple steps or has a large number of possible configurations:

- Object construction involves many parameters, some optional
- Creation steps need to be performed in a specific order
- Different representations of the object should be created using the same process
- Client code should be isolated from the details of object construction

## Diagram

```
┌─────────────┐          ┌───────────────┐          ┌─────────────┐
│             │ directs  │               │ builds   │             │
│  Director   │─────────►│    Builder    │─────────►│   Product   │
│             │          │   Interface   │          │             │
└─────────────┘          └───────┬───────┘          └─────────────┘
                                 │
                                 │ implemented by
                                 ▼
                         ┌───────────────┐
                         │    Concrete   │
                         │    Builder    │
                         └───────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing a builder typically involves using constructors with many parameters or creating multiple static factory methods.

#### Pseudo Code (Anti-Pattern)

```typescript
class Computer {
    constructor(
        cpu: string,
        ram: number,
        storage: number,
        gpu: string,
        hasWifi: boolean,
        hasBluetooth: boolean,
        monitor: string
    ) {
        // Initialize all properties
    }
}

// Client code has to provide all parameters at once
const computer = new Computer('Intel i7', 16, 512, 'NVIDIA', true, true, '24" Monitor');

// Or use helper functions that still don't allow flexible step-by-step construction
function createGamingPC() {
    return new Computer('AMD Ryzen', 32, 1000, 'RTX 3080', true, true, '27" 4K');
}
```

#### Issues with Anti-Pattern:

1. **Constructor telescoping**: As the number of parameters grows, the constructor becomes unwieldy
2. **Parameter ordering**: Easy to mix up parameters, especially when they are of the same type
3. **Default values handling**: Hard to handle optional parameters with sensible defaults
4. **No step-by-step creation**: All parameters must be provided at once
5. **Hard to extend**: Adding new parameters requires changing all creation code

### Proper Pattern Implementation

The proper implementation uses a dedicated builder class with methods for configuring the product step by step.

#### Pseudo Code (Proper Pattern)

```typescript
// Product
class Computer {
    // Properties and setters
}

// Builder interface
interface ComputerBuilder {
    reset(): void;
    setCpu(cpu: string): ComputerBuilder;
    setRam(ram: number): ComputerBuilder;
    setStorage(storage: number): ComputerBuilder;
    setGpu(gpu: string): ComputerBuilder;
    setWifi(hasWifi: boolean): ComputerBuilder;
    setBluetooth(hasBluetooth: boolean): ComputerBuilder;
    setMonitor(monitor: string): ComputerBuilder;
    build(): Computer;
}

// Concrete Builder
class StandardComputerBuilder implements ComputerBuilder {
    private computer: Computer;
    
    constructor() {
        this.reset();
    }
    
    reset(): void {
        this.computer = new Computer();
    }
    
    setCpu(cpu: string): ComputerBuilder {
        this.computer.setCpu(cpu);
        return this;
    }
    
    // Other setter methods...
    
    build(): Computer {
        const result = this.computer;
        this.reset();
        return result;
    }
}

// Director
class ComputerDirector {
    private builder: ComputerBuilder;
    
    constructor(builder: ComputerBuilder) {
        this.builder = builder;
    }
    
    makeGamingComputer(): Computer {
        return this.builder
            .setCpu('AMD Ryzen')
            .setRam(32)
            .setStorage(1000)
            .setGpu('RTX 3080')
            // ...other setters
            .build();
    }
    
    // Other methods for common configurations
}

// Usage
const builder = new StandardComputerBuilder();
const director = new ComputerDirector(builder);

// Using director for predefined configurations
const gamingPC = director.makeGamingComputer();

// Or using builder directly for custom configurations
const customPC = builder
    .setCpu('Intel i7')
    .setRam(16)
    .setStorage(512)
    // Only set what we need, skip the rest
    .build();
```

#### Benefits of Proper Implementation:

1. **Step-by-step construction**: Build objects incrementally
2. **Parameter order independence**: Methods have descriptive names
3. **Fluid interface**: Method chaining creates readable code
4. **Flexibility**: Can create different representations with the same builder
5. **Encapsulation**: Construction details are hidden from client code
6. **Reusable components**: Director can define common construction sequences

## Visual Comparison

```
┌───────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                          │
└───────────────────────────────────────────────────────────┘
    Client code directly constructs objects with many parameters
    
    ┌────────────────────────────────────────────────────────┐
    │ new Computer('CPU', 16, 512, 'GPU', true, true, '...') │
    └────────────────────────────────────────────────────────┘
    
    Or uses factory functions that still require knowledge of parameters
    
    ┌───────────────────────────────────────────────────────┐
    │ function createGamingPC() {                           │
    │   return new Computer('AMD', 32, 1000, ...);          │
    │ }                                                     │
    └───────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                        │
└───────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌─────────────┐         ┌─────────┐
    │  Client  │ uses    │  Director   │ uses    │ Builder │
    │   Code   │────────►│ (optional)  │────────►│Interface│
    └──────────┘         └─────────────┘         └────┬────┘
                                                      │
                                                      │
                                                      ▼
                                                ┌───────────┐
                                                │ Concrete  │
                                                │  Builder  │
                                                └─────┬─────┘
                                                      │
                                                      │creates
                                                      ▼
                                                ┌───────────┐
                                                │  Product  │
                                                └───────────┘
```

## Best Practices

1. Use the Builder pattern when construction of an object has multiple steps or configurations
2. Implement a fluent interface (method chaining) for a more readable client code
3. Consider making builder methods return `this` to enable method chaining
4. Use a director class when you have common configurations that are reused frequently
5. Reset the builder state after the `build()` method is called
6. Consider implementing the builder as an inner class of the product when appropriate
7. Use abstract builders when you need multiple implementations of the same construction process

## When to Use

- When an object needs to be created with many optional parameters or configurations
- When construction logic should be separate from the object's business logic
- When you want the same construction process to create different representations
- When you need to build complex composite objects (like trees or other recursive structures)
- When client code shouldn't know the details of how objects are constructed

## When to Avoid

- When you're dealing with simple objects with few parameters
- When flexibility in object creation is not required
- When performance is critical (builder adds a layer of abstraction)
- When all parameters are required and there are no optional settings

## Variations

### Fluent Builder

Uses method chaining to create a more readable API:

```typescript
const computer = new ComputerBuilder()
    .withCpu("Intel i7")
    .withRam(16)
    .withStorage(512)
    .build();
```

### Recursive Builder

Used for building complex hierarchical structures:

```typescript
const meal = new MealBuilder()
    .addBurger(burger => burger
        .addPatty("beef")
        .addCheese("cheddar")
        .addTopping("lettuce")
    )
    .addDrink(drink => drink
        .type("soda")
        .size("large")
    )
    .addSide("fries")
    .build();
```

### Builder with Required Parameters

Ensures that essential parameters are provided while still allowing optional ones:

```typescript
// Constructor requires essential parameters
const builder = new ComputerBuilder("Intel i7", 16);

// Optional parameters through methods
const computer = builder
    .withStorage(512)
    .withGpu("NVIDIA")
    .build();
```

## Real-World Examples

- StringBuilder in Java for constructing strings
- Query builders in ORMs for constructing database queries
- Document builders for constructing complex XML or HTML documents
- UI builders for constructing complex user interfaces
- Test data builders for creating test fixtures

## Further Considerations

- **Thread safety**: Ensure thread safety if the builder is used in a concurrent environment
- **Immutability**: Consider making products immutable once they are built
- **Performance**: Balance the flexibility of the builder pattern with performance considerations
- **Validation**: Add validation in the builder to ensure the product is in a valid state
- **Error handling**: Provide clear error messages when construction fails due to invalid or missing parameters