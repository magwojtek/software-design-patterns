# Prototype Pattern

## Overview

The Prototype pattern allows you to create new objects by copying an existing object (prototype), rather than creating new ones from scratch. This is particularly useful when object creation is more expensive than copying, or when you need to create objects with varying configurations while keeping some base state the same.

## Problem

Sometimes creating a new object from scratch is resource-intensive, complex, or requires information not available to the constructor. For example:

- Objects that require complex initialization or database operations
- Objects with many required parameters in their constructors
- Objects with default state that needs to be pre-loaded before use
- Objects that need to be cloned with slight variations

## Diagram

```
┌────────────────────────────────────────┐
│                Client                  │
└───────────────────────┬────────────────┘
                        │
                        │ uses
                        ▼
┌────────────────────────────────────────┐
│           Prototype Interface          │
├────────────────────────────────────────┤
│ + clone(): Prototype                   │
└────────────────┬───────────────────────┘
                 │
                 │ implements
                 ▼
┌────────────────────────────────────────┐
│        Concrete Prototype              │
├────────────────────────────────────────┤
│ - field1: Type                         │
│ - field2: Type                         │
├────────────────────────────────────────┤
│ + clone(): ConcretePrototype           │
│ + operation()                          │
└────────────────────────────────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach typically involves creating new objects from scratch each time or using shallow copying that doesn't properly handle complex object structures.

#### Pseudo Code (Anti-Pattern)

```typescript
class Character {
    name: string;
    health: number;
    attackPower: number;
    defensePower: number;
    skills: string[];
    inventory: { [key: string]: number };
    
    constructor(name: string) {
        // Expensive initialization operations
        this.name = name;
        this.health = 100;
        this.attackPower = 10;
        this.defensePower = 5;
        this.skills = ["basic attack"];
        this.inventory = { "potion": 3 };
        
        // Imagine this takes significant resources
        this.loadDefaultStats();
    }
    
    loadDefaultStats() {
        // Complex operation that takes time
        // e.g. loading from database or file
    }
    
    // Problem: Manual copying is error-prone and doesn't scale
    copy(newName: string): Character {
        const newCharacter = new Character(newName);
        newCharacter.health = this.health;
        newCharacter.attackPower = this.attackPower;
        newCharacter.defensePower = this.defensePower;
        
        // Problem: Shallow copy means both objects reference the same array
        newCharacter.skills = this.skills; // Wrong! This is a reference
        
        // Problem: Shallow copy of nested objects
        newCharacter.inventory = this.inventory; // Wrong! This is a reference
        
        return newCharacter;
    }
}

// Usage:
const warrior = new Character("Warrior");
warrior.skills.push("sword slash");
warrior.inventory["sword"] = 1;

// Problems:
const copiedWarrior = warrior.copy("Warrior2");
copiedWarrior.skills.push("new skill"); // Modifies original warrior's skills too!
copiedWarrior.inventory["shield"] = 1;  // Modifies original warrior's inventory too!
```

#### Issues with Anti-Pattern:

1. **Inefficient object creation**: The constructor runs expensive initialization for every object
2. **Shallow copying**: References to arrays and objects are copied, not the contents
3. **Brittle maintenance**: When new properties are added, the copy method needs to be updated
4. **No formal interface**: Without a clone method interface, consistency isn't enforced
5. **Copy complexity**: Manually copying all properties is error-prone

### Proper Pattern Implementation

The proper implementation uses a prototype interface with a clone method for deep copying.

#### Pseudo Code (Proper Pattern)

```typescript
interface Prototype<T> {
    clone(): T;
}

class Character implements Prototype<Character> {
    name: string;
    health: number;
    attackPower: number;
    defensePower: number;
    skills: string[];
    inventory: { [key: string]: number };
    
    constructor(name: string) {
        this.name = name;
        this.health = 100;
        this.attackPower = 10;
        this.defensePower = 5;
        this.skills = ["basic attack"];
        this.inventory = { "potion": 3 };
        
        // Expensive initialization only happens once per base prototype
        this.loadDefaultStats();
    }
    
