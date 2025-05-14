# Decorator Pattern

## Overview

The Decorator pattern is a structural design pattern that lets you attach new behaviors to objects by placing them inside special wrapper objects that contain these behaviors. It allows you to add responsibilities to individual objects dynamically and transparently, without affecting other objects.

## Problem

Sometimes we want to add functionalities to individual objects rather than an entire class. For example, we need to add various formatting options to a text component like bold, italic, underline, or color, and we want to combine these options in any arrangement.

Using inheritance to extend behavior would lead to an explosion of subclasses as each combination would require its own class. For instance, with just 4 formatting options (bold, italic, underline, color), you'd need 15 different subclasses to cover all possible combinations!

## Diagram

```
       ┌───────────┐
       │  Client   │
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │ Component │
       └─────┬─────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌────────────┐ ┌────────────┐
│ConcreteComp│ │ Decorator  │◄──┐
└────────────┘ └─────┬──────┘   │
                     │          │
            ┌────────┴────────┐ │
            │                 │ │
            ▼                 │ │
     ┌────────────┐           │ │
     │ConcreteDecA│───────────┘ │
     └────────────┘             │
            │                   │
            ▼                   │
     ┌────────────┐             │
     │ConcreteDecB│─────────────┘
     └────────────┘
```

## Scenario

Imagine you're developing a text editor application that needs to support various formatting options for text. Users should be able to apply different style combinations like bold, italic, underline, and different colors to any selected text.

**The problem:**
1. Text can have multiple formatting options applied simultaneously (bold + italic + color)
2. Different formatting combinations shouldn't require creating new classes for each possible combination
3. Formatting should be applicable dynamically at runtime based on user selection
4. New formatting options should be easy to add without modifying existing code
5. The application should handle nested formatting correctly (e.g., bold text within colored text)

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach typically involves creating separate subclasses for each feature combination, leading to a class explosion as the number of combinations grows.

#### Pseudo Code (Anti-Pattern)

```typescript
// Base class
class TextFormatter {
    constructor(protected text: string) {}
    
    format(): string {
        return this.text;
    }
}

// Individual formatting classes
class BoldTextFormatter extends TextFormatter {
    format(): string {
        return `<b>${super.format()}</b>`;
    }
}

class ItalicTextFormatter extends TextFormatter {
    format(): string {
        return `<i>${super.format()}</i>`;
    }
}

class UnderlineTextFormatter extends TextFormatter {
    format(): string {
        return `<u>${super.format()}</u>`;
    }
}

// Combination classes - leads to class explosion!
class BoldItalicTextFormatter extends TextFormatter {
    format(): string {
        return `<b><i>${super.format()}</i></b>`;
    }
}

class BoldUnderlineTextFormatter extends TextFormatter {
    format(): string {
        return `<b><u>${super.format()}</u></b>`;
    }
}

class ItalicUnderlineTextFormatter extends TextFormatter {
    format(): string {
        return `<i><u>${super.format()}</u></i>`;
    }
}

class BoldItalicUnderlineTextFormatter extends TextFormatter {
    format(): string {
        return `<b><i><u>${super.format()}</u></i></b>`;
    }
}

// Client code
function formatText(text: string, isBold: boolean, isItalic: boolean, isUnderline: boolean): string {
    if (isBold && isItalic && isUnderline) {
        return new BoldItalicUnderlineTextFormatter(text).format();
    } else if (isBold && isItalic) {
        return new BoldItalicTextFormatter(text).format();
    } else if (isBold && isUnderline) {
        return new BoldUnderlineTextFormatter(text).format();
    } else if (isItalic && isUnderline) {
        return new ItalicUnderlineTextFormatter(text).format();
    } else if (isBold) {
        return new BoldTextFormatter(text).format();
    } else if (isItalic) {
        return new ItalicTextFormatter(text).format();
    } else if (isUnderline) {
        return new UnderlineTextFormatter(text).format();
    }
    return text;
}
```

#### Issues with Anti-Pattern:

1. **Class explosion**: Each combination of behaviors requires a new class
2. **Rigid structure**: Adding a new formatting option requires creating many new subclasses
3. **Code duplication**: Similar formatting logic repeated in multiple classes
4. **Tight coupling**: Client code needs to know about all possible combinations
5. **Extensibility issues**: Adding new formatting features requires modifying existing code

