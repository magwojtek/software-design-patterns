# Strategy Pattern

## Overview

The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it. This pattern enables selecting an algorithm's implementation at runtime rather than implementing a single algorithm directly.

## Problem

In many applications, we need to perform the same operation in different ways based on a context:

- Navigation systems need to calculate routes differently (car, public transport, walking)
- Payment processors need to handle different payment methods
- Compression algorithms need to adapt to different file types
- Sorting algorithms need to optimize for different data characteristics

The naive approach is to use conditional statements to select the appropriate algorithm, but this leads to:
- Bloated classes with multiple responsibilities
- Difficult maintenance as algorithms grow in complexity
- Code duplication when algorithms are needed in multiple contexts
- Violating the Open/Closed principle when adding new algorithms

## Diagram

```
┌───────────┐           ┌──────────────┐
│           │           │   Strategy   │
│  Context  │◄─────────►│  Interface   │
│           │           └──────┬───────┘
└───────────┘                  │
                               │
                               │ implemented by
                               │
                       ┌───────┼────────┐
                       │       │        │
                  ┌────▼──┐ ┌──▼───┐ ┌──▼───┐
                  │ StrA  │ │ StrB │ │ StrC │
                  └───────┘ └──────┘ └──────┘
```

## Scenario

Imagine you are developing a navigation application that needs to provide routing directions between locations using different transportation methods (car, public transport, walking).

**The problem:**
1. Different transportation modes require completely different routing algorithms
2. Users need to switch between navigation modes instantly at runtime
3. The app needs to display different route visualizations and ETA calculations based on the mode
4. New transportation options (like bicycles or scooters) need to be added regularly
5. The same routing strategies might be needed in other parts of the application, like trip planning or cost estimation

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach uses conditional statements to select different behaviors and mixes algorithm implementations directly into the client class.

#### Pseudo Code (Anti-Pattern)

```typescript
enum NavigationMode {
    CAR = 'car',
    PUBLIC_TRANSPORT = 'public_transport',
    WALKING = 'walking',
}

class NavigationApp {
    private currentMode: NavigationMode = NavigationMode.CAR;

    public setNavigationMode(mode: NavigationMode): void {
        this.currentMode = mode;
    }

    public calculateRoute(startPoint: string, endPoint: string): string {
        // Complex conditional logic to handle different routing strategies
        if (this.currentMode === NavigationMode.CAR) {
            return this.calculateCarRoute(startPoint, endPoint);
        } else if (this.currentMode === NavigationMode.PUBLIC_TRANSPORT) {
            return this.calculatePublicTransportRoute(startPoint, endPoint);
        } else if (this.currentMode === NavigationMode.WALKING) {
            return this.calculateWalkingRoute(startPoint, endPoint);
        }
        
        throw new Error(`Unsupported navigation mode: ${this.currentMode}`);
    }

    public displayETA(startPoint: string, endPoint: string): void {
        // More conditional logic duplicated here
        const route = this.calculateRoute(startPoint, endPoint);
        
        if (this.currentMode === NavigationMode.CAR) {
            const eta = this.estimateCarTravelTime(route);
            console.log(`Car ETA: ${eta} minutes`);
        } else if (this.currentMode === NavigationMode.PUBLIC_TRANSPORT) {
            const eta = this.estimatePublicTransportTime(route);
            console.log(`Public Transport ETA: ${eta} minutes`);
        } else if (this.currentMode === NavigationMode.WALKING) {
            const eta = this.estimateWalkingTime(route);
            console.log(`Walking ETA: ${eta} minutes`);
        }
    }

    // Car-specific routing logic
    private calculateCarRoute(startPoint: string, endPoint: string): string {
        // Simulate complex car routing algorithm
        return `Car route: ${startPoint} → Highway → ${endPoint}`;
    }

    // Public transport-specific routing logic
    private calculatePublicTransportRoute(startPoint: string, endPoint: string): string {
        // Simulate complex public transport routing algorithm
        return `Public transport route: ${startPoint} → Bus → Metro → ${endPoint}`;
    }

    // Walking-specific routing logic
    private calculateWalkingRoute(startPoint: string, endPoint: string): string {
        // Simulate complex walking routing algorithm
        return `Walking route: ${startPoint} → Park → ${endPoint}`;
    }

    // More duplicated conditional code for travel time estimation
    private estimateCarTravelTime(route: string): number { return 30; }
    private estimatePublicTransportTime(route: string): number { return 45; }
    private estimateWalkingTime(route: string): number { return 90; }
}

// Usage
const nav = new NavigationApp();
nav.calculateRoute("Home", "Office"); // Car route by default
nav.setNavigationMode(NavigationMode.PUBLIC_TRANSPORT);
nav.calculateRoute("Home", "Office"); // Public transport route
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Navigation app is directly coupled to all routing algorithms
2. **Conditional logic**: Extensive use of conditional statements to select behavior
3. **Open/Closed Principle violation**: Adding a new routing mode requires modifying the NavigationApp class
4. **Single Responsibility Principle violation**: NavigationApp handles both algorithm selection and implementation
5. **Code duplication**: Similar conditional structures repeated in multiple methods

### Proper Pattern Implementation

The proper implementation separates the algorithms into individual strategies and uses composition to make them interchangeable.

#### Pseudo Code (Proper Pattern)

```typescript
// Strategy interface
interface RoutingStrategy {
    calculateRoute(startPoint: string, endPoint: string): string;
    estimateTravelTime(route: string): number;
}