    loadDefaultStats() {
        // Complex operation that loads initial stats
    }
    
    clone(): Character {
        // Create a new instance but avoid expensive initialization
        const clone = Object.create(Character.prototype);
        
        // Copy primitive values
        clone.name = `${this.name}_clone`;
        clone.health = this.health;
        clone.attackPower = this.attackPower;
        clone.defensePower = this.defensePower;
        
        // Deep copy for arrays
        clone.skills = [...this.skills];
        
        // Deep copy for objects
        clone.inventory = { ...this.inventory };
        
        return clone;
    }
    
    cloneWithName(name: string): Character {
        const clone = this.clone();
        clone.name = name;
        return clone;
    }
}

// Usage:
// Create base prototype only once
const warriorPrototype = new Character("BaseWarrior");
warriorPrototype.skills.push("sword slash");
warriorPrototype.inventory["sword"] = 1;

// Create instances by cloning
const warrior1 = warriorPrototype.cloneWithName("Warrior1");
const warrior2 = warriorPrototype.cloneWithName("Warrior2");

// Each instance has its own copies of arrays and objects
warrior1.skills.push("shield bash"); // Doesn't affect warrior2
warrior2.inventory["bow"] = 1;       // Doesn't affect warrior1
```

#### Benefits of Proper Implementation:

1. **Efficient object creation**: Avoids running expensive initialization code multiple times
2. **Deep copying**: Properly copies nested objects and arrays
3. **Type safety**: Interface ensures all prototypes implement clone method
4. **Flexibility**: Can provide specialized clone methods for different variations
5. **Encapsulation**: The clone implementation details are hidden from client code

## Visual Comparison

```
┌───────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                                │
└───────────────────────────────────────────────────────────────────┘
  Object A               Object B                Object C
┌───────────┐          ┌───────────┐          ┌───────────┐
│           │          │           │          │           │
│   Full    │ create() │   Full    │ create() │   Full    │
│ Creation  │─────────►│ Creation  │─────────►│ Creation  │
│ Process   │          │ Process   │          │ Process   │
│           │          │           │          │           │
└───────────┘          └───────────┘          └───────────┘


┌───────────────────────────────────────────────────────────────────┐
│                       PROPER PATTERN                              │
└───────────────────────────────────────────────────────────────────┘
                     ┌───────────┐
                     │           │
                     │ Prototype │
                     │  Object   │
                     │           │
                     └─────┬─────┘
                           │
       ┌───────────────────┴────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
    clone()               clone()             clone()
┌───────────┐         ┌───────────┐        ┌───────────┐
│           │         │           │        │           │
│  Object A │         │  Object B │        │  Object C │
│ (copied)  │         │ (copied)  │        │ (copied)  │
│           │         │           │        │           │
└───────────┘         └───────────┘        └───────────┘
```

## Best Practices

1. Implement a formal prototype interface with a clone method
2. Ensure deep copying of complex structures (arrays, objects)
3. Consider providing specialized clone methods for different variations
4. Use a prototype registry/cache for commonly used prototypes
5. Combine with Factory pattern to create objects based on conditions

## When to Use

- When object creation is more expensive than copying
- When you need to create objects with varying configurations while keeping some base state
- When objects have many similar instances with few differences
- When your application needs to be independent of how objects are created
- When you need to create objects at runtime that are similar to existing objects

## When to Avoid

- When objects are simple and inexpensive to create
- When each object needs to be completely unique
- When deep copying would be more expensive than creating from scratch
- When objects don't have that much shared state

## Further Considerations

- **Object Registration**: Consider a registry/cache for managing available prototypes
- **Serialization**: Implement serialization/deserialization for storing prototypes
- **Deep/Shallow Copy**: Decide when each is appropriate based on your needs
- **Immutable Objects**: For immutable objects, copying might be unnecessary