### Proper Pattern Implementation

The proper implementation uses composition and wrapping to dynamically add behaviors to objects.

#### Pseudo Code (Proper Pattern)

```typescript
// Component interface - defines operations that decorators can modify
interface TextComponent {
    format(): string;
}

// Concrete Component - the basic object that can be decorated
class SimpleText implements TextComponent {
    constructor(private text: string) {}
    
    format(): string {
        return this.text;
    }
}

// Base Decorator - implements the component interface and holds a reference to a component
abstract class TextDecorator implements TextComponent {
    constructor(protected component: TextComponent) {}
    
    format(): string {
        // By default, delegate to the wrapped component
        return this.component.format();
    }
}

// Concrete Decorators - add specific behaviors
class BoldDecorator extends TextDecorator {
    format(): string {
        return `<b>${this.component.format()}</b>`;
    }
}

class ItalicDecorator extends TextDecorator {
    format(): string {
        return `<i>${this.component.format()}</i>`;
    }
}

class UnderlineDecorator extends TextDecorator {
    format(): string {
        return `<u>${this.component.format()}</u>`;
    }
}

class ColorDecorator extends TextDecorator {
    constructor(component: TextComponent, private color: string) {
        super(component);
    }
    
    format(): string {
        return `<span style="color: ${this.color}">${this.component.format()}</span>`;
    }
}

// Client code
function formatText(text: string, options: { 
    bold?: boolean; 
    italic?: boolean; 
    underline?: boolean;
    color?: string;
}): string {
    let textComponent: TextComponent = new SimpleText(text);
    
    // Dynamically apply decorators based on options
    if (options.bold) {
        textComponent = new BoldDecorator(textComponent);
    }
    if (options.italic) {
        textComponent = new ItalicDecorator(textComponent);
    }
    if (options.underline) {
        textComponent = new UnderlineDecorator(textComponent);
    }
    if (options.color) {
        textComponent = new ColorDecorator(textComponent, options.color);
    }
    
    return textComponent.format();
}

// Example usage
const formattedText = formatText("Hello, Decorator Pattern!", {
    bold: true,
    italic: true,
    color: "blue"
});
```

#### Benefits of Proper Implementation:

1. **Single responsibility**: Each decorator has a single responsibility
2. **Dynamic composition**: Behaviors can be added at runtime
3. **Open/Closed Principle**: New decorators can be added without changing existing code
4. **Flexibility**: Decorators can be combined in any order and arrangement
5. **No class explosion**: Only one class per behavior, not per combination

## Visual Comparison

```
┌────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                             │
└────────────────────────────────────────────────────────────────┘
                ┌──────────────┐
                │ TextFormatter│
                └──────┬───────┘
                       │
     ┌─────────────────┼────────────────┐
     │                 │                │
     ▼                 ▼                ▼
┌──────────┐     ┌──────────┐    ┌───────────┐
│   Bold   │     │  Italic  │    │ Underline │
└────┬─────┘     └────┬─────┘    └─────┬─────┘
     │                │                │
     ▼                ▼                ▼
┌──────────────────────────────────────┐
│         Many Combined Classes        │
│BoldItalic, BoldUnderline, etc...     │
└──────────────────────────────────────┘

                    Client Code
                   ┌─────────────┐
                   │   Switch    │
                   │ based on    │
                   │ combination │
                   │ of options  │
                   └─────────────┘


┌────────────────────────────────────────────────────────────────┐
│                      PROPER PATTERN                            │
└────────────────────────────────────────────────────────────────┘
             ┌─────────────────┐
             │  «interface»    │
             │  TextComponent  │
             └───────┬─────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌─────────────┐           ┌─────────────┐
│             │           │ «abstract»  │
│ SimpleText  │           │ Decorator   │◄─┐
└─────────────┘           └──────┬──────┘  │
                                 │         │
                    ┌────────────┴─────────┐
                    │                      │
                    ▼                      ▼
              ┌──────────┐          ┌──────────┐
              │  Bold    │          │  Italic  │
              └──────────┘          └──────────┘
                                         │
                                         ▼
                                    ┌───────────┐
                                    │ Underline │
                                    └───────────┘
                                         │
                                         ▼
                                    ┌──────────┐
                                    │  Color   │
                                    └──────────┘

                  Client Code
                 ┌────────────────┐
                 │   Decorators   │
                 │ dynamically    │
                 │ combined based │
                 │ on options     │
                 └────────────────┘
```

