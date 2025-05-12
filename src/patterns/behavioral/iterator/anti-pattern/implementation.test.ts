import { Book, BookArray, BookMap, BookSet, Library } from './implementation';

describe('Iterator Anti-Pattern Implementation', () => {
    // Sample books for testing
    const book1 = new Book('Design Patterns', 'Erich Gamma', 1994);
    const book2 = new Book('Clean Code', 'Robert Martin', 2008);
    const book3 = new Book('Refactoring', 'Martin Fowler', 1999);
    const book4 = new Book('Clean Architecture', 'Robert Martin', 2017);

    // Test Book class
    describe('Book class', () => {
        test('should create a book with title, author, and year', () => {
            expect(book1.title).toBe('Design Patterns');
            expect(book1.author).toBe('Erich Gamma');
            expect(book1.year).toBe(1994);
        });

        test('toString should return formatted book information', () => {
            expect(book1.toString()).toBe('"Design Patterns" by Erich Gamma (1994)');
        });
    });

    // Test BookArray class
    describe('BookArray class', () => {
        let bookArray: BookArray;

        beforeEach(() => {
            bookArray = new BookArray();
            bookArray.add(book1);
            bookArray.add(book2);
        });

        test('should add books to the array', () => {
            expect(bookArray.getBooks().length).toBe(2);
            expect(bookArray.getBooks()[0]).toBe(book1);
            expect(bookArray.getBooks()[1]).toBe(book2);
        });

        test('displayBooks should not throw errors', () => {
            // Since this method uses logger, we just verify it doesn't throw
            expect(() => bookArray.displayBooks()).not.toThrow();
        });
    });

    // Test BookMap class
    describe('BookMap class', () => {
        let bookMap: BookMap;

        beforeEach(() => {
            bookMap = new BookMap();
            bookMap.add(book1);
            bookMap.add(book2);
        });

        test('should add books to the map using title as key', () => {
            expect(bookMap.getBooks().size).toBe(2);
            expect(bookMap.getBooks().get(book1.title)).toBe(book1);
            expect(bookMap.getBooks().get(book2.title)).toBe(book2);
        });

        test('listBooks should not throw errors', () => {
            expect(() => bookMap.listBooks()).not.toThrow();
        });
    });

    // Test BookSet class
    describe('BookSet class', () => {
        let bookSet: BookSet;

        beforeEach(() => {
            bookSet = new BookSet();
            bookSet.add(book1);
            bookSet.add(book2);
            // Adding the same book twice should result in only one entry
            bookSet.add(book1);
        });

        test('should add unique books to the set', () => {
            expect(bookSet.getBooks().size).toBe(2);
            expect(Array.from(bookSet.getBooks())).toContain(book1);
            expect(Array.from(bookSet.getBooks())).toContain(book2);
        });

        test('printBooks should not throw errors', () => {
            expect(() => bookSet.printBooks()).not.toThrow();
        });
    });

    // Test Library class
    describe('Library class', () => {
        let library: Library;
        let bookArray: BookArray;
        let bookMap: BookMap;
        let bookSet: BookSet;

        beforeEach(() => {
            library = new Library();

            // Create and populate collections
            bookArray = new BookArray();
            bookMap = new BookMap();
            bookSet = new BookSet();

            // Add books by Robert Martin to all collections
            bookArray.add(book2); // Clean Code
            bookArray.add(book4); // Clean Architecture

            bookMap.add(book2);
            bookMap.add(book4);

            bookSet.add(book2);
            bookSet.add(book4);

            // Add other books
            bookArray.add(book1); // Design Patterns
            bookMap.add(book1);
            bookSet.add(book1);

            bookArray.add(book3); // Refactoring
            bookMap.add(book3);
            bookSet.add(book3);
        });

        test('displayAllCollections should not throw errors', () => {
            expect(() => library.displayAllCollections(bookArray, bookMap, bookSet)).not.toThrow();
        });

        test('findBooksByAuthor should not throw errors', () => {
            expect(() =>
                library.findBooksByAuthor('Robert Martin', bookArray, bookMap, bookSet),
            ).not.toThrow();
        });
    });
});
