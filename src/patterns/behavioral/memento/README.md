# Memento Pattern

## Overview

The Memento pattern is a behavioral design pattern that lets you save and restore the previous state of an object without revealing the details of its implementation. It provides a way to capture an object's internal state so that the object can later be restored to that state.

## Problem

In many applications, we need to implement undo/redo functionality or maintain a history of object states:

- Applications need to provide undo/redo functionality
- We need to save snapshots of an object's state at different points in time
- We want to restore an object to a previous state
- We need to maintain the object's encapsulation while saving its state
- We want to prevent direct access to the object's internal state

## Diagram

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│         Originator          │      │          Memento            │
├─────────────────────────────┤      ├─────────────────────────────┤
│ - state                     │      │ - state (private)           │
├─────────────────────────────┤      ├─────────────────────────────┤
│ + save(): Memento           │─────▶│ + getState() (restricted)   │
│ + restore(m: Memento): void │◀─────│                             │
└─────────────────────────────┘      └─────────────────────────────┘
                                                    ▲
                                                    │ manages
                                                    │
                                      ┌─────────────────────────────┐
                                      │         Caretaker           │
                                      ├─────────────────────────────┤
                                      │ - mementos: Memento[]       │
                                      ├─────────────────────────────┤
                                      │ + addMemento(m: Memento)    │
                                      │ + getMemento(index): Memento│
                                      └─────────────────────────────┘
```

## Scenario

Imagine you're building a text editor that needs to support undo/redo functionality. Users expect to be able to undo their changes when they make mistakes and redo them if they change their mind.

**The problem:**
1. The text editor needs to save its state at different points in time
2. The state includes text content, cursor position, selection, and formatting
3. We need to restore the editor to previous states
4. We want to maintain the editor's encapsulation
5. We need to manage multiple snapshots for a full undo/redo history

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing the Memento pattern typically involves directly exposing an object's state and providing limited history management.

#### Pseudo Code (Anti-Pattern)

```typescript
// The editor directly exposes its internal state
export class TextEditor {
    public text: string = '';
    public cursorPosition: number = 0;
    public selectionRange: [number, number] | null = null;
    public fontStyle: string = 'normal';
    
    // Directly exposing internal state
    public getState(): { text: string; cursorPosition: number; selectionRange: [number, number] | null; fontStyle: string } {
        return {
            text: this.text,
            cursorPosition: this.cursorPosition,
            selectionRange: this.selectionRange,
            fontStyle: this.fontStyle
        };
    }
    
    // Directly setting internal state
    public setState(state: { text: string; cursorPosition: number; selectionRange: [number, number] | null; fontStyle: string }): void {
        this.text = state.text;
        this.cursorPosition = state.cursorPosition;
        this.selectionRange = state.selectionRange;
        this.fontStyle = state.fontStyle;
    }
    
    // Operations that modify state
    public type(text: string): void {
        // Implementation...
    }
    
    public delete(): void {
        // Implementation...
    }
    
    public select(start: number, end: number): void {
        // Implementation...
    }
    
    public setFontStyle(style: string): void {
        this.fontStyle = style;
    }
}

// Simple undo manager with only one level of history
export class SimpleUndoManager {
    private editor: TextEditor;
    private lastState: { text: string; cursorPosition: number; selectionRange: [number, number] | null; fontStyle: string } | null = null;
    
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

// Usage
const editor = new TextEditor();
const undoManager = new SimpleUndoManager(editor);

editor.type('Hello');
undoManager.saveState();

editor.type(' World');
console.log(editor.text); // "Hello World"

undoManager.undo();
console.log(editor.text); // "Hello"

// Direct state manipulation is possible
editor.text = 'Directly modified';
```

#### Anti-Pattern Diagram

```
┌───────────────────────────┐     ┌───────────────────────────┐
│        TextEditor         │     │     SimpleUndoManager     │
├───────────────────────────┤     ├───────────────────────────┤
│ + text: string            │     │ - lastState: Object       │
│ + cursorPosition: number  │     │ - editor: TextEditor      │
│ + selectionRange: array   │     ├───────────────────────────┤
│ + fontStyle: string       │     │ + saveState()             │
├───────────────────────────┤     │ + undo()                  │
│ + getState()              │◀────┼───────────────────────────┘
│ + setState()              │◀────┘
└───────────────────────────┘      
                                    
