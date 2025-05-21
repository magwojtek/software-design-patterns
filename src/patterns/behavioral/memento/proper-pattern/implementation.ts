/**
 * Memento Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Encapsulates state - internal state is protected from external access
 * 2. Provides history management - maintains multiple snapshots
 * 3. Clear separation of responsibilities between originator, memento, and caretaker
 * 4. Supports multiple undo/redo operations
 * 5. Protects state from external modification
 */

// Memento - stores the internal state of the TextEditor
export class EditorMemento {
    private readonly text: string;
    private readonly cursorPosition: number;
    private readonly selectionRange: [number, number] | null;
    private readonly fontStyle: string;

    constructor(
        text: string,
        cursorPosition: number,
        selectionRange: [number, number] | null,
        fontStyle: string,
    ) {
        this.text = text;
        this.cursorPosition = cursorPosition;
        this.selectionRange = selectionRange ? [...selectionRange] : null;
        this.fontStyle = fontStyle;
    }

    // Only the originator (TextEditor) can access the state
    // This method is package-private in concept
    getState(): {
        text: string;
        cursorPosition: number;
        selectionRange: [number, number] | null;
        fontStyle: string;
    } {
        return {
            text: this.text,
            cursorPosition: this.cursorPosition,
            selectionRange: this.selectionRange ? [...this.selectionRange] : null,
            fontStyle: this.fontStyle,
        };
    }
}

// Originator - creates and restores from mementos
export class TextEditor {
    private text: string = '';
    private cursorPosition: number = 0;
    private selectionRange: [number, number] | null = null;
    private fontStyle: string = 'normal';

    // Public methods to get specific state for display purposes
    public getText(): string {
        return this.text;
    }

    public getCursorPosition(): number {
        return this.cursorPosition;
    }

    public getSelectionRange(): [number, number] | null {
        return this.selectionRange ? [...this.selectionRange] : null;
    }

    public getFontStyle(): string {
        return this.fontStyle;
    }

    // Create a memento containing the current state
    public save(): EditorMemento {
        return new EditorMemento(
            this.text,
            this.cursorPosition,
            this.selectionRange,
            this.fontStyle,
        );
    }

    // Restore state from a memento
    public restore(memento: EditorMemento): void {
        const state = memento.getState();
        this.text = state.text;
        this.cursorPosition = state.cursorPosition;
        this.selectionRange = state.selectionRange;
        this.fontStyle = state.fontStyle;
    }

    // Operations that modify state
    public type(text: string): void {
        if (this.selectionRange) {
            // Replace selected text
            const [start, end] = this.selectionRange;
            this.text = this.text.substring(0, start) + text + this.text.substring(end);
            this.cursorPosition = start + text.length;
            this.selectionRange = null;
        } else {
            // Insert at cursor position
            this.text =
                this.text.substring(0, this.cursorPosition) +
                text +
                this.text.substring(this.cursorPosition);
            this.cursorPosition += text.length;
        }
    }

    public delete(): void {
        if (this.selectionRange) {
            // Delete selected text
            const [start, end] = this.selectionRange;
            this.text = this.text.substring(0, start) + this.text.substring(end);
            this.cursorPosition = start;
            this.selectionRange = null;
        } else if (this.cursorPosition < this.text.length) {
            // Delete character at cursor position
            this.text =
                this.text.substring(0, this.cursorPosition) +
                this.text.substring(this.cursorPosition + 1);
        }
    }

    public select(start: number, end: number): void {
        if (start >= 0 && end <= this.text.length && start <= end) {
            this.selectionRange = [start, end];
            this.cursorPosition = end;
        }
    }

    public setFontStyle(style: string): void {
        this.fontStyle = style;
    }
}

// Caretaker - manages history of mementos without examining their contents
export class History {
    private mementos: EditorMemento[] = [];
    private currentIndex: number = -1;

    // Add a memento to history, discarding any future states if we're in the middle of history
    public push(memento: EditorMemento): void {
        // If we're not at the end of history, remove all future states
        if (this.currentIndex < this.mementos.length - 1) {
            this.mementos = this.mementos.slice(0, this.currentIndex + 1);
        }

        this.mementos.push(memento);
        this.currentIndex = this.mementos.length - 1;
    }

    // Get the previous memento and move the current index back
    public undo(): EditorMemento | null {
        if (this.currentIndex > 0) {
            return this.mementos[--this.currentIndex];
        }
        return null;
    }

    // Get the next memento and move the current index forward
    public redo(): EditorMemento | null {
        if (this.currentIndex < this.mementos.length - 1) {
            return this.mementos[++this.currentIndex];
        }
        return null;
    }

    // Check if undo is available
    public canUndo(): boolean {
        return this.currentIndex > 0;
    }

    // Check if redo is available
    public canRedo(): boolean {
        return this.currentIndex < this.mementos.length - 1;
    }

    // Get the number of saved states
    public getHistorySize(): number {
        return this.mementos.length;
    }
}

// Client-facing class that combines the TextEditor and History
export class TextEditorWithHistory {
    private editor: TextEditor = new TextEditor();
    private history: History = new History();
    private saveNeeded: boolean = false;

    constructor() {
        // Save initial state
        this.saveState();
    }

    // Getters to access editor state
    public getText(): string {
        return this.editor.getText();
    }

    public getCursorPosition(): number {
        return this.editor.getCursorPosition();
    }

    public getSelectionRange(): [number, number] | null {
        return this.editor.getSelectionRange();
    }

    public getFontStyle(): string {
        return this.editor.getFontStyle();
    }

    // Save current state to history
    private saveState(): void {
        this.history.push(this.editor.save());
        this.saveNeeded = false;
    }

    // Operations with automatic state saving
    public type(text: string): void {
        this.editor.type(text);
        this.saveNeeded = true;
    }

    public delete(): void {
        this.editor.delete();
        this.saveNeeded = true;
    }

    public select(start: number, end: number): void {
        this.editor.select(start, end);
        this.saveNeeded = true;
    }

    public setFontStyle(style: string): void {
        this.editor.setFontStyle(style);
        this.saveNeeded = true;
    }

    // Explicitly save state (for example, after a batch of operations)
    public save(): void {
        if (this.saveNeeded) {
            this.saveState();
        }
    }

    // Undo the last operation
    public undo(): boolean {
        const memento = this.history.undo();
        if (memento) {
            this.editor.restore(memento);
            this.saveNeeded = false;
            return true;
        }
        return false;
    }

    // Redo a previously undone operation
    public redo(): boolean {
        const memento = this.history.redo();
        if (memento) {
            this.editor.restore(memento);
            this.saveNeeded = false;
            return true;
        }
        return false;
    }

    // Check if undo is available
    public canUndo(): boolean {
        return this.history.canUndo();
    }

    // Check if redo is available
    public canRedo(): boolean {
        return this.history.canRedo();
    }

    // Get the number of saved states
    public getHistorySize(): number {
        return this.history.getHistorySize();
    }
}
