import { TextEditor, History, TextEditorWithHistory } from './implementation';

describe('Memento Proper Pattern Tests', () => {
    test('TextEditor can create and restore from mementos', () => {
        const editor = new TextEditor();

        editor.type('Initial text');
        const initialState = editor.save();

        editor.type(' - modified');
        expect(editor.getText()).toBe('Initial text - modified');

        editor.restore(initialState);
        expect(editor.getText()).toBe('Initial text');
    });

    test('History manages multiple mementos for undo/redo', () => {
        const editor = new TextEditor();
        const history = new History();

        // Save initial state
        editor.type('First state');
        history.push(editor.save());

        // Make changes and save
        editor.type(' - second state');
        history.push(editor.save());

        editor.type(' - third state');
        history.push(editor.save());

        // Verify current state
        expect(editor.getText()).toBe('First state - second state - third state');

        // Undo twice
        const secondState = history.undo();
        editor.restore(secondState!);
        expect(editor.getText()).toBe('First state - second state');

        const firstState = history.undo();
        editor.restore(firstState!);
        expect(editor.getText()).toBe('First state');

        // Redo once
        const backToSecond = history.redo();
        editor.restore(backToSecond!);
        expect(editor.getText()).toBe('First state - second state');
    });

    test('TextEditorWithHistory provides a complete undo/redo system', () => {
        const editorWithHistory = new TextEditorWithHistory();

        editorWithHistory.type('First state');
        editorWithHistory.save();

        editorWithHistory.type(' - second state');
        editorWithHistory.save();

        editorWithHistory.type(' - third state');
        editorWithHistory.save();

        // Verify current state
        expect(editorWithHistory.getText()).toBe('First state - second state - third state');

        // Undo twice
        editorWithHistory.undo();
        expect(editorWithHistory.getText()).toBe('First state - second state');

        editorWithHistory.undo();
        expect(editorWithHistory.getText()).toBe('First state');

        // Redo once
        editorWithHistory.redo();
        expect(editorWithHistory.getText()).toBe('First state - second state');

        // Make a new change - should discard the redo history
        editorWithHistory.type(' - new path');
        editorWithHistory.save();

        expect(editorWithHistory.getText()).toBe('First state - second state - new path');
        expect(editorWithHistory.canRedo()).toBe(false);
    });

    test('EditorMemento protects state from external modification', () => {
        const editor = new TextEditor();
        editor.type('Protected state');

        const memento = editor.save();

        // Change the editor state
        editor.type(' - modified');
        expect(editor.getText()).toBe('Protected state - modified');

        // Restore from memento
        editor.restore(memento);
        expect(editor.getText()).toBe('Protected state');

        // The memento's internal state cannot be directly modified
        // This is enforced by TypeScript's private access modifiers
    });

    test('demonstrates benefits of the proper pattern implementation', () => {
        const editorWithHistory = new TextEditorWithHistory();

        // Benefit 1: Encapsulation - internal state is protected
        // We can't directly access or modify the text property
        // editorWithHistory.text = 'This would cause a compile error';

        // Benefit 2: History management - maintains multiple snapshots
        editorWithHistory.type('First text');
        editorWithHistory.save();

        editorWithHistory.type(' - append 1');
        editorWithHistory.save();

        editorWithHistory.type(' - append 2');
        editorWithHistory.save();

        // We can undo multiple times
        editorWithHistory.undo();
        editorWithHistory.undo();
        expect(editorWithHistory.getText()).toBe('First text');

        // And redo
        editorWithHistory.redo();
        expect(editorWithHistory.getText()).toBe('First text - append 1');

        // Benefit 3: Clear separation of responsibilities
        // TextEditor (Originator) - creates and restores from mementos
        // EditorMemento - stores state
        // History (Caretaker) - manages mementos without examining their contents

        // Benefit 4: Multiple undo/redo operations
        expect(editorWithHistory.canUndo()).toBe(true);
        expect(editorWithHistory.canRedo()).toBe(true);

        // Benefit 5: Protection from external modification
        // The state in mementos cannot be modified from outside
    });

    test('TextEditorWithHistory handles selection and font style changes', () => {
        const editorWithHistory = new TextEditorWithHistory();

        editorWithHistory.type('The quick brown fox');
        editorWithHistory.save();

        // Select and replace text
        editorWithHistory.select(4, 9);
        editorWithHistory.type('fast');
        editorWithHistory.save();

        expect(editorWithHistory.getText()).toBe('The fast brown fox');

        // Change font style
        editorWithHistory.setFontStyle('bold');
        editorWithHistory.save();

        expect(editorWithHistory.getFontStyle()).toBe('bold');

        // Undo font style change
        editorWithHistory.undo();
        expect(editorWithHistory.getFontStyle()).toBe('normal');

        // Undo text replacement
        editorWithHistory.undo();
        expect(editorWithHistory.getText()).toBe('The quick brown fox');
    });
});