// Concrete strategy implementations
class CarRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        // Car-specific algorithm
        return `Car route: ${startPoint} → Highway → ${endPoint}`;
    }
    
    public estimateTravelTime(route: string): number {
        // Car-specific estimation
        return 30; // minutes
    }
}

class PublicTransportRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        // Public transport-specific algorithm
        return `Public transport route: ${startPoint} → Bus → Metro → ${endPoint}`;
    }
    
    public estimateTravelTime(route: string): number {
        // Public transport-specific estimation
        return 45; // minutes
    }
}

class WalkingRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        // Walking-specific algorithm
        return `Walking route: ${startPoint} → Park → ${endPoint}`;
    }
    
    public estimateTravelTime(route: string): number {
        // Walking-specific estimation
        return 90; // minutes
    }
}

// Context class that uses the strategy
class NavigationApp {
    private routingStrategy: RoutingStrategy;
    
    constructor(strategy: RoutingStrategy = new CarRoutingStrategy()) {
        this.routingStrategy = strategy;
    }
    
    public setRoutingStrategy(strategy: RoutingStrategy): void {
        this.routingStrategy = strategy;
    }
    
    public calculateRoute(startPoint: string, endPoint: string): string {
        // Delegate to the current strategy
        return this.routingStrategy.calculateRoute(startPoint, endPoint);
    }
    
    public displayETA(startPoint: string, endPoint: string): void {
        const route = this.calculateRoute(startPoint, endPoint);
        const eta = this.routingStrategy.estimateTravelTime(route);
        
        console.log(`ETA: ${eta} minutes`);
    }
}

// Usage
const nav = new NavigationApp(); // Default car strategy
nav.calculateRoute("Home", "Office");

// Switch strategies at runtime
nav.setRoutingStrategy(new PublicTransportRoutingStrategy());
nav.calculateRoute("Home", "Office");

nav.setRoutingStrategy(new WalkingRoutingStrategy());
nav.calculateRoute("Home", "Office");

// Can easily add new routing strategy without changing NavigationApp
class BicycleRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        return `Bicycle route: ${startPoint} → Bike Path → ${endPoint}`;
    }
    
    public estimateTravelTime(route: string): number {
        return 60; // minutes
    }
}

// Use new strategy without modifying NavigationApp
nav.setRoutingStrategy(new BicycleRoutingStrategy());
nav.calculateRoute("Home", "Office");
```

#### Benefits of Proper Implementation:

1. **Loose coupling**: Context only depends on the strategy interface, not concrete implementations
2. **Open/Closed Principle**: New strategies can be added without modifying existing code
3. **Single Responsibility Principle**: Each class has a single responsibility
4. **Algorithm encapsulation**: Each strategy encapsulates its own algorithm
5. **Runtime flexibility**: Strategies can be switched dynamically at runtime

## Visual Comparison

```
┌──────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                           │
└──────────────────────────────────────────────────────────────┘
                     ┌───────────────┐
                     │ NavigationApp │
                     ├───────────────┤
                     │ calculateRoute│
                     │ displayETA    │
                     │               │
                     │  if (car)     │
                     │  {...}        │
                     │  else if      │
                     │  (public)     │
                     │  {...}        │
                     │  else if      │
                     │  (walking)    │
                     │  {...}        │
                     └───────────────┘
            Conditional logic within a single class

