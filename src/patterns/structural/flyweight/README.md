# Flyweight Pattern

## Overview

The Flyweight pattern is a structural design pattern that aims to minimize memory usage or computational expenses by sharing as much data as possible with related objects. It's particularly effective when you need to create a large number of similar objects, where much of their state can be shared.

In our example, we demonstrate the pattern using a text editor that manages characters with various formatting options. Without the Flyweight pattern, each character would store its own copy of formatting information, leading to memory inefficiency. With the pattern, we separate the intrinsic (shareable) state from the extrinsic (context-specific) state, allowing for efficient memory usage.

## Example Implementation

Our example implements a simplified text editor that manages characters with various formatting options:

- **Anti-pattern**: Each character stores its own complete set of formatting data, regardless of how many other characters share the same formatting.
- **Proper pattern**: Formatting data is stored separately in flyweight objects that are shared among multiple character instances.

## Problem

The Flyweight pattern addresses several problems:

1. **Memory inefficiency**: Applications that create numerous instances of the same class with similar state can consume excessive memory.
2. **Performance issues**: With large numbers of objects, performance may degrade, especially on memory-constrained devices.
3. **State duplication**: When similar objects repeatedly store the same data, it results in unnecessary duplication.
4. **Management complexity**: Updating shared properties requires changes to many instances.

Common examples include:

- Text editors that need to efficiently represent each character with its own formatting
- Game engines that need to render numerous similar objects (e.g., trees, bullets)
- GUIs with repetitive elements (e.g., icons, buttons with the same appearance)
- Caching systems that need to minimize memory usage

## Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                         Client                                │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│                   FlyweightFactory                            │
│                                                               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│  │  Flyweight  │     │  Flyweight  │     │  Flyweight  │      │
│  │    Pool     │     │    Pool     │     │    Pool     │      │
│  └─────────────┘     └─────────────┘     └─────────────┘      │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        │        ┌─────────────────────────┐
                        │        │    Context Object       │
                        ├───────▶│                         │
                        │        │  - Extrinsic State      │
                        │        │  - Flyweight Reference  │
                        │        └─────────────────────────┘
                        │
                        │        ┌─────────────────────────┐
                        │        │    Context Object       │
                        └───────▶│                         │
                                 │  - Extrinsic State      │
                                 │  - Flyweight Reference  │
                                 └─────────────────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach creates a new object for each character with its own copy of formatting data, leading to memory inefficiency and redundancy.

#### Pseudo Code (Anti-Pattern)

```typescript
class Character {
    private char: string;
    private fontFamily: string;
    private fontSize: number;
    private isBold: boolean;
    private isItalic: boolean;
    private isUnderline: boolean;
    private color: string;
    private positionX: number;
    private positionY: number;
    
    constructor(char: string, formatting: CharacterFormatting, x: number, y: number) {
        // Store all data in each instance
        this.char = char;
        this.fontFamily = formatting.fontFamily;
        this.fontSize = formatting.fontSize;
        this.isBold = formatting.isBold;
        this.isItalic = formatting.isItalic;
        this.isUnderline = formatting.isUnderline;
        this.color = formatting.color;
        this.positionX = x;
        this.positionY = y;
    }
    
    render(): void {
        console.log(`Character '${this.char}' at (${this.positionX},${this.positionY}) with style: ${this.fontSize}px ${this.fontFamily}, color: ${this.color}`);
    }
}

class TextEditor {
    private characters: Character[] = [];
    
    addCharacter(char: string, formatting: CharacterFormatting, x: number, y: number): void {
        // Always create a new character instance with its own formatting data
        this.characters.push(new Character(char, formatting, x, y));
    }
    
    // Other methods...
}

// Usage
const editor = new TextEditor();
editor.addCharacter('A', { fontFamily: 'Arial', fontSize: 12, isBold: false, color: 'black' }, 0, 0);
editor.addCharacter('A', { fontFamily: 'Arial', fontSize: 12, isBold: false, color: 'black' }, 10, 0);
// Each 'A' stores its own copy of the same formatting data
```

#### Issues with Anti-Pattern:

1. **Memory waste**: Each character instance duplicates formatting data
2. **Poor scalability**: Memory usage grows linearly with the number of objects
3. **Inefficient updates**: Changing shared properties requires updating each instance separately
4. **Performance degradation**: Creating many objects with duplicate data impacts performance
5. **Increased garbage collection**: More objects with duplicate data means more work for the garbage collector

### Proper Pattern Implementation

The proper implementation separates intrinsic state (character formatting) from extrinsic state (character position) and reuses flyweight objects for shared data.

#### Pseudo Code (Proper Pattern)

```typescript
// Flyweight interface
interface CharacterFlyweight {
    render(position: { x: number, y: number }): void;
}

// Concrete Flyweight - only stores intrinsic state
class CharacterFlyweightImpl implements CharacterFlyweight {
    constructor(
        private readonly char: string,
        private readonly formatting: CharacterFormatting,
    ) {}
    
    render(position: { x: number, y: number }): void {
        console.log(`Character '${this.char}' at (${position.x},${position.y}) with style: ${this.formatting.fontSize}px ${this.formatting.fontFamily}, color: ${this.formatting.color}`);
    }
}

// Flyweight Factory - manages flyweight objects
class CharacterFlyweightFactory {
    private flyweights: Map<string, CharacterFlyweight> = new Map();
    
    getFlyweight(char: string, formatting: CharacterFormatting): CharacterFlyweight {
        const key = this.getKey(char, formatting);
        
        if (!this.flyweights.has(key)) {
            this.flyweights.set(key, new CharacterFlyweightImpl(char, formatting));
        }
        
        return this.flyweights.get(key)!;
    }
    
    private getKey(char: string, formatting: CharacterFormatting): string {
        return `${char}-${formatting.fontFamily}-${formatting.fontSize}-${formatting.color}`;
    }
}

// Context class that combines flyweight with extrinsic state
class CharacterContext {
    constructor(
        private flyweight: CharacterFlyweight,
        private position: { x: number, y: number },
    ) {}
    
    render(): void {
        this.flyweight.render(this.position);
    }
}

class TextEditor {
    private characters: CharacterContext[] = [];
    private factory: CharacterFlyweightFactory;
    
    constructor(factory: CharacterFlyweightFactory) {
        this.factory = factory;
    }
    
    addCharacter(char: string, formatting: CharacterFormatting, x: number, y: number): void {
        // Get or create a flyweight for this character formatting
        const flyweight = this.factory.getFlyweight(char, formatting);
        
        // Create a context with the flyweight and the position
        this.characters.push(new CharacterContext(flyweight, { x, y }));
    }
    
    // Other methods...
}

// Usage
const factory = new CharacterFlyweightFactory();
const editor = new TextEditor(factory);

editor.addCharacter('A', { fontFamily: 'Arial', fontSize: 12, isBold: false, color: 'black' }, 0, 0);
editor.addCharacter('A', { fontFamily: 'Arial', fontSize: 12, isBold: false, color: 'black' }, 10, 0);
// Both 'A' characters share the same flyweight object for their formatting
```

#### Benefits of Proper Implementation:

1. **Memory efficiency**: Shared intrinsic state reduces memory footprint
2. **Better scalability**: Memory usage grows with unique combinations of state, not total object count
3. **Centralized updates**: Changes to shared state affect all instances using that flyweight
4. **Improved performance**: Less memory allocation and garbage collection
5. **Clear separation of concerns**: Separates shared and non-shared state

## Visual Comparison

