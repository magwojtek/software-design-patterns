import {
    Book,
    Iterator,
    ArrayIterator,
    MapIterator,
    SetIterator,
    BookArray,
    BookMap,
    BookSet,
    ReverseArrayIterator,
    Library,
} from './implementation';

describe('Iterator Proper Pattern Implementation', () => {
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

    // Test ArrayIterator
    describe('ArrayIterator', () => {
        let iterator: Iterator<Book>;
        const books = [book1, book2, book3];

        beforeEach(() => {
            iterator = new ArrayIterator<Book>(books);
        });

        test('hasNext should return true when there are more elements', () => {
            expect(iterator.hasNext()).toBe(true);
        });

        test('next should return elements in sequence', () => {
            expect(iterator.next()).toBe(book1);
            expect(iterator.next()).toBe(book2);
            expect(iterator.next()).toBe(book3);
            expect(iterator.hasNext()).toBe(false);
        });

        test('reset should restart the iterator', () => {
            iterator.next();
            iterator.next();
            iterator.reset();
            expect(iterator.next()).toBe(book1);
        });

        test('next should throw error when no more elements', () => {
            iterator.next();
            iterator.next();
            iterator.next();
            expect(() => iterator.next()).toThrow('No more elements in collection');
        });

        test('toString should return a descriptive string', () => {
            expect(iterator.toString()).toContain('ArrayIterator');
        });
    });

    // Test MapIterator
    describe('MapIterator', () => {
        let iterator: Iterator<Book>;
        const booksMap = new Map<string, Book>();

        beforeEach(() => {
            booksMap.set(book1.title, book1);
            booksMap.set(book2.title, book2);
            iterator = new MapIterator<string, Book>(booksMap);
        });

        test('hasNext should return true when there are more elements', () => {
            expect(iterator.hasNext()).toBe(true);
        });

        test('next should return all elements eventually', () => {
            const results: Book[] = [];
            while (iterator.hasNext()) {
                results.push(iterator.next());
            }
            expect(results.length).toBe(2);
            expect(results).toContain(book1);
            expect(results).toContain(book2);
        });

        test('reset should restart the iterator', () => {
            iterator.next();
            iterator.reset();
            expect(iterator.hasNext()).toBe(true);
            // We can't test exact sequence with Map since order isn't guaranteed
        });
    });

    // Test SetIterator
    describe('SetIterator', () => {
        let iterator: Iterator<Book>;
        const booksSet = new Set<Book>();

        beforeEach(() => {
            booksSet.add(book1);
            booksSet.add(book2);
            booksSet.add(book1); // Adding duplicate to test Set behavior
            iterator = new SetIterator<Book>(booksSet);
        });

        test('hasNext should return true when there are more elements', () => {
            expect(iterator.hasNext()).toBe(true);
        });

        test('next should return unique elements', () => {
            const results: Book[] = [];
            while (iterator.hasNext()) {
                results.push(iterator.next());
            }
            expect(results.length).toBe(2);
            expect(results).toContain(book1);
            expect(results).toContain(book2);
        });
    });

    // Test ReverseArrayIterator
    describe('ReverseArrayIterator', () => {
        let iterator: Iterator<Book>;
        const books = [book1, book2, book3];

        beforeEach(() => {
            iterator = new ReverseArrayIterator<Book>(books);
        });

        test('hasNext should return true when there are more elements', () => {
            expect(iterator.hasNext()).toBe(true);
        });

        test('next should return elements in reverse sequence', () => {
            expect(iterator.next()).toBe(book3);
            expect(iterator.next()).toBe(book2);
            expect(iterator.next()).toBe(book1);
            expect(iterator.hasNext()).toBe(false);
        });

        test('reset should restart the iterator at the end', () => {
            iterator.next();
            iterator.next();
            iterator.reset();
            expect(iterator.next()).toBe(book3);
        });
    });

    // Test BookArray
    describe('BookArray', () => {
        let bookArray: BookArray;

        beforeEach(() => {
            bookArray = new BookArray();
            bookArray.add(book1);
            bookArray.add(book2);
        });

        test('should add books to the array', () => {
            expect(bookArray.size()).toBe(2);
        });

        test('createIterator should return an ArrayIterator', () => {
            const iterator = bookArray.createIterator();
            expect(iterator).toBeInstanceOf(ArrayIterator);
            expect(iterator.hasNext()).toBe(true);
            expect(iterator.next()).toBe(book1);
        });
    });

    // Test BookMap
    describe('BookMap', () => {
        let bookMap: BookMap;

        beforeEach(() => {
            bookMap = new BookMap();
            bookMap.add(book1);
            bookMap.add(book2);
        });

        test('should add books to the map', () => {
            expect(bookMap.size()).toBe(2);
        });

        test('createIterator should return a MapIterator', () => {
            const iterator = bookMap.createIterator();
            expect(iterator).toBeInstanceOf(MapIterator);
        });
    });

    // Test BookSet
    describe('BookSet', () => {
        let bookSet: BookSet;

        beforeEach(() => {
            bookSet = new BookSet();
            bookSet.add(book1);
            bookSet.add(book2);
            bookSet.add(book1); // Adding duplicate
        });

        test('should add unique books to the set', () => {
            expect(bookSet.size()).toBe(2);
        });

        test('createIterator should return a SetIterator', () => {
            const iterator = bookSet.createIterator();
            expect(iterator).toBeInstanceOf(SetIterator);
        });
    });

    // Test Library
    describe('Library', () => {
        let library: Library;
        let bookArray: BookArray;
        let authorToFind: string;

        beforeEach(() => {
            library = new Library();
            bookArray = new BookArray();
            bookArray.add(book1);
            bookArray.add(book2);
            bookArray.add(book3);
            bookArray.add(book4);
            authorToFind = 'Robert Martin';
        });

        test('displayBooks should not throw errors', () => {
            expect(() => library.displayBooks(bookArray)).not.toThrow();
        });

        test('findBooksByAuthor should not throw errors', () => {
            expect(() => library.findBooksByAuthor(bookArray, authorToFind)).not.toThrow();
        });

        test('displayBooksReversed should not throw errors', () => {
            const books = [book1, book2, book3];
            expect(() => library.displayBooksReversed(books)).not.toThrow();
        });
    });
});
