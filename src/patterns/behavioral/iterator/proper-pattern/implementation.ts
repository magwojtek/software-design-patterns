/**
 * Iterator Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Collections hide their internal structure (encapsulation)
 * 2. Common interface for all iterators (polymorphism)
 * 3. Single responsibility: iteration logic is separated from collections
 * 4. Client code works with any collection type without knowing specifics
 * 5. Easy to implement different traversal strategies
 */
import { logger, LogColor } from '~/utils/logger';

/**
 * Book class representing an item in our collections
 */
export class Book {
    constructor(
        public title: string,
        public author: string,
        public year: number,
    ) {}

    toString(): string {
        return `"${this.title}" by ${this.author} (${this.year})`;
    }
}

/**
 * Iterator interface - defines methods all concrete iterators must implement
 */
export interface Iterator<T> {
    // Check if there are more elements
    hasNext(): boolean;

    // Get the current element and move to the next
    next(): T;

    // Reset the iterator to the beginning
    reset(): void;

    // For custom implementation
    toString(): string;
}

/**
 * Collection interface - defines methods all collections must implement
 */
export interface Collection<T> {
    // Create and return an iterator for this collection
    createIterator(): Iterator<T>;

    // Add an item to the collection
    add(item: T): void;

    // Get collection size
    size(): number;

    // For custom implementation
    toString(): string;
}

/**
 * Concrete iterator for BookArray collection
 */
export class ArrayIterator<T> implements Iterator<T> {
    private collection: T[];
    private position: number = 0;

    constructor(collection: T[]) {
        this.collection = collection;
    }

    public hasNext(): boolean {
        return this.position < this.collection.length;
    }

    public next(): T {
        if (!this.hasNext()) {
            throw new Error('No more elements in collection');
        }

        const item = this.collection[this.position];
        this.position++;
        return item;
    }

    public reset(): void {
        this.position = 0;
    }

    public toString(): string {
        return `ArrayIterator (${this.position}/${this.collection.length})`;
    }
}

/**
 * Concrete iterator for BookMap collection
 */
export class MapIterator<K, T> implements Iterator<T> {
    private keys: K[];
    private collection: Map<K, T>;
    private position: number = 0;

    constructor(collection: Map<K, T>) {
        this.collection = collection;
        this.keys = Array.from(collection.keys());
    }

    public hasNext(): boolean {
        return this.position < this.keys.length;
    }

    public next(): T {
        if (!this.hasNext()) {
            throw new Error('No more elements in collection');
        }

        const key = this.keys[this.position];
        const item = this.collection.get(key) as T;
        this.position++;
        return item;
    }

    public reset(): void {
        this.position = 0;
    }

    public toString(): string {
        return `MapIterator (${this.position}/${this.keys.length})`;
    }
}

/**
 * Concrete iterator for BookSet collection
 */
export class SetIterator<T> implements Iterator<T> {
    private items: T[];
    private position: number = 0;

    constructor(collection: Set<T>) {
        this.items = Array.from(collection);
    }

    public hasNext(): boolean {
        return this.position < this.items.length;
    }

    public next(): T {
        if (!this.hasNext()) {
            throw new Error('No more elements in collection');
        }

        const item = this.items[this.position];
        this.position++;
        return item;
    }

    public reset(): void {
        this.position = 0;
    }

    public toString(): string {
        return `SetIterator (${this.position}/${this.items.length})`;
    }
}

/**
 * BookArray - Concrete collection using array
 */
export class BookArray implements Collection<Book> {
    private books: Book[] = [];

    public add(book: Book): void {
        this.books.push(book);
    }

    public createIterator(): Iterator<Book> {
        return new ArrayIterator<Book>(this.books);
    }

    public size(): number {
        return this.books.length;
    }

    public toString(): string {
        return `BookArray (${this.books.length} books)`;
    }
}

/**
 * BookMap - Concrete collection using Map
 */
export class BookMap implements Collection<Book> {
    private books: Map<string, Book> = new Map();

    public add(book: Book): void {
        this.books.set(book.title, book);
    }

    public createIterator(): Iterator<Book> {
        return new MapIterator<string, Book>(this.books);
    }

    public size(): number {
        return this.books.size;
    }

    public toString(): string {
        return `BookMap (${this.books.size} books)`;
    }
}

/**
 * BookSet - Concrete collection using Set
 */
export class BookSet implements Collection<Book> {
    private books: Set<Book> = new Set();

    public add(book: Book): void {
        this.books.add(book);
    }

    public createIterator(): Iterator<Book> {
        return new SetIterator<Book>(this.books);
    }

    public size(): number {
        return this.books.size;
    }

    public toString(): string {
        return `BookSet (${this.books.size} books)`;
    }
}

/**
 * ReverseArrayIterator - Example of an alternative iterator implementation
 * Shows how we can create different traversal strategies
 */
export class ReverseArrayIterator<T> implements Iterator<T> {
    private collection: T[];
    private position: number;

    constructor(collection: T[]) {
        this.collection = collection;
        this.position = collection.length - 1;
    }

    public hasNext(): boolean {
        return this.position >= 0;
    }

    public next(): T {
        if (!this.hasNext()) {
            throw new Error('No more elements in collection');
        }

        const item = this.collection[this.position];
        this.position--;
        return item;
    }

    public reset(): void {
        this.position = this.collection.length - 1;
    }

    public toString(): string {
        return `ReverseArrayIterator (${this.position}/${this.collection.length})`;
    }
}

/**
 * Library - Client code that works with all collections using iterators
 */
export class Library {
    // Display all books in any collection using the iterator
    public displayBooks(
        collection: Collection<Book>,
        name: string = '',
        color: LogColor = LogColor.INFO,
    ): void {
        logger.log(`${name || collection.toString()} contents:`, color);

        const iterator = collection.createIterator();
        let index = 1;

        while (iterator.hasNext()) {
            const book = iterator.next();
            logger.log(`  ${index++}. ${book.toString()}`, color);
        }
    }

    // Find books by specific author in any collection
    public findBooksByAuthor(
        collection: Collection<Book>,
        author: string,
        source: string = '',
    ): void {
        logger.log(`\nBooks by ${author}${source ? ` [from ${source}]` : ''}:`, LogColor.INFO);

        const iterator = collection.createIterator();
        let found = false;

        while (iterator.hasNext()) {
            const book = iterator.next();
            if (book.author === author) {
                logger.log(`  • ${book.toString()}`, LogColor.INFO);
                found = true;
            }
        }

        if (!found) {
            logger.log(`  No books by ${author} found`, LogColor.WARNING);
        }
    }

    // Display books in reverse order (using alternative iterator)
    public displayBooksReversed(books: Book[]): void {
        logger.log('\nBooks in reverse order:', LogColor.INFO);

        // Create a custom reverse iterator
        const reverseIterator = new ReverseArrayIterator<Book>(books);
        let index = books.length;

        while (reverseIterator.hasNext()) {
            const book = reverseIterator.next();
            logger.log(`  ${index--}. ${book.toString()}`, LogColor.INFO);
        }
    }
}
