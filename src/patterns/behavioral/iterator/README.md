# Iterator Pattern

## Overview

The Iterator pattern is a behavioral design pattern that provides a way to access elements of a collection sequentially without exposing its underlying representation. It decouples algorithms from containers by abstracting the traversal of different collection types.

## Problem

When working with collections of objects, we often face several challenges:

- Different collection types (arrays, lists, trees, maps) have different APIs for traversal
- Client code becomes tied to specific collection implementations
- Difficult to switch between collection types without changing client code
- Hard to implement different traversal strategies (forward, backward, filtered)
- Collections expose their internal structure, violating encapsulation

## Scenario

Imagine you're building a digital library system that needs to work with various types of book collections. Your system contains:

1. An ordered array-based collection of books organized by publication date
2. A map-based collection that stores books with their ISBN as keys
3. A specialized tree structure that organizes books by genre and then by author

**The problem:**
1. Your client code needs to display books in a consistent way regardless of the collection type
2. You want to add new collection types in the future without changing existing client code
3. Different views of the library need different traversal methods (e.g., forward for newest books, filtered by author, etc.)
4. You need to maintain encapsulation of the internal collection structures
5. You want to avoid duplicating traversal logic for each collection type

## Diagram

```
┌───────────────┐           ┌──────────────┐
│               │           │  Iterator    │
│  Collection   │◄─────────►│  Interface   │
│  Interface    │           └──────┬───────┘
└───────┬───────┘                  │
        │                          │
        │ has                      │ implemented by
        ▼                          │
┌───────────────┐         ┌────────┼─────────┐
│ + iterator()  │         │        │         │
└───────┬───────┘    ┌────▼──┐  ┌──▼────┐ ┌──▼────┐
        │            │ Iter1 │  │ Iter2 │ │ Iter3 │
  implemented by     └───────┘  └───────┘ └───────┘
        │
  ┌─────┼───────┐
  │     │       │
┌─▼─────▼─┐ ┌───▼───┐
│ Array   │ │ Map   │
│ Coll.   │ │ Coll. │
└─────────┘ └───────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach typically involves collections that expose their internal representation and use different methods for traversal.

#### Pseudo Code (Anti-Pattern)

```typescript
class BookCollection {
    private books: Book[] = [];
    
    // Exposes internal array directly
    getBooks(): Book[] {
        return this.books; 
    }
    
    // Collection-specific traversal method
    displayBooks(): void {
        for (let i = 0; i < this.books.length; i++) {
            console.log(this.books[i].title);
        }
    }
}

class BookDirectory {
    private books: Map<string, Book> = new Map();
    
    // Different collection, different traversal method
    listBooks(): void {
        this.books.forEach((book) => {
            console.log(book.title);
        });
    }
    
    // Different way to access elements
    getBook(title: string): Book {
        return this.books.get(title);
    }
}

// Client code has to know specifics of each collection
function displayAllBooks(collection: BookCollection, directory: BookDirectory): void {
    // Need to use different methods for different collections
    collection.displayBooks();
    directory.listBooks();
}

// Different filtering methods for each collection type
function findBooksByAuthor(author: string, collection: BookCollection, directory: BookDirectory): void {
    // Array traversal
    const books = collection.getBooks();
    for (let i = 0; i < books.length; i++) {
        if (books[i].author === author) {
            console.log(books[i].title);
        }
    }
    
    // Map traversal - completely different approach
    directory.books.forEach((book) => { // Breaks encapsulation
        if (book.author === author) {
            console.log(book.title);
        }
    });
}
```

#### Issues with Anti-Pattern:

1. **Violated Encapsulation**: Collections expose internal structure
2. **Inconsistent Interfaces**: Each collection has its own access methods
3. **Tight Coupling**: Client code depends on specific collection types
4. **Difficult to Change**: Hard to switch collection implementations
5. **Code Duplication**: Different traversal logic for each collection type

### Proper Pattern Implementation

The proper implementation uses interfaces for both collections and iterators to decouple the client from the collection details.

#### Pseudo Code (Proper Pattern)

```typescript
// Iterator interface
interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
}

