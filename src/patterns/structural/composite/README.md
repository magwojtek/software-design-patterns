# Composite Pattern

## Overview

The Composite pattern is a structural design pattern that lets you compose objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects and compositions of objects uniformly.

## Problem

When you're working with tree-structured data, you often need to differentiate between a leaf node (which has no children) and a container node (which has children). However, this differentiation can make your code complex and riddled with conditional statements. For example:

- File systems with files and directories
- GUI components with simple elements and containers
- Organization structures with employees and departments
- Menu systems with items and submenus

Writing code that works with these tree structures can be complicated because you have to determine whether you're working with a leaf node or a container node before you perform an operation.

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
┌───────────┐ ┌───────────┐
│   Leaf    │ │ Composite │
└───────────┘ └─────┬─────┘
                    │
                    ▼
              ┌───────────┐
              │ Component │
              │ Component │
              │    ...    │
              └───────────┘
```

## Scenario

Imagine you're building a file explorer application that needs to display and manage a file system hierarchy. The system must handle both individual files (leaf nodes) and directories (composite nodes) that can contain files and other directories.

**The problem:**
1. You need to calculate the total size of any file system entity (individual files or entire directories)
2. You need to display the structure with proper indentation showing the hierarchy
3. You need to search for entities by name across the entire file system
4. You need to perform operations like copy, move, or delete on both files and directories
5. The user should be able to interact with both files and directories through a consistent interface

The challenge is to design a system where client code can work with all these entities uniformly without needing to know whether it's dealing with a file or a directory, while still allowing directories to manage their children.

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach typically involves using different methods for handling leaf and composite nodes, resulting in type checks throughout the client code.

#### Pseudo Code (Anti-Pattern)

```typescript
// Without Composite Pattern: Different handling for leaf and composite nodes

class File {
    private name: string;
    private size: number;

    constructor(name: string, size: number) {
        this.name = name;
        this.size = size;
    }

    getName(): string {
        return this.name;
    }

    getSize(): number {
        return this.size;
    }

    print(indent: string = ""): void {
        console.log(`${indent}File: ${this.name}, Size: ${this.size} bytes`);
    }
}

class Directory {
    private name: string;
    private files: File[] = [];
    private subdirectories: Directory[] = [];

    constructor(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    addFile(file: File): void {
        this.files.push(file);
    }

    addSubdirectory(directory: Directory): void {
        this.subdirectories.push(directory);
    }

    getSize(): number {
        let totalSize = 0;
        // Calculate size from files
        for (const file of this.files) {
            totalSize += file.getSize();
        }
        // Calculate size from subdirectories
        for (const dir of this.subdirectories) {
            totalSize += dir.getSize();
        }
        return totalSize;
    }

    print(indent: string = ""): void {
        console.log(`${indent}Directory: ${this.name} (${this.getSize()} bytes)`);
        
        // Print all files
        for (const file of this.files) {
            file.print(indent + "  ");
        }
        
        // Print all subdirectories
        for (const dir of this.subdirectories) {
            dir.print(indent + "  ");
        }
    }
}

// Client code
function getEntitySize(entity: File | Directory): number {
    // Need to check type before getting size
    if (entity instanceof File) {
        return entity.getSize();
    } else if (entity instanceof Directory) {
        return entity.getSize();
    }
    return 0;
}

function printEntity(entity: File | Directory, indent: string = ""): void {
    // Need to check type before printing
    if (entity instanceof File) {
        entity.print(indent);
    } else if (entity instanceof Directory) {
        entity.print(indent);
    }
}
```

#### Issues with Anti-Pattern:

1. **Type checking**: Client code needs to determine the type of entity before performing operations
2. **Inconsistent interface**: Files and directories have different methods and usage patterns
3. **Code duplication**: Similar operations implemented differently in both classes
4. **Tight coupling**: Client code is tightly coupled to concrete implementations
5. **Extensibility issues**: Adding new types of file system entities requires modifying client code

### Proper Pattern Implementation

The proper implementation establishes a common interface for both leaf nodes and composite nodes, allowing them to be treated uniformly.

#### Pseudo Code (Proper Pattern)

```typescript
// Component interface - common interface for all entities
interface FileSystemComponent {
    getName(): string;
    getSize(): number;
    print(indent: string): void;
}

// Leaf node implementation
class File implements FileSystemComponent {
    constructor(private name: string, private size: number) {}

