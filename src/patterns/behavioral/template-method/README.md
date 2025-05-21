# Template Method Pattern

## Overview

The Template Method pattern is a behavioral design pattern that defines the skeleton of an algorithm in a method, deferring some steps to subclasses. It lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

## Problem

In many scenarios, we need to implement algorithms that have similar steps but differ in specific details:

- Multiple classes implement the same algorithm with slight variations
- Code duplication occurs across similar algorithm implementations
- Changes to the algorithm structure require modifying multiple classes
- We want to enforce a specific algorithm structure while allowing customization

## Diagram

```
┌─────────────────────────────┐
│      AbstractClass          │
├─────────────────────────────┤
│ + templateMethod() {        │
│   step1();                  │
│   step2();  // abstract     │
│   step3();                  │
│   hook();   // optional     │
│ }                           │
├─────────────────────────────┤
│ # step1() { ... }           │
│ # step3() { ... }           │
│ # hook() { }  // default    │
│ # abstract step2();         │
└──────────────┬──────────────┘
               │
               │ extends
               │
               ▼
┌──────────────────────┐     ┌──────────────────────┐
│   ConcreteClassA     │     │   ConcreteClassB     │
├──────────────────────┤     ├──────────────────────┤
│ # step2() { ... }    │     │ # step2() { ... }    │
│ # hook() { ... }     │     │                      │
└──────────────────────┘     └──────────────────────┘
```

## Scenario

Imagine you're building a beverage preparation system for a coffee shop that needs to make different types of drinks following similar but slightly different processes.

**The problem:**
1. Each beverage (coffee, tea, espresso, hot chocolate) follows a similar preparation process
2. Some steps are common to all beverages (boiling water, pouring into cup)
3. Some steps vary between beverages (brewing method, condiments)
4. We want to ensure all beverages follow the same general preparation process
5. We need to be able to add new beverage types without duplicating code

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing a template method typically involves separate classes with duplicated code and no standardized algorithm structure.

#### Pseudo Code (Anti-Pattern)

```typescript
// Each beverage maker class implements its own preparation algorithm from scratch
// with significant code duplication and no shared structure
export class BasicCoffeeMaker {
    public outputs: string[] = [];
    public makeCoffee(): void {
        this.outputs = [];
        this.outputs.push('Starting to make basic coffee...');

        // Boil water
        this.outputs.push('Boiling water');

        // Brew coffee grounds
        this.outputs.push('Brewing coffee grounds in boiling water');

        // Pour in cup
        this.outputs.push('Pouring coffee into cup');

        // Add sugar and milk
        this.outputs.push('Adding sugar and milk');

        this.outputs.push('Basic coffee ready!');
    }
}

export class EspressoMaker {
    public outputs: string[] = [];
    public makeEspresso(): void {
        this.outputs = [];
        this.outputs.push('Starting to make espresso...');

        // Boil water
        this.outputs.push('Boiling water');

        // Grind beans finely
        this.outputs.push('Grinding coffee beans very finely');

        // Brew coffee grounds under pressure
        this.outputs.push('Brewing coffee grounds under high pressure');

        // Pour in small cup
        this.outputs.push('Pouring espresso into small cup');

        this.outputs.push('Espresso ready!');
    }
}

export class TeaMaker {
    public outputs: string[] = [];
    public makeTea(): void {
        this.outputs = [];
        this.outputs.push('Starting to make tea...');

        // Boil water
        this.outputs.push('Boiling water');

        // Steep tea
        this.outputs.push('Steeping tea in boiling water');

        // Pour in cup
        this.outputs.push('Pouring tea into cup');

        // Add lemon
        this.outputs.push('Adding lemon');

        this.outputs.push('Tea ready!');
    }
}

// Usage
const coffeeMaker = new BasicCoffeeMaker();
coffeeMaker.makeCoffee();

const espressoMaker = new EspressoMaker();
espressoMaker.makeEspresso();

const teaMaker = new TeaMaker();
teaMaker.makeTea();

// Adding a new beverage type requires implementing the entire algorithm again
class HotChocolateMaker {
    public outputs: string[] = [];
    public makeHotChocolate(): void {
        this.outputs = [];
        this.outputs.push('Starting to make hot chocolate...');

        // Boil water
        this.outputs.push('Boiling water');

        // Add chocolate powder
        this.outputs.push('Adding chocolate powder to hot water');

        // Pour in cup
        this.outputs.push('Pouring hot chocolate into cup');

        // Add toppings
        this.outputs.push('Adding whipped cream and marshmallows');

        this.outputs.push('Hot chocolate ready!');
    }
}
```

#### Anti-Pattern Diagram