// Collection interface
interface Collection<T> {
    createIterator(): Iterator<T>;
}

// Concrete array iterator
class ArrayIterator<T> implements Iterator<T> {
    private position = 0;
    
    constructor(private collection: T[]) {}
    
    hasNext(): boolean {
        return this.position < this.collection.length;
    }
    
    next(): T {
        return this.collection[this.position++];
    }
}

// Concrete map iterator
class MapIterator<K, T> implements Iterator<T> {
    private keys: K[];
    private position = 0;
    
    constructor(private collection: Map<K, T>) {
        this.keys = Array.from(collection.keys());
    }
    
    hasNext(): boolean {
        return this.position < this.keys.length;
    }
    
    next(): T {
        const key = this.keys[this.position++];
        return this.collection.get(key);
    }
}

// Concrete array collection
class BookArray implements Collection<Book> {
    private books: Book[] = [];
    
    add(book: Book): void {
        this.books.push(book);
    }
    
    createIterator(): Iterator<Book> {
        return new ArrayIterator(this.books);
    }
}

// Concrete map collection
class BookMap implements Collection<Book> {
    private books: Map<string, Book> = new Map();
    
    add(book: Book): void {
        this.books.set(book.title, book);
    }
    
    createIterator(): Iterator<Book> {
        return new MapIterator(this.books);
    }
}

// Client code
class Library {
    // Works with any collection through the iterator interface
    displayBooks(collection: Collection<Book>): void {
        const iterator = collection.createIterator();
        
        while (iterator.hasNext()) {
            const book = iterator.next();
            console.log(book.title);
        }
    }
    
    // One implementation works for all collection types
    findBooksByAuthor(collection: Collection<Book>, author: string): void {
        const iterator = collection.createIterator();
        
        while (iterator.hasNext()) {
            const book = iterator.next();
            if (book.author === author) {
                console.log(book.title);
            }
        }
    }
}

// Usage
const library = new Library();
const arrayCollection = new BookArray();
const mapCollection = new BookMap();

// Add books to both collections...

// Same method works with any collection type
library.displayBooks(arrayCollection);
library.displayBooks(mapCollection);
```

#### Benefits of Proper Implementation:

1. **Encapsulation**: Collections hide their internal structure
2. **Polymorphism**: Client works with many collections through a common interface
3. **Single Responsibility**: Iteration logic is separated from collections
4. **Easy to Extend**: New collection types can be added without changing client code
5. **Multiple Traversals**: Different iterator implementations for the same collection

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
   ┌────────────────┐           ┌──────────────────────────┐
   │ BookCollection │- - - - - >│ Client Code              │
   │ - displayBooks │           │ - depends on specific    │
   └────────────────┘           │   methods                │
                                │                          │
   ┌────────────────┐           │                          │
   │ BookDirectory  │- - - - - >│                          │
   │ - listBooks    │           │                          │
   └────────────────┘           └──────────────────────────┘
    
    Different methods for each collection type
    Internal structure exposed

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘

    ┌───────────────┐           ┌──────────────┐
    │ «interface»   │           │ «interface»  │
    │ Collection    │<>- - - - >│ Iterator     │
    └───────┬───────┘           └─────┬────────┘
            ▲                         ▲
            │                         │
      ┌─────┼───────┐                 │
      │             │                 │
┌─────┴─────┐  ┌────┴────┐      ┌─────┴─────────┐
│ BookArray │  │ BookMap │      │               │
└───────────┘  └─────────┘ ┌────┴──────┐   ┌────┴─────┐
                           │ ArrayIter │   │ MapIter  │
                           └───────────┘   └──────────┘
                          
    ┌──────────────┐
    │ Client Code  │
    │ - works      │<- - - - - - - - - Collection interface
    │   with       │<- - - - - - - - - Iterator interface
    │   interfaces │
    └──────────────┘
```

## Best Practices

1. Define clear interfaces for both iterators and collections
2. Keep iterator state separate from the collection (position tracking)
3. Consider adding iterator factory methods to collections
4. Implement different traversal strategies as separate iterator classes
5. Add special iterators for filtered or transformed views of collections
6. Provide way to reset iterator state if needed
7. Consider implementing Java's Iterable interface for languages that support it