         ┌───────────────────────────────────────┐
         │                                       │
         │  Problems:                            │
         │  - Direct access to internal state    │
         │  - Only one level of undo             │
         │  - No protection against modification │
         │  - No clear separation of concerns    │
         │                                       │
         └───────────────────────────────────────┘
```

#### Issues with Anti-Pattern:

1. **No encapsulation**: Internal state is directly exposed and can be modified from outside
2. **No history management**: Only one level of undo is supported
3. **No clear separation**: No clear separation between originator and caretaker
4. **Limited functionality**: Difficult to maintain multiple snapshots
5. **No protection**: No protection against external modification of state

### Proper Pattern Implementation

The proper implementation uses the Memento pattern with clear separation of responsibilities and full history management.

#### Pseudo Code (Proper Pattern)

```typescript
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
        fontStyle: string
    ) {
        this.text = text;
        this.cursorPosition = cursorPosition;
        this.selectionRange = selectionRange ? [...selectionRange] : null;
        this.fontStyle = fontStyle;
    }
    
    // Only the originator (TextEditor) can access the state
    getState(): { text: string; cursorPosition: number; selectionRange: [number, number] | null; fontStyle: string } {
        return {
            text: this.text,
            cursorPosition: this.cursorPosition,
            selectionRange: this.selectionRange ? [...this.selectionRange] : null,
            fontStyle: this.fontStyle
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
    
    // Other getters...
    
    // Create a memento containing the current state
    public save(): EditorMemento {
        return new EditorMemento(
            this.text,
            this.cursorPosition,
            this.selectionRange,
            this.fontStyle
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
        // Implementation...
    }
    
    // Other operations...
}

// Caretaker - manages history of mementos without examining their contents
export class History {
    private mementos: EditorMemento[] = [];
    private currentIndex: number = -1;
    
    // Add a memento to history
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
}

// Usage
const editor = new TextEditor();
const history = new History();

// Initial state
editor.type('Hello');
history.push(editor.save());

// Make changes
editor.type(' World');
history.push(editor.save());

console.log(editor.getText()); // "Hello World"

// Undo
const previousState = history.undo();
if (previousState) {
    editor.restore(previousState);
}
console.log(editor.getText()); // "Hello"

// Redo
const nextState = history.redo();
if (nextState) {
    editor.restore(nextState);
}
console.log(editor.getText()); // "Hello World"
```

#### Proper Pattern Diagram

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│        TextEditor           │      │       EditorMemento         │
├─────────────────────────────┤      ├─────────────────────────────┤
│ - text: string              │      │ - text: string (private)    │
│ - cursorPosition: number    │      │ - cursorPosition (private)  │
│ - selectionRange: array     │      │ - selectionRange (private)  │
│ - fontStyle: string         │      │ - fontStyle (private)       │
├─────────────────────────────┤      ├─────────────────────────────┤
│ + getText(): string         │      │ + getState() (restricted)   │
│ + getCursorPosition()       │      │                             │
│ + getSelectionRange()       │      │                             │
│ + getFontStyle()            │      │                             │
│ + save(): EditorMemento     │─────▶│                             │
│ + restore(m: EditorMemento) │◀─────│                             │
│ + type(text: string)        │      └─────────────────────────────┘
│ + delete()                  │                    ▲
│ + select(start, end)        │                    │ manages
│ + setFontStyle(style)       │                    │
└─────────────────────────────┘      ┌─────────────────────────────┐
                                     │          History            │
                                     ├─────────────────────────────┤
                                     │ - mementos: EditorMemento[] │
                                     │ - currentIndex: number      │
                                     ├─────────────────────────────┤
                                     │ + push(memento)             │
                                     │ + undo(): EditorMemento     │
                                     │ + redo(): EditorMemento     │
                                     │ + canUndo(): boolean        │
                                     │ + canRedo(): boolean        │
                                     └─────────────────────────────┘
```

#### Benefits of Proper Pattern:

1. **Encapsulation**: Internal state is protected from external access
2. **History management**: Maintains multiple snapshots for undo/redo
3. **Clear separation**: Clear separation of responsibilities between originator, memento, and caretaker
4. **Full functionality**: Supports multiple undo/redo operations
5. **Protection**: Protects state from external modification

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
    ┌───────────────────┐      ┌───────────────────┐
    │    TextEditor     │      │ SimpleUndoManager │
    │                   │      │                   │
    │ + public state    │◀─────│ - lastState       │
    │ + getState()      │      │ + saveState()     │
    │ + setState()      │      │ + undo()          │
    └───────────────────┘      └───────────────────┘
    
    - Direct access to internal state
    - Only one level of undo
    - No protection against external modification

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘
    ┌───────────────────┐      ┌───────────────────┐
    │    TextEditor     │      │   EditorMemento   │
    │                   │─────▶│                   │
    │ - private state   │      │ - private state   │
    │ + save()          │      │ + getState()      │
    │ + restore()       │◀─────│ (restricted)      │
    └───────────────────┘      └───────────────────┘
              ▲                         ▲
              │                         │
              │                         │
    ┌──────────────────────────────────────┐
    │              History                 │
    │                                      │
    │ - mementos[]                         │
    │ + push(), undo(), redo()             │
    └──────────────────────────────────────┘
    
    - Encapsulated state
    - Multiple undo/redo levels
    - Clear separation of responsibilities
```

## Best Practices

1. Make the Memento immutable to prevent accidental changes to saved states
2. Restrict access to the Memento's state to only the Originator
3. Consider using serialization for complex states or to persist states
4. Implement a clear strategy for managing history size to prevent memory issues
5. Consider using the Command pattern alongside Memento for more complex undo/redo systems
6. Provide clear methods for checking if undo/redo operations are available

## When to Use

- When you need to implement undo/redo functionality
- When you need to create snapshots of an object's state
- When direct access to an object's fields/getters/setters would violate encapsulation
- When you need to maintain a history of state changes
- When you want to restore an object to a previous state

## When to Avoid

- When saving and restoring state would be very expensive in terms of memory or performance
- When the object's state is simple and doesn't need encapsulation
- When you don't need a history of states, just the current state
- When the object's state changes very frequently, making it impractical to save all states

## Variations

### Incremental Memento

Instead of storing the complete state in each memento, store only the differences between states:

```typescript
class IncrementalMemento {
    private readonly changes: any;
    private readonly previousMemento: IncrementalMemento | null;
    
    constructor(changes: any, previousMemento: IncrementalMemento | null) {
        this.changes = changes;
        this.previousMemento = previousMemento;
    }
    
    getState(): any {
        // Reconstruct the full state by applying all changes
        let state = {};
        if (this.previousMemento) {
            state = {...this.previousMemento.getState()};
        }
        return {...state, ...this.changes};
    }
}
```

### Memento with Serialization

For persistence across sessions, serialize the memento:

```typescript
class SerializableMemento {
    private readonly serializedState: string;
    
    constructor(state: any) {
        this.serializedState = JSON.stringify(state);
    }
    
    getState(): any {
        return JSON.parse(this.serializedState);
    }
    
    // Save to storage
    saveToStorage(key: string): void {
        localStorage.setItem(key, this.serializedState);
    }
    
    // Load from storage
    static loadFromStorage(key: string): SerializableMemento | null {
        const serialized = localStorage.getItem(key);
        if (serialized) {
            return new SerializableMemento(JSON.parse(serialized));
        }
        return null;
    }
}
```

### Memento vs Command Pattern

Both patterns can be used for undo/redo functionality, but they work differently:

- **Memento**: Captures and externalizes an object's internal state so it can be restored later
- **Command**: Encapsulates a request as an object, allowing for parameterization, queueing, logging, and undoable operations

They can be combined: Command pattern can use Memento to store the state needed for undoing operations.

## Real-World Applications

The Memento pattern is widely used in various applications:

1. **Text editors**: For undo/redo functionality
2. **Graphics editors**: To restore previous states of an image or drawing
3. **Version control systems**: To save snapshots of file systems
4. **Database transactions**: To rollback changes if a transaction fails
5. **Game development**: To save and restore game states

## Open-Source Examples

Many popular TypeScript libraries and frameworks use the Memento pattern. Here are some real-world examples:

### 1. Redux with TypeScript

Redux implements a variation of the Memento pattern for managing application state, and it works well with TypeScript:

```typescript
import { createStore, Action } from 'redux';

// Define state interface
interface AppState {
  items: Array<{ id: number; name: string }>;
}

// Define action types
type RestoreStateAction = Action<'RESTORE_STATE'> & { payload: AppState };
type AddItemAction = Action<'ADD_ITEM'> & { payload: { id: number; name: string } };

type AppAction = RestoreStateAction | AddItemAction;

// Reducer function
const reducer = (state: AppState = { items: [] }, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'RESTORE_STATE':
      return action.payload;
    default:
      return state;
  }
};

// Create store (originator and caretaker)
const store = createStore(reducer);

// Capture state (create memento)
const savedState = store.getState();

// Dispatch actions that modify state
store.dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Item 1' } });

// Restore previous state
store.dispatch({ type: 'RESTORE_STATE', payload: savedState });
```

### 2. Angular's NgRx State Management

NgRx is a state management library for Angular applications that uses the Memento pattern with TypeScript:

```typescript
import { createAction, createReducer, on, props, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

// Define state interface
interface EditorState {
  content: string;
  cursorPosition: number;
  fontStyle: string;
}

// Define actions (commands that change state)
const updateContent = createAction('[Editor] Update Content', props<{ content: string }>());
const saveState = createAction('[Editor] Save State');
const restoreState = createAction('[Editor] Restore State', props<{ state: EditorState }>());

// Initial state
const initialState: EditorState = {
  content: '',
  cursorPosition: 0,
  fontStyle: 'normal'
};

// Reducer (handles state transitions)
const editorReducer = createReducer(
  initialState,
  on(updateContent, (state, { content }) => ({
    ...state,
    content
  })),
  on(restoreState, (_, { state }) => state)
);

// Service that manages history (caretaker)
@Injectable({ providedIn: 'root' })
export class EditorHistoryService {
  private history: EditorState[] = [];
  
  constructor(private store: Store<{ editor: EditorState }>) {
    // Listen for save state actions
    this.store.select(state => state.editor).subscribe(editorState => {
      this.history.push({ ...editorState });
    });
  }
  
  // Restore to a previous state
  restorePrevious(): void {
    if (this.history.length > 1) {
      // Remove current state
      this.history.pop();
      // Get previous state
      const previousState = this.history[this.history.length - 1];
      // Dispatch restore action
      this.store.dispatch(restoreState({ state: previousState }));
    }
  }
}
```

### 3. TypeScript Implementation in VS Code

VS Code, which is built with TypeScript, uses the Memento pattern for its undo/redo functionality in the editor:

```typescript
// Simplified version of VS Code's text model memento pattern

interface ITextSnapshot {
  read(): string;
}

class TextModelSnapshot implements ITextSnapshot {
  constructor(
    private readonly content: string,
    private readonly eol: string,
    private readonly versionId: number
  ) {}

  public read(): string {
    return this.content;
  }

  public getVersionId(): number {
    return this.versionId;
  }
}

class TextModel {
  private content: string = '';
  private versionId: number = 1;
  private readonly eol: string = '\n';

  // Create a memento
  public createSnapshot(): ITextSnapshot {
    return new TextModelSnapshot(this.content, this.eol, this.versionId);
  }

  // Modify content
  public setValue(content: string): void {
    this.content = content;
    this.versionId++;
  }

  // Get current content
  public getValue(): string {
    return this.content;
  }
}

// Usage in editor
class Editor {
  private model: TextModel = new TextModel();
  private history: ITextSnapshot[] = [];
  private historyIndex: number = -1;

  public type(text: string): void {
    // Save current state before modification
    this.saveState();
    
    // Update content
    const currentContent = this.model.getValue();
    this.model.setValue(currentContent + text);
  }

  private saveState(): void {
    // If we're not at the end of history, remove future states
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Add current state to history
    this.history.push(this.model.createSnapshot());
    this.historyIndex = this.history.length - 1;
  }

  public undo(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const snapshot = this.history[this.historyIndex];
      this.model.setValue(snapshot.read());
      return true;
    }
    return false;
  }

  public redo(): boolean {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const snapshot = this.history[this.historyIndex];
      this.model.setValue(snapshot.read());
      return true;
    }
    return false;
  }
}
```

## Conclusion

The Memento pattern provides a clean way to implement undo/redo functionality and state management while maintaining encapsulation. By separating the responsibilities of state creation, storage, and restoration between the Originator, Memento, and Caretaker, the pattern creates a flexible and maintainable solution for capturing and restoring object states.