```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  BasicCoffeeMaker │  │   EspressoMaker   │  │      TeaMaker     │
├───────────────────┤  ├───────────────────┤  ├───────────────────┤
│ + makeCoffee()    │  │ + makeEspresso()  │  │ + makeTea()       │
└───────────────────┘  └───────────────────┘  └───────────────────┘

        // Each class implements its own version of the algorithm
        // with duplicated code and no shared structure
        
        makeCoffee() {          makeEspresso() {         makeTea() {  
          boil water             boil water              boil water
          brew coffee            grind beans             steep tea
          pour in cup            brew under pressure     pour in cup
          add condiments         pour in cup             add lemon
        }                      }                       }
```

#### Issues with Anti-Pattern:

1. **Code duplication**: Common steps like boiling water and pouring are duplicated in each class
2. **No standardized algorithm structure**: Each class has its own method name and implementation
3. **Hard to maintain**: Changes to common steps require modifying multiple classes
4. **Inconsistent behavior**: Different beverages might implement common steps differently
5. **Difficult to extend**: Adding a new beverage requires implementing the entire algorithm from scratch

### Proper Pattern Implementation

The proper implementation uses an abstract class with a template method that defines the algorithm structure.

#### Pseudo Code (Proper Pattern)

```typescript
// Abstract class defining the template method and algorithm skeleton
export abstract class BeverageMaker {
    public outputs: string[] = [];

    // The template method defines the algorithm skeleton
    // This is the key to the pattern - it defines the sequence of steps
    // but allows subclasses to customize specific steps
    public prepareBeverage(): void {
        this.outputs = [];
        this.outputs.push(`Starting to make ${this.getBeverageName()}...`);

        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();

        this.outputs.push(`${this.getBeverageName()} ready!`);
    }

    // These methods are implemented in the abstract class (common steps)
    protected boilWater(): void {
        this.outputs.push('Boiling water');
    }

    protected pourInCup(): void {
        this.outputs.push(`Pouring ${this.getBeverageName().toLowerCase()} into cup`);
    }

    // These methods must be implemented by subclasses (customized steps)
    protected abstract brew(): void;
    protected abstract addCondiments(): void;
    protected abstract getBeverageName(): string;
}

// Concrete implementation for coffee
export class CoffeeMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Brewing coffee grounds in boiling water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding sugar and milk');
    }

    protected getBeverageName(): string {
        return 'Coffee';
    }
}

// Concrete implementation for espresso with customized boiling step
export class EspressoMaker extends BeverageMaker {
    // Override a common step to customize it
    protected boilWater(): void {
        this.outputs.push('Boiling water to exact temperature for espresso');
    }

    protected brew(): void {
        this.outputs.push('Grinding coffee beans very finely');
        this.outputs.push('Brewing coffee grounds under high pressure');
    }

    // Espresso typically doesn't have condiments
    protected addCondiments(): void {
        // Empty implementation - hook method
    }

    protected getBeverageName(): string {
        return 'Espresso';
    }
}

// Concrete implementation for tea
export class TeaMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Steeping tea in boiling water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding lemon');
    }

    protected getBeverageName(): string {
        return 'Tea';
    }
}

// Usage
const coffeeMaker = new CoffeeMaker();
coffeeMaker.prepareBeverage();

const espressoMaker = new EspressoMaker();
espressoMaker.prepareBeverage();

const teaMaker = new TeaMaker();
teaMaker.prepareBeverage();

// Adding a new beverage type is easy - just extend the abstract class
// and implement the required methods
export class HotChocolateMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Dissolving chocolate powder in hot water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding whipped cream and marshmallows');
    }

    protected getBeverageName(): string {
        return 'Hot Chocolate';
    }
}
```

#### Proper Pattern Diagram

```
┌─────────────────────────────────────────┐
│             BeverageMaker               │
│             (abstract)                  │
├─────────────────────────────────────────┤
│ + prepareBeverage()                     │  ◄── Template Method
├─────────────────────────────────────────┤
│ # boilWater()                           │  ◄── Concrete Method
│ # pourInCup()                           │  ◄── Concrete Method
│ # customerWantsCondiments(): boolean    │  ◄── Hook Method
│ # abstract brew()                       │  ◄── Abstract Method
│ # abstract addCondiments()              │  ◄── Abstract Method
│ # abstract getBeverageName(): string    │  ◄── Abstract Method
└───────────────────┬─────────────────────┘
                    │
                    │ extends
                    ▼
        ┌───────────┴─────────┐
        ▼                     ▼
┌────────────────────┐ ┌────────────────────┐
│    CoffeeMaker     │ │     TeaMaker       │
├────────────────────┤ ├────────────────────┤
│ # brew()           │ │ # brew()           │
│ # addCondiments()  │ │ # addCondiments()  │
│ # getBeverageName()│ │ # getBeverageName()│
└────────────────────┘ └────────────────────┘

// The template method defines the algorithm structure
prepareBeverage() {
  boilWater();
  brew();          // implemented by subclasses
  pourInCup();
  if (customerWantsCondiments()) {
    addCondiments(); // implemented by subclasses
  }
}
```

