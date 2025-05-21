import { TextEditor, SimpleUndoManager } from './implementation';

describe('Memento Anti-Pattern Tests', () => {
    test('TextEditor can modify text and track cursor position', () => {
        const editor = new TextEditor();

        editor.type('Hello');
        expect(editor.text).toBe('Hello');
        expect(editor.cursorPosition).toBe(5);

        editor.type(' World');
        expect(editor.text).toBe('Hello World');
        expect(editor.cursorPosition).toBe(11);
    });

    test('TextEditor can select and replace text', () => {
        const editor = new TextEditor();

        editor.type('Hello World');
        editor.select(6, 11);
        expect(editor.selectionRange).toEqual([6, 11]);

        editor.type('Universe');
        expect(editor.text).toBe('Hello Universe');
        expect(editor.selectionRange).toBe(null);
        expect(editor.cursorPosition).toBe(14);
    });

    test('SimpleUndoManager can only undo once', () => {
        const editor = new TextEditor();
        const undoManager = new SimpleUndoManager(editor);

        editor.type('First state');
        undoManager.saveState();

        editor.type(' - modified');
        expect(editor.text).toBe('First state - modified');

        undoManager.undo();
        expect(editor.text).toBe('First state');

        // Type new text
        editor.type(' - new changes');
        expect(editor.text).toBe('First state - new changes');

        // Try to undo again - should not work as we can only undo once
        undoManager.undo();
        expect(editor.text).toBe('First state - new changes');
    });

    test('demonstrates problems with anti-pattern implementation', () => {
        const editor = new TextEditor();
        const undoManager = new SimpleUndoManager(editor);

        // Problem 2: No history management - previous states are lost
        editor.type('First text');
        undoManager.saveState();

        editor.type(' - append 1');
        undoManager.saveState(); // This overwrites the previous saved state

        editor.type(' - append 2');
        expect(editor.text).toBe('First text - append 1 - append 2');

        undoManager.undo();
        // We can only go back to "First text - append 1", not to "First text"
        expect(editor.text).toBe('First text - append 1');

        // Problem 1: No encapsulation - internal state is directly exposed
        editor.text = 'Directly modified';
        expect(editor.text).toBe('Directly modified');

        // Problem 3: No clear separation between originator and caretaker
        // The UndoManager directly accesses and modifies the editor's internal state
        // We can see the implementation details of the UndoManager
        expect(undoManager).toHaveProperty('editor');
        expect(undoManager).toHaveProperty('lastState');

        // Problem 4: Difficult to maintain multiple snapshots
        // We would need to manually create an array of states
        const manualStates: {
            text: string;
            cursorPosition: number;
            selectionRange: [number, number] | null;
            fontStyle: string;
        }[] = [];
        editor.text = 'State 1';
        manualStates.push(editor.getState());
        editor.text = 'State 2';
        manualStates.push(editor.getState());
        expect(manualStates.length).toBe(2);

        // Problem 5: No protection against external modification of state
        const savedState = editor.getState();
        savedState.text = 'Modified externally';

        // This would modify the saved state that should be immutable
        expect(savedState.text).toBe('Modified externally');
    });
});
