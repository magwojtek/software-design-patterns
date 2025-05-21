/**
 * Memento Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Memento pattern.
 */
import { TextEditor, SimpleUndoManager } from './anti-pattern/implementation';
import { TextEditorWithHistory } from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

logger.info('=== Memento Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the Memento pattern
 * with direct state exposure and limited undo functionality.
 */
function demonstrateAntiPattern(): void {
    logger.info('--- Anti-pattern Example ---');
    logger.info('Creating a text editor with simple undo functionality:');

    const editor = new TextEditor();
    const undoManager = new SimpleUndoManager(editor);

    logger.info('\nTyping initial text:');
    editor.type('Hello, world!');
    logger.info(`Text: "${editor.text}"`);
    logger.info(`Cursor position: ${editor.cursorPosition}`);

    // Save state for undo
    undoManager.saveState();
    logger.info('\nSaved current state');

    logger.info('\nSelecting and replacing text:');
    editor.select(7, 12);
    logger.info(`Selection range: [${editor.selectionRange}]`);
    editor.type('universe');
    logger.info(`Text after replacement: "${editor.text}"`);

    logger.info('\nChanging font style:');
    editor.setFontStyle('bold');
    logger.info(`Font style: ${editor.fontStyle}`);

    logger.info('\nUndoing changes:');
    undoManager.undo();
    logger.info(`Text after undo: "${editor.text}"`);
    logger.info(`Font style after undo: ${editor.fontStyle}`);

    logger.info('\nTrying to undo again (should not work):');
    undoManager.undo();
    logger.info(`Text after second undo attempt: "${editor.text}"`);

    logger.info('\nProblems:');
    logger.warn('1. No encapsulation - internal state is directly exposed');
    logger.warn('2. No history management - only one level of undo is supported');
    logger.warn('3. No clear separation between originator and caretaker');
    logger.warn('4. Difficult to maintain multiple snapshots');
    logger.warn('5. No protection against external modification of state\n');
}

/**
 * Demonstrates the proper implementation of the Memento pattern
 * with encapsulated state and full undo/redo functionality.
 */
function demonstrateProperPattern(): void {
    logger.info('--- Proper Pattern Example ---');
    logger.info('Creating a text editor with full history management:');

    const editor = new TextEditorWithHistory();

    logger.info('\nTyping initial text:');
    editor.type('Hello, world!');
    editor.save();
    logger.info(`Text: "${editor.getText()}"`);
    logger.info(`Cursor position: ${editor.getCursorPosition()}`);

    logger.info('\nSelecting and replacing text:');
    editor.select(7, 12);
    logger.info(`Selection range: [${editor.getSelectionRange()}]`);
    editor.type('universe');
    editor.save();
    logger.info(`Text after replacement: "${editor.getText()}"`);

    logger.info('\nChanging font style:');
    editor.setFontStyle('bold');
    editor.save();
    logger.info(`Font style: ${editor.getFontStyle()}`);

    logger.info('\nMaking more changes:');
    editor.type('!');
    editor.save();
    logger.info(`Text after more changes: "${editor.getText()}"`);

    logger.info('\nUndoing changes one by one:');
    editor.undo();
    logger.info(`Text after first undo: "${editor.getText()}"`);
    logger.info(`Font style: ${editor.getFontStyle()}`);

    editor.undo();
    logger.info(`Text after second undo: "${editor.getText()}"`);
    logger.info(`Font style: ${editor.getFontStyle()}`);

    editor.undo();
    logger.info(`Text after third undo: "${editor.getText()}"`);

    logger.info('\nRedoing changes:');
    editor.redo();
    logger.info(`Text after redo: "${editor.getText()}"`);

    logger.info('\nMaking a new change (should clear redo history):');
    editor.type(' - new path');
    editor.save();
    logger.info(`Text after new change: "${editor.getText()}"`);
    logger.info(`Can redo: ${editor.canRedo()}`);

    logger.info('\nBenefits:');
    logger.success('1. Encapsulates state - internal state is protected from external access');
    logger.success('2. Provides history management - maintains multiple snapshots');
    logger.success(
        '3. Clear separation of responsibilities between originator, memento, and caretaker',
    );
    logger.success('4. Supports multiple undo/redo operations');
    logger.success('5. Protects state from external modification');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of Memento Pattern Example ===');