#### Benefits of Proper Pattern:

1. **Eliminates code duplication**: Common steps are defined once in the abstract class
2. **Standardizes algorithm structure**: All beverages follow the same preparation sequence
3. **Easy to maintain**: Changes to common steps only need to be made in one place
4. **Consistent behavior**: Ensures all beverages follow the same general process
5. **Easy to extend**: Adding a new beverage only requires implementing the specific steps
6. **Flexible customization**: Provides hooks for optional steps and allows overriding of common steps

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │ CoffeeMaker   │      │ EspressoMaker │      │ TeaMaker      │
    │               │      │               │      │               │
    │ makeCoffee()  │      │ makeEspresso()│      │ makeTea()     │
    └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
            │                      │                      │
            ▼                      ▼                      ▼
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │ boil water    │      │ boil water    │      │ boil water    │
    │ brew coffee   │      │ grind beans   │      │ steep tea     │
    │ pour in cup   │      │ brew espresso │      │ pour in cup   │
    │ add condiments│      │ pour in cup   │      │ add lemon     │
    └───────────────┘      └───────────────┘      └───────────────┘
    Duplicated code with no shared structure or standardization

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘
                ┌───────────────────────────┐
                │ BeverageMaker (abstract)  │
                │                           │
                │ + prepareBeverage() {     │
                │   boilWater();            │
                │   brew();                 │
                │   pourInCup();            │
                │   addCondiments();        │
                │ }                         │
                │                           │
                │ # boilWater() { ... }     │
                │ # pourInCup() { ... }     │
                └───────────┬──────────────┘
                            │
                            │ extends
                            │
          ┌─────────────────┬──────────────────────┐
          │                 │                      │
┌─────────┴─────────┐ ┌─────┴──────────┐ ┌─────────┴─────────┐
│   CoffeeMaker     │ │  EspressoMaker │ │     TeaMaker      │
│                   │ │                │ │                   │
│ # brew()          │ │ # brew()       │ │ # brew()          │
│ # addCondiments() │ │ # addCond...   │ │ # addCondiments() │
└───────────────────┘ └────────────────┘ └───────────────────┘
```

## Best Practices

1. Define clear abstract methods for the steps that must be implemented by subclasses
2. Implement common steps in the abstract class to avoid code duplication
3. Use hooks with default implementations for optional steps
4. Make the template method final (where language supports it) to prevent subclasses from changing the algorithm structure
5. Document which methods are intended to be overridden and which should not be
6. Keep the template method focused on orchestrating the algorithm steps

## When to Use

- When you have multiple algorithms with similar steps and structure
- When you want to control the algorithm structure while allowing customization of specific steps
- When you want to avoid code duplication across similar implementations
- When you want to enforce a specific algorithm structure across different implementations
- When you need to implement the invariant parts of an algorithm once and leave the variant parts to subclasses

## When to Avoid

- When the variations in the algorithm are too complex or numerous
- When you need more flexibility to change the algorithm structure at runtime
- When inheritance creates too much complexity or tight coupling
- When you need to change entire algorithms at runtime (consider Strategy pattern instead)

## Variations

### Hooks

A common extension to the Template Method pattern is the use of "hooks" - methods with default (often empty) implementations that subclasses can optionally override:

```typescript
abstract class BeverageMaker {
    // Template method
    public prepareBeverage(): void {
        this.boilWater();
        this.brew();
        this.pourInCup();
        
        // Hook - only called if the customer wants condiments
        if (this.customerWantsCondiments()) {
            this.addCondiments();
        }
    }
    
    // Hook with default implementation
    protected customerWantsCondiments(): boolean {
        return true; // Default behavior
    }
}