## Best Practices

1. Use the Decorator pattern when you need to add responsibilities to objects dynamically without modifying their structure
2. Use it when extending a class by inheritance is impractical or would lead to a combinatorial explosion of subclasses
3. Make sure all components and decorators implement the same interface
4. Keep the decorator interface focused and minimal
5. Design decorators to be independent and unaware of other decorators
6. Be careful with the order of decorators when it matters (e.g., HTML tags should be nested in a specific order)

## When to Use

- When you need to add responsibilities to objects dynamically and transparently
- When extension by subclassing is impractical (leads to too many classes)
- When you need to combine multiple optional behaviors
- When you want to follow the Single Responsibility Principle and Open/Closed Principle
- When behavior can be modeled as layers that can be stacked upon one another

## When to Avoid

- When the functionality being added is essential to the core component (not optional)
- When the behavior can be better implemented through composition rather than wrapping
- When you have a simple set of behaviors that won't be combined
- When the overhead of multiple decorated objects might cause performance issues
- When client code would be overly complicated by working with multiple decorator layers

## Real-World Examples

### Java I/O Streams
Java's I/O library is a classic example of the Decorator pattern. Classes like BufferedInputStream, DataInputStream, and FileInputStream all implement the same InputStream interface. Base components like FileInputStream can be wrapped with decorators like BufferedInputStream (for buffered reading) or GZIPInputStream (for decompression) to add functionality.

### Web Service Middleware
Web frameworks like Express.js use the Decorator pattern for middleware functions. Each middleware decorator adds behavior to the request/response handling pipeline, such as authentication, logging, compression, or error handling, while maintaining the same interface for processing HTTP requests.

### UI Component Libraries
Frontend frameworks implement decorators for UI components. For example, a basic button component can be enhanced with decorators that add tooltip functionality, drag-and-drop capabilities, animation effects, or accessibility features while preserving the original component's interface.

### Pizza Ordering Systems
Food ordering applications, particularly for pizzas, often use the Decorator pattern. A base pizza can be decorated with various toppings (cheese, pepperoni, mushrooms) where each topping adds to the description and price of the pizza without changing the interface.

### Authorization Systems
Security frameworks use decorators to add authorization checks to service methods. A base service implements business logic, while security decorators verify permissions before delegating to the original service method, allowing security policies to be applied dynamically without modifying the underlying service code.

## Open-Source Examples

Here are some examples of the Decorator pattern in popular open-source TypeScript projects:

- **Angular**: Uses decorators extensively throughout its framework, particularly for component metadata.
  - [Angular Component Decorator](https://github.com/angular/angular/blob/master/packages/core/src/metadata/directives.ts)
  - Example: The `@Component()` decorator adds metadata to a class, transforming it into a component

- **NestJS**: Uses the decorator pattern for its HTTP request handlers and middleware.
  - [NestJS Guards](https://github.com/nestjs/nest/blob/master/packages/common/decorators/core/use-guards.decorator.ts)
  - Example: The `@UseGuards()` decorator enhances controller methods with authentication/authorization layers

- **TypeORM**: Implements decorators for entity definition and relationship management.
  - [TypeORM Entity Decorators](https://github.com/typeorm/typeorm/blob/master/src/decorator/entity/Entity.ts)
  - Example: The `@Entity()` decorator transforms a class into a database entity

- **TypeStack/class-transformer**: A library dedicated to transform objects from one class to another.
  - [Class Transformer](https://github.com/typestack/class-transformer)
  - Uses decorators like `@Expose()` and `@Type()` to control serialization/deserialization behavior

## Further Considerations

- **Adapter vs Decorator**: While Decorator changes the object's behavior but keeps its interface, Adapter changes the interface without altering behavior.
- **Composite with Decorator**: These patterns can be combined effectively; Decorator adds responsibilities to individual objects while Composite helps organize object structures.
- **Proxy vs Decorator**: A Proxy controls access to an object, while a Decorator adds new behaviors.
- **Performance**: Be aware that excessive decoration can lead to many small objects, potentially affecting performance.
- **Stateless Decorators**: Consider making decorators stateless when possible, allowing them to be shared across multiple component instances.