```
┌────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                             │
└────────────────────────────────────────────────────────────────┘
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Character A │  │ Character B │  │ Character A │  │ Character B │
│             │  │             │  │ (copy)      │  │ (copy)      │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ Char        │  │ Char        │  │ Char        │  │ Char        │
│ Font        │  │ Font        │  │ Font        │  │ Font        │
│ Size        │  │ Size        │  │ Size        │  │ Size        │
│ Bold        │  │ Bold        │  │ Bold        │  │ Bold        │
│ Color       │  │ Color       │  │ Color       │  │ Color       │
│ Position    │  │ Position    │  │ Position    │  │ Position    │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
   - Each instance contains a complete copy of all data
   - Memory usage scales linearly with the number of objects
   - Duplicate data stored multiple times


┌────────────────────────────────────────────────────────────────┐
│                      PROPER PATTERN                            │
└────────────────────────────────────────────────────────────────┘
                    Flyweight Factory
                   ┌────────────────┐
                   │ getFlyweight() │
                   └───────┬────────┘
                           │
       ┌─────────────────┬─┴──────────────┐
       │                 │                │
┌──────┴───────┐  ┌──────┴───────┐        │
│ Character A  │  │ Character B  │        │
│ Flyweight    │  │ Flyweight    │        │
├──────────────┤  ├──────────────┤        │
│ Char         │  │ Char         │        │
│ Font         │  │ Font         │        │
│ Size         │  │ Size         │        │
│ Bold         │  │ Bold         │        │
│ Color        │  │ Color        │        │
└──────────────┘  └──────────────┘        │
       ▲                 ▲                │
       │                 │                │
       │                 │                │
┌──────┴──────┐   ┌──────┴──────┐   ┌─────┴───────┐
│ Context 1   │   │ Context 2   │   │ Context 3   │
├─────────────┤   ├─────────────┤   ├─────────────┤
│ Position    │   │ Position    │   │ Position    │
│ → Flyweight │   │ → Flyweight │   │ → Flyweight │
└─────────────┘   └─────────────┘   └─────────────┘
   - Intrinsic state (shared) is stored only once in flyweights
   - Extrinsic state (unique) is stored in context objects
   - Memory usage depends on unique combinations of shared state
```

## Best Practices

1. Identify and separate intrinsic (shareable) state from extrinsic (context-specific) state
2. Make flyweights immutable to ensure they can be safely shared
3. Use a flyweight factory to manage the creation and sharing of flyweight objects
4. Make the client code responsible for storing and passing extrinsic state
5. Consider using the Flyweight pattern only when memory usage is a concern
6. Use object pooling in conjunction with flyweights for optimal performance

## When to Use

- When your application needs to create a large number of similar objects
- When memory usage is a critical concern
- When most of an object's state can be made extrinsic (moved outside the object)
- When many objects can share a single instance of the same state
- When object identity is not important for the application

## When to Avoid

- When memory optimization is not required or brings unnecessary complexity
- When shared state is rarely duplicated across objects
- When the objects are not numerous enough to justify the pattern's complexity
- When the extrinsic state is too large or complex to manage externally
- When object identity is important to the application logic

## Real-World Examples

### Text Processing in Word Processors
Word processors like Microsoft Word or Google Docs use the Flyweight pattern for character representation. Instead of each character storing its own formatting data, the application maintains a pool of character styles (font, size, color, etc.) that are shared among all instances of text with the same formatting.

### Game Development
In video games, especially those with large open worlds, developers use flyweights for rendering repeated objects like trees, grass, rocks, or buildings. Each visual instance references the same underlying 3D model and texture data (intrinsic state), while only position, rotation, and scaling (extrinsic state) are stored individually.

### Browser Rendering
Web browsers implement flyweights to efficiently render web pages. When displaying text, browsers share font resources across all instances of the same font rather than loading separate copies for each text element. Similarly, images used multiple times are loaded once and referenced from multiple places.

### GUI Frameworks
User interface libraries use flyweights for common graphical elements. Icons, cursors, and standard controls share underlying visual representations, with only their position and state being stored uniquely for each instance on screen.

### String Interning
Many programming languages use string interning (a form of flyweight) to optimize memory usage. Rather than creating duplicate copies of the same string literal, the system maintains a pool of unique strings that are shared across the program, reducing memory footprint significantly.

## Further Considerations

- **Immutability**: Flyweights should be immutable to ensure they can be safely shared across contexts
- **Factory Pattern**: Combine with the Factory pattern for effective flyweight object creation and management
- **Thread Safety**: Consider thread safety if flyweights will be accessed by multiple threads
- **State/Strategy Pattern**: Can be combined with State or Strategy to share common strategies
- **Composite Pattern**: Can be used with Composite for tree structures with many similar leaf nodes