    getName(): string {
        return this.name;
    }

    getSize(): number {
        return this.size;
    }

    print(indent: string = ""): void {
        console.log(`${indent}File: ${this.name}, Size: ${this.size} bytes`);
    }
}

// Composite node implementation
class Directory implements FileSystemComponent {
    private children: FileSystemComponent[] = [];

    constructor(private name: string) {}

    getName(): string {
        return this.name;
    }

    add(component: FileSystemComponent): void {
        this.children.push(component);
    }

    remove(component: FileSystemComponent): void {
        const index = this.children.indexOf(component);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    getSize(): number {
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }

    print(indent: string = ""): void {
        console.log(`${indent}Directory: ${this.name} (${this.getSize()} bytes)`);
        this.children.forEach(child => {
            child.print(indent + "  ");
        });
    }
}

// Client code
function processComponent(component: FileSystemComponent): void {
    // No type checking needed - uniform interface!
    console.log(`Component: ${component.getName()}, Size: ${component.getSize()}`);
    component.print();
}

// Example usage
const root = new Directory("root");
const docs = new Directory("docs");
const file1 = new File("readme.txt", 100);
const file2 = new File("report.pdf", 2000);
const file3 = new File("image.jpg", 500);

root.add(file1);
root.add(docs);
docs.add(file2);
docs.add(file3);

// We can work with both files and directories uniformly
processComponent(file1);
processComponent(docs);
processComponent(root);
```

#### Benefits of Proper Implementation:

1. **Uniform treatment**: Both leaf and composite objects share the same interface
2. **No type checking**: Client code works with components without knowing their concrete types
3. **Open/Closed Principle**: Adding new components doesn't require changing client code
4. **Recursive composition**: Tree structures can be built and traversed efficiently
5. **Simpler client code**: Client code is cleaner without conditional logic

## Visual Comparison

```
┌────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                             │
└────────────────────────────────────────────────────────────────┘
┌─────────────┐                       ┌─────────────┐
│             │                       │             │
│    File     │                       │  Directory  │
│             │                       │             │
└─────────────┘                       └─────────────┘
    getName()                             getName()
    getSize()                             getSize()
    print()                               print()
                                          addFile()
                                          addSubdirectory()

                    Client Code
                   ┌─────────┐
                   │ if File │
                   │  do X   │
                   │ else if │
                   │Directory│
                   │  do Y   │
                   └─────────┘


┌────────────────────────────────────────────────────────────────┐
│                      PROPER PATTERN                            │
└────────────────────────────────────────────────────────────────┘
                 ┌────────────────────┐
                 │  «interface»       │
                 │ FileSystemComponent│
                 └─────────┬──────────┘
                           │
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
      ┌─────────────┐           ┌─────────────┐
      │             │           │             │
      │    File     │           │  Directory  │
      │             │           │             │
      └─────────────┘           └─────────────┘
         getName()                 getName()
         getSize()                 getSize()
         print()                   print()
                                   add(component)
                                   remove(component)
                                   children
                                        │
                                        ▼
                                 ┌───────────────────┐
                                 │FileSystemComponent│
                                 │FileSystemComponent│
                                 │       ...         │
                                 └───────────────────┘

