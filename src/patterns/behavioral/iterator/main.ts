/**
 * Iterator Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Iterator pattern.
 */
import {
    Book as AntiPatternBook,
    BookArray as AntiPatternBookArray,
    BookMap as AntiPatternBookMap,
    BookSet as AntiPatternBookSet,
    Library as AntiPatternLibrary,
} from './anti-pattern/implementation';

import { Book, BookArray, BookMap, BookSet, Library } from './proper-pattern/implementation';

import { runIteratorUsageExample } from './usage';
import { logger, LogColor } from '~/utils/logger';

// Sample books used for both examples
const sampleBooks = [
    { title: 'Design Patterns', author: 'Erich Gamma', year: 1994 },
    { title: 'Clean Code', author: 'Robert Martin', year: 2008 },
    { title: 'Refactoring', author: 'Martin Fowler', year: 1999 },
    { title: 'Domain-Driven Design', author: 'Eric Evans', year: 2003 },
    { title: 'Code Complete', author: 'Steve McConnell', year: 2004 },
    { title: 'Pragmatic Programmer', author: 'Dave Thomas', year: 1999 },
];

/**
 * Demonstrates the anti-pattern approach to the Iterator pattern
 * where different collections have inconsistent interfaces for iteration
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');

    logger.info('Creating collections and adding books:');
    const antiPatternArray = new AntiPatternBookArray();
    const antiPatternMap = new AntiPatternBookMap();
    const antiPatternSet = new AntiPatternBookSet();

    // Add books to all collections
    sampleBooks.forEach(({ title, author, year }) => {
        const book = new AntiPatternBook(title, author, year);
        antiPatternArray.add(book);
        antiPatternMap.add(book);
        antiPatternSet.add(book);
    });

    // Use the anti-pattern Library to display collections
    logger.info('\nDisplaying all collections:');
    const antiPatternLibrary = new AntiPatternLibrary();
    antiPatternLibrary.displayAllCollections(antiPatternArray, antiPatternMap, antiPatternSet);

    // Find books by author in all collections
    logger.info('\nFinding books by Martin Fowler:');
    antiPatternLibrary.findBooksByAuthor(
        'Martin Fowler',
        antiPatternArray,
        antiPatternMap,
        antiPatternSet,
    );

    logger.warn('\nProblems with the anti-pattern:');
    logger.warn('1. Each collection has a different method for iteration');
    logger.warn('2. Client code needs to know details of each collection');
    logger.warn('3. No way to change traversal algorithms without modifying collections');
    logger.warn('4. Tight coupling between collections and client code');
}

/**
 * Demonstrates the proper approach to the Iterator pattern
 * using a common interface for iteration across different collection types
 */
function demonstrateProperPattern(): void {
    logger.success('--- Proper Pattern Example ---');

    logger.info('Creating collections and adding books:');
    const bookArray = new BookArray();
    const bookMap = new BookMap();
    const bookSet = new BookSet();

    // Add books to all collections
    sampleBooks.forEach(({ title, author, year }) => {
        const book = new Book(title, author, year);
        bookArray.add(book);
        bookMap.add(book);
        bookSet.add(book);
    });

    // Use library with unified iterator interface
    const library = new Library();

    // Display all collections using a consistent interface
    logger.info('\nDisplaying all collections using iterators:');
    library.displayBooks(bookArray, 'BookArray', LogColor.INFO);
    library.displayBooks(bookMap, 'BookMap', LogColor.INFO);
    library.displayBooks(bookSet, 'BookSet', LogColor.INFO);

    // Find books by author in all collections using iterators
    logger.info('\nFinding books by Martin Fowler:');
    library.findBooksByAuthor(bookArray, 'Martin Fowler', 'Array');
    library.findBooksByAuthor(bookMap, 'Martin Fowler', 'Map');
    library.findBooksByAuthor(bookSet, 'Martin Fowler', 'Set');

    // Create an array of books for the reverse iterator demonstration
    const booksForReverse = sampleBooks.map(
        ({ title, author, year }) => new Book(title, author, year),
    );
    library.displayBooksReversed(booksForReverse);

    logger.success('\nBenefits of the proper pattern:');
    logger.success('1. Unified interface for iterating different collections');
    logger.success('2. Collections hide their internal implementation (encapsulation)');
    logger.success('3. Single responsibility: iteration logic is separated from collections');
    logger.success('4. Easy to implement different traversal strategies (like reverse iteration)');
    logger.success('5. Client code is decoupled from collection implementations');
}

logger.info('=== Iterator Pattern Example ===\n');

// Demonstrate anti-pattern approach
demonstrateAntiPattern();

// Add a newline for separation
logger.info('');

// Demonstrate proper pattern approach
demonstrateProperPattern();

// Run the usage example showing a more realistic use case
logger.info('\n==================================');
logger.info('Running real-world usage example:');
logger.info('==================================\n');
runIteratorUsageExample();

logger.info('\n=== End of Iterator Pattern Example ===');