┌──────────────────────────────────────────────────────────────┐
│                       PROPER PATTERN                         │
└──────────────────────────────────────────────────────────────┘
┌────────────┐          ┌─────────────────┐
│ Navigation │          │  «interface»    │
│ App        │─────────►│ RoutingStrategy │
│            │          └───────┬─────────┘
│ -strategy  │                  │
└────────────┘                  │
                                │
                    ┌───────────┼────────────┐
                    │           │            │
           ┌────────▼─┐  ┌──────▼───────┐ ┌───▼────────┐
           │  Car     │  │ PublicTrans. │ │ Walking    │
           │ Strategy │  │ Strategy     │ │ Strategy   │
           └──────────┘  └─────────────-┘ └────────────┘
               Delegation to interchangeable strategy objects
```

## Best Practices

1. Use the Strategy pattern when you have multiple algorithms that can be used interchangeably
2. Define a clear interface for all strategies to implement
3. Consider using a default strategy to provide sensible behavior by default
4. Make strategies stateless when possible to allow sharing strategy instances
5. Use factory methods or dependency injection to provide the appropriate strategy to a context
6. Consider dynamic strategy selection based on input parameters or system state

## When to Use

- When you need different variants of an algorithm
- When you want to avoid exposing complex algorithm-specific data structures
- When an algorithm uses data that clients shouldn't know about
- When a class has multiple behaviors that appear as conditional statements
- When you need to select algorithms at runtime

## When to Avoid

- When the variation in behavior is minimal or unlikely to change
- When the overhead of creating multiple strategy classes isn't justified
- When all algorithms operate on private data of the context
- When the application is simple enough that conditional statements are clearer

## Variations

### Strategy Factory

A factory that creates appropriate strategy instances based on context:

```typescript
class RoutingStrategyFactory {
    public static createStrategy(type: string, preferences?: any): RoutingStrategy {
        switch (type.toLowerCase()) {
            case 'car':
                return new CarRoutingStrategy(preferences);
            case 'public_transport':
                return new PublicTransportRoutingStrategy(preferences);
            case 'walking':
                return new WalkingRoutingStrategy(preferences);
            default:
                throw new Error(`Unknown strategy type: ${type}`);
        }
    }
}

// Usage
const nav = new NavigationApp(RoutingStrategyFactory.createStrategy('car'));
```

### Parameterized Strategy

Strategies that can be configured with parameters:

```typescript
interface SortingStrategy<T> {
    sort(data: T[]): T[];
}

class QuickSort<T> implements SortingStrategy<T> {
    private compareFunction: (a: T, b: T) => number;
    
    constructor(compareFunction: (a: T, b: T) => number = (a, b) => String(a).localeCompare(String(b))) {
        this.compareFunction = compareFunction;
    }
    
    sort(data: T[]): T[] {
        // Implementation using this.compareFunction
    }
}

// Usage with custom comparison
const numericSorter = new QuickSort<number>((a, b) => a - b);
```

## Real-World Examples

- Sorting algorithms in libraries (mergesort, quicksort, etc.)
- Payment processing strategies (credit card, PayPal, cryptocurrency)
- Compression algorithms (zip, gzip, bzip2)
- Authentication strategies (OAuth, JWT, Basic Auth)
- Route-finding algorithms in navigation systems

## Open-Source Examples

Here are some examples of the Strategy pattern in popular open-source TypeScript projects:

- **NestJS**: Uses the Strategy pattern for authentication strategies.
  - [NestJS Passport Strategies](https://github.com/nestjs/passport/tree/master/lib)
  - Different authentication strategies (JWT, OAuth, Local) implement a common interface and can be used interchangeably

- **TypeORM**: Implements various database drivers as strategies.
  - [TypeORM Database Naming Strategy](https://github.com/typeorm/typeorm/tree/master/src/naming-strategy)

## Further Considerations

- **Strategy combination**: Consider allowing strategies to be combined or chained
- **Performance impact**: Be aware of potential overhead from the abstraction layer
- **Strategy sharing**: Use the Flyweight pattern if strategies are heavy but stateless
- **Configuration**: Provide ways to configure strategies without creating new instances
- **Default behavior**: Implement a reasonable default strategy selection mechanism