class CoffeeWithHook extends BeverageMaker {
    // Override the hook to provide custom behavior
    protected customerWantsCondiments(): boolean {
        const answer = getUserInput("Would you like milk and sugar?");
        return answer.toLowerCase().startsWith("y");
    }
}
```

### Template Method vs Strategy Pattern

Both patterns address algorithm variations, but in different ways:

- **Template Method**: Uses inheritance to vary parts of an algorithm. The algorithm structure is fixed, but specific steps can be overridden.
- **Strategy**: Uses composition to vary the entire algorithm. Different strategies can be swapped at runtime.

## Real-World Applications

The Template Method pattern is widely used in frameworks and applications:

1. **Web frameworks**: Request handling pipelines that follow a standard sequence but allow customization of specific steps
2. **Build tools**: Build processes that follow a standard sequence (compile, test, package) but allow customization
3. **Data processing**: ETL (Extract, Transform, Load) processes with customizable transformation steps
4. **UI frameworks**: Component lifecycle methods that follow a standard sequence but allow customization

## Open-Source Examples

Many popular frameworks and libraries use the Template Method pattern. Here are some real-world examples:

### 1. React.js Component Lifecycle

React's class components use the Template Method pattern for the component lifecycle:

```javascript
class Component {
  // Template method that defines the algorithm structure
  updateComponent() {
    // Common steps for all components
    this.componentWillUpdate();  // Hook method
    this.performUpdate();        // Common implementation
    this.componentDidUpdate();   // Hook method
  }
  
  // Hook methods with default empty implementations
  componentWillUpdate() {}
  componentDidUpdate() {}
}

class MyComponent extends Component {
  // Override hook methods
  componentWillUpdate() {
    // Custom pre-update logic
  }
  
  componentDidUpdate() {
    // Custom post-update logic
  }
}
```

### 2. Node.js HTTP Server

Node.js's HTTP server uses a template method approach for request handling:

```javascript
// Simplified version of Node.js HTTP server implementation
class Server {
  // Template method
  handleRequest(req, res) {
    this.parseRequest(req);      // Common step
    this.authenticateRequest(req); // Common step
    
    // Hook method - implemented by subclasses
    this.processRequest(req, res);
    
    this.logRequest(req, res);   // Common step
    this.sendResponse(res);      // Common step
  }
  
  // Default implementation
  authenticateRequest(req) {
    // Basic authentication logic
  }
  
  // Abstract method - must be implemented by subclasses
  processRequest(req, res) {
    throw new Error('Must implement processRequest');
  }
}

class MyServer extends Server {
  // Custom implementation of the abstract method
  processRequest(req, res) {
    // Application-specific request handling
  }
  
  // Override hook method with custom implementation
  authenticateRequest(req) {
    // Custom authentication logic
  }
}
```

### 4. JUnit Testing Framework

JUnit uses the Template Method pattern for test execution:

```java
public abstract class TestCase {
  // Template method
  public void runBare() throws Throwable {
    setUp();          // Hook method
    try {
      runTest();      // Abstract method
    }
    finally {
      tearDown();     // Hook method
    }
  }
  
  // Hook methods with default implementations
  protected void setUp() {}
  protected void tearDown() {}
  
  // Abstract method - must be implemented by subclasses
  protected abstract void runTest() throws Throwable;
}

// User's test class
public class MyTest extends TestCase {
  private Resource resource;
  
  // Override hook method
  protected void setUp() {
    resource = new Resource();
  }
  
  // Implement abstract method
  protected void runTest() throws Throwable {
    // Test-specific logic
    assertEquals(expected, resource.getValue());
  }
  
  // Override hook method
  protected void tearDown() {
    resource.close();
  }
}
```

## Further Considerations

### 1. Balancing Flexibility and Control

When implementing the Template Method pattern, it's important to find the right balance between flexibility and control:

- **Too rigid**: If the template method controls too much of the algorithm, subclasses may not have enough flexibility to customize behavior.
- **Too flexible**: If the template method delegates too much to subclasses, you might lose the benefits of standardization and end up with inconsistent implementations.

### 2. Documentation and Clear Contracts

Clearly document which methods are intended to be overridden by subclasses and which should not be:

- Use language features or access modifiers to prevent overriding of the template method itself
- Document the expected behavior of each hook method and any preconditions or postconditions
- Provide meaningful default implementations for hook methods where appropriate

### 3. The Hollywood Principle

The Template Method pattern follows the "Hollywood Principle": "Don't call us, we'll call you." The abstract class calls the subclass methods at specific points rather than the subclass controlling the flow:

- This inversion of control helps maintain the algorithm structure
- Subclasses don't need to know when their methods will be called, only how to implement them

### 4. Combining with Other Patterns

The Template Method pattern can be combined with other patterns for more complex scenarios:

- **Factory Method**: Use Factory Methods within a Template Method to create objects needed by the algorithm
- **Strategy**: For algorithms that need to be changed at runtime, consider using Strategy instead of or alongside Template Method
- **Observer**: Notify observers at key points in the template method execution

## Conclusion

The Template Method pattern is a powerful way to enforce a consistent algorithm structure while allowing customization of specific steps. It eliminates code duplication and makes maintenance easier by centralizing the algorithm structure in a single place.