## When to Use

- When working with complex data structures that need traversal
- When you want to hide collection implementation details from clients
- When you need to provide multiple ways to traverse the same collection
- When you want to decouple algorithms from data structures
- When you need to provide a uniform way to iterate different collection types

## When to Avoid

- For very simple collections where direct access is sufficient
- When you need random access to elements (use Indexed Access instead)
- When performance is critical and abstraction overhead is a concern
- When you only use one collection type and won't change it in the future

## Variations

### External vs. Internal Iterators

- **External Iterator**: Client controls the iteration by calling methods like hasNext() and next()
- **Internal Iterator**: Collection handles iteration internally (using callbacks/visitors)

```typescript
// Internal iterator example (forEach style)
class BookCollection {
    private books: Book[] = [];
    
    forEach(callback: (book: Book) => void): void {
        for (const book of this.books) {
            callback(book);
        }
    }
}

// Usage
collection.forEach(book => console.log(book.title));
```

### Bidirectional Iterator

Allows traversal in both forward and backward directions.

```typescript
interface BidirectionalIterator<T> extends Iterator<T> {
    hasPrevious(): boolean;
    previous(): T;
}

class ArrayBidirectionalIterator<T> implements BidirectionalIterator<T> {
    // Standard iterator methods plus:
    hasPrevious(): boolean {
        return this.position > 0;
    }
    
    previous(): T {
        return this.collection[--this.position];
    }
}
```

### Filtered Iterator

Skips elements that don't match a filter predicate.

```typescript
class FilteredIterator<T> implements Iterator<T> {
    constructor(private iterator: Iterator<T>, 
                private predicate: (item: T) => boolean) {}
    
    hasNext(): boolean {
        // Skip elements until finding one that matches predicate
        while (this.iterator.hasNext()) {
            const item = this.iterator.next();
            if (this.predicate(item)) {
                this.nextItem = item;
                return true;
            }
        }
        return false;
    }
    
    next(): T {
        // Return the previously found matching item
        return this.nextItem;
    }
}
```

## Real-World Examples

- Java's Iterator and Iterable interfaces
- JavaScript's Array.prototype.forEach() and Array.prototype.entries()
- C#'s IEnumerable and IEnumerator interfaces
- Python's iter() and next() functions
- Database cursors for traversing query results

## Open-Source Examples

Here are some examples of the Iterator pattern in popular open-source TypeScript projects:

- **TypeORM**: Uses iterators for traversing query results efficiently.
  - [TypeORM EntityManager](https://github.com/typeorm/typeorm/blob/master/src/entity-manager/EntityManager.ts)
  - The QueryRunner and find operations return results that can be iterated over in a consistent way

- **Immutable.js**: This popular immutable collections library implements iterators for its various data structures.
  - [Immutable.js Collection](https://github.com/immutable-js/immutable-js/blob/master/src/Collection.js)
  - All collections implement the iterable interface, allowing consistent traversal regardless of underlying implementation

- **NestJS**: Uses iterators in its module system for scanning and processing metadata.
  - [NestJS Module Scanner](https://github.com/nestjs/nest/blob/master/packages/core/scanner.ts)
  - The ModuleScanner uses iterator patterns to traverse the module dependency graph

## Further Considerations

- **Thread safety**: Be careful with concurrent modifications during iteration
- **Lazy evaluation**: Consider implementing iterators that load data on demand
- **Stream processing**: Modern variations often combine with functional operations (map, filter, reduce)
- **Memory management**: In some cases, avoid materializing entire collections in memory

## Example Case Study

In our book management example:

- We implement various collection types (array, map, set) with a unified iterator interface
- The client code (Library) works with any collection type through this interface
- We demonstrate specialized iterators like a reverse iterator
- We show how to create filtered views without changing the collection
- We maintain encapsulation by hiding the internal structure of each collection

The Iterator pattern allows us to work with complex data structures in a simple, consistent way regardless of their implementation details.