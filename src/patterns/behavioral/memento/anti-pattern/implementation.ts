/**
 * Memento Anti-Pattern
 *
 * Problems with this implementation:
 * 1. No encapsulation of state - internal state is directly exposed
 * 2. No history management - previous states are lost when new changes are made
 * 3. No clear separation between originator and caretaker
 * 4. Difficult to maintain multiple snapshots
 * 5. No protection against external modification of state
 */

export class TextEditor {
    public text: string = '';
    public cursorPosition: number = 0;
    public selectionRange: [number, number] | null = null;
    public fontStyle: string = 'normal';

    // Directly exposing internal state
    public getState(): {
        text: string;
        cursorPosition: number;
        selectionRange: [number, number] | null;
        fontStyle: string;
    } {
        return {
            text: this.text,
            cursorPosition: this.cursorPosition,
            selectionRange: this.selectionRange,
            fontStyle: this.fontStyle,
        };
    }

    // Directly setting internal state
    public setState(state: {
        text: string;
        cursorPosition: number;
        selectionRange: [number, number] | null;
        fontStyle: string;
    }): void {
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

export class SimpleUndoManager {
    private editor: TextEditor;
    private lastState: {
        text: string;
        cursorPosition: number;
        selectionRange: [number, number] | null;
        fontStyle: string;
    } | null = null;

    constructor(editor: TextEditor) {
        this.editor = editor;
    }

    // Save current state for undo
    public saveState(): void {
        this.lastState = this.editor.getState();
    }

    // Restore last saved state
    public undo(): void {
        if (this.lastState) {
            this.editor.setState(this.lastState);
            this.lastState = null; // Can only undo once
        }
    }
}
