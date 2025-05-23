/**
 * Iterator Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Collection classes expose their internal structure (tight coupling)
 * 2. Different collection types have different traversal methods
 * 3. Each collection implements its own traversal logic
 * 4. Client code needs to know the specifics of each collection type
 * 5. Hard to switch between different traversal strategies
 */
import { logger } from '~/utils/logger';

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
 * BookArray - A collection that uses a simple array
 * Anti-pattern: Exposes internal array structure directly
 */
export class BookArray {
    private books: Book[] = [];

    add(book: Book): void {
        this.books.push(book);
    }

    // Anti-pattern: Directly exposing internal structure
    getBooks(): Book[] {
        return this.books;
    }

    // Anti-pattern: Collection-specific traversal method
    displayBooks(): void {
        logger.info('BookArray contents:');
        for (let i = 0; i < this.books.length; i++) {
            logger.info(`  ${i + 1}. ${this.books[i].toString()}`);
        }
    }
}

/**
 * BookMap - A collection that uses a Map
 * Anti-pattern: Different implementation from BookArray
 */
export class BookMap {
    private books: Map<string, Book> = new Map();

    add(book: Book): void {
        this.books.set(book.title, book);
    }

    // Anti-pattern: Directly exposing internal structure
    getBooks(): Map<string, Book> {
        return this.books;
    }

    // Anti-pattern: Different traversal method than BookArray
    listBooks(): void {
        logger.info('BookMap contents:');
        this.books.forEach((book) => {
            logger.info(`  - ${book.toString()}`);
        });
    }
}

/**
 * BookSet - A collection that uses a Set
 * Anti-pattern: Yet another different implementation
 */
export class BookSet {
    private books: Set<Book> = new Set();

    add(book: Book): void {
        this.books.add(book);
    }

    // Anti-pattern: Directly exposing internal structure
    getBooks(): Set<Book> {
        return this.books;
    }

    // Anti-pattern: Different iteration method again
    printBooks(): void {
        logger.info('BookSet contents:');
        const booksArray = Array.from(this.books);
        for (let i = 0; i < booksArray.length; i++) {
            logger.info(`  • ${booksArray[i].toString()}`);
        }
    }
}

/**
 * Client code that needs to work with all three collection types
 * Anti-pattern: Client needs to know how to work with each type specifically
 */
export class Library {
    displayAllCollections(array: BookArray, map: BookMap, set: BookSet): void {
        // Need to use different methods for each collection type
        array.displayBooks();
        map.listBooks();
        set.printBooks();

        logger.warn('\nProblem: Need to handle each collection type differently');
    }

    // Anti-pattern: Filtering requires knowledge of internal structures
    findBooksByAuthor(author: string, array: BookArray, map: BookMap, set: BookSet): void {
        logger.info(`\nBooks by ${author}:`);

        // Different iteration for array
        const arrayBooks = array.getBooks();
        for (let i = 0; i < arrayBooks.length; i++) {
            if (arrayBooks[i].author === author) {
                logger.info(`  • ${arrayBooks[i].toString()} [from array]`);
            }
        }

        // Different iteration for map
        const mapBooks = map.getBooks();
        mapBooks.forEach((book) => {
            if (book.author === author) {
                logger.info(`  • ${book.toString()} [from map]`);
            }
        });

        // Different iteration for set
        const setBooks = Array.from(set.getBooks());
        for (const book of setBooks) {
            if (book.author === author) {
                logger.info(`  • ${book.toString()} [from set]`);
            }
        }
    }
}