                   Client Code
                  ┌────────────┐
                  │   Treats   │
                  │ everything │
                  │  through   │
                  │ component  │
                  │ interface  │
                  └────────────┘
```

## Best Practices

1. Use the Composite pattern when you need to work with tree structures and want to treat leaf and composite objects uniformly
2. Define a common interface for both leaf and composite classes to ensure uniform treatment
3. Consider making the component interface as minimal as possible to avoid forcing leaf classes to implement irrelevant methods
4. Be clear about who manages parent-child relationships (parent or children, or both)
5. Consider implementing methods for accessing parent components to simplify tree traversal
6. Decide whether to provide common default implementations in an abstract class or rely solely on interfaces

## When to Use

- When you need to represent part-whole hierarchies of objects
- When you want clients to be able to ignore the difference between compositions of objects and individual objects
- When you have a recursive tree structure like file systems, organization charts, or UI components
- When you want to apply operations recursively to all components in a structure

## When to Avoid

- When you have a simple hierarchy that doesn't need recursive composition
- When there is a significant difference in behavior between leaf and composite nodes that can't be reconciled with polymorphism
- When performance is critical and the overhead of the pattern might be a concern
- When you don't actually need to treat individual objects and compositions uniformly

## Real-World Examples

### GUI Component Hierarchies
Modern UI frameworks like React, Angular, and Swing use the Composite pattern to build user interfaces. UI components like buttons and text fields (leaf nodes) and containers like panels and forms (composite nodes) share a common component interface, allowing them to be nested arbitrarily while being treated uniformly for rendering and event handling.

### Document Object Model (DOM)
Web browsers implement the DOM as a composite structure. HTML elements can be either simple elements (leaf nodes) or containers that hold other elements (composite nodes). JavaScript can manipulate any element through the same Element interface regardless of whether it contains children.

### File System Management
File explorers and operating systems use the Composite pattern to represent files (leaf nodes) and directories (composite nodes). Operations like calculating size, searching, or copying can be performed uniformly on both files and directories, with directories recursively applying operations to their contents.

### Corporate Organization Charts
HR systems model company structures using the Composite pattern. Individual employees (leaf nodes) and departments (composite nodes) share a common organizational unit interface. This allows operations like calculating total salary, finding reporting lines, or counting personnel to work seamlessly across the organizational hierarchy.

### Menu Systems
Application menu frameworks use the Composite pattern where menu items (leaf nodes) and submenus (composite nodes) share a common menu element interface. This allows for intuitive construction of nested menu structures while providing consistent behavior for selection and rendering.

## Open-Source Examples

Here are some examples of the Composite pattern in popular open-source TypeScript projects:

- **VS Code**: The workbench UI system uses a composite pattern for its view management.
  - [VS Code ViewComposite](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/browser/composite.ts)
  - UI elements are composed into hierarchical structures while sharing a common interface

- **TypeORM**: The query builder uses a composite pattern for SQL query construction.
  - [TypeORM QueryBuilder](https://github.com/typeorm/typeorm/blob/master/src/query-builder/QueryBuilder.ts)
  - Query parts can be composed into larger, more complex queries while maintaining a uniform interface

- **NestJS**: The module system uses composition to build application structure.
  - [NestJS Module](https://github.com/nestjs/nest/blob/master/packages/core/injector/module.ts)
  - Modules can contain other modules, creating a hierarchical structure of application components

- **Excalibur.js**: The game engine uses a composite pattern for scene management.
  - [Excalibur Actor System](https://github.com/excaliburjs/Excalibur/blob/main/src/engine/Actor.ts)
  - Game entities can contain child entities, forming a scene graph where operations cascade to children

## Further Considerations

- **Caching**: Consider caching results of expensive operations like calculating the size of directories
- **Visitor Pattern**: Combine with the Visitor pattern to perform operations across a composite structure without changing its classes
- **Iterator Pattern**: Combine with the Iterator pattern to provide a way to traverse the composite structure
- **Prototype Pattern**: Use with the Prototype pattern to clone complex composite structures
- **Null Object Pattern**: Consider using a null object to represent an empty component