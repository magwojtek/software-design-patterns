# State Pattern

## Overview

The State Pattern is a behavioral design pattern that allows an object to alter its behavior when its internal state changes. The object will appear to change its class as its behavior changes based on its state.

## Problem

In many applications, an object's behavior depends on its state, and it must change its behavior at runtime depending on that state:

- Using conditional statements to handle different states leads to complex, hard-to-maintain code
- Adding new states requires modifying existing code in multiple places
- State transitions are scattered throughout the code
- The relationship between states is unclear and difficult to understand
- Code becomes more error-prone as the number of states increases

## Diagram

```
┌───────────────────────────┐      ┌───────────────────────────┐
│         Context           │      │      «interface»          │
│      (Document)           │      │     DocumentState         │
├───────────────────────────┤      ├───────────────────────────┤
│ - state: DocumentState    │◆─────│ + submitForReview()       │
├───────────────────────────┤      │ + publish()               │
│ + changeState()           │      │ + reject()                │
│ + submitForReview()       │      │ + edit()                  │
│ + publish()               │      │ + getName()               │
│ + reject()                │      └─────────────┬─────────────┘
│ + edit()                  │                    │
│ + getStateName()          │                    │
└───────────────────────────┘                    │
                                                 │
          ┌───────────────────────────┐          │          ┌───────────────────────────┐
          │      DraftState           │◄─────────┼──────────│     ModerationState       │
          ├───────────────────────────┤          │          ├───────────────────────────┤
          │ + submitForReview()       │          │          │ + submitForReview()       │
          │ + publish()               │          │          │ + publish()               │
          │ + reject()                │          │          │ + reject()                │
          │ + edit()                  │          │          │ + edit()                  │
          │ + getName()               │          │          │ + getName()               │
          └───────────────────────────┘          │          └───────────────────────────┘
                                                 │
          ┌───────────────────────────┐          │          ┌───────────────────────────┐
          │     PublishedState        │◄─────────┼──────────│      RejectedState        │
          ├───────────────────────────┤          │          ├───────────────────────────┤
          │ + submitForReview()       │          │          │ + submitForReview()       │
          │ + publish()               │          │          │ + publish()               │
          │ + reject()                │          │          │ + reject()                │
          │ + edit()                  │          │          │ + edit()                  │
          │ + getName()               │          │          │ + getName()               │
          └───────────────────────────┘          │          └───────────────────────────┘
```

## Scenario

Imagine you're building a document management system where documents go through different states in their lifecycle: Draft, Moderation, Published, and Rejected. Each state has different rules about what actions can be performed on the document.

**The problem:**
1. Each document state has different behavior for the same actions (submit, publish, reject, edit)
2. Documents transition between states based on specific actions
3. The rules for state transitions are complex and may change over time
4. We need to be able to add new states without modifying existing code
5. We want to keep the state-specific behavior encapsulated and separate from the document itself

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing state behavior typically involves using conditional statements (if/else or switch) to handle different states and their transitions.

#### Pseudo Code (Anti-Pattern)

```typescript
// The context class manages state with conditionals
export class DocumentAntiPattern {
    private state: string = 'draft';

    // Request for moderation
    public submitForReview(): void {
        if (this.state === 'draft') {
            this.state = 'moderation';
            // Logic for draft -> moderation
        } else if (this.state === 'moderation') {
            // Logic for already in moderation
        } else if (this.state === 'published') {
            // Logic for published state
        } else if (this.state === 'rejected') {
            this.state = 'moderation';
            // Logic for rejected -> moderation
        }
    }

    // Publish the document
    public publish(): void {
        if (this.state === 'draft') {
            // Logic for draft state
        } else if (this.state === 'moderation') {
            this.state = 'published';
            // Logic for moderation -> published
        } else if (this.state === 'published') {
            // Logic for already published
        } else if (this.state === 'rejected') {
            // Logic for rejected state
        }
    }

    // Other methods with similar conditional structures
    public reject(): void { /* ... */ }
    public edit(): void { /* ... */ }
}

// Usage
const document = new DocumentAntiPattern();
document.submitForReview(); // Changes state to 'moderation'
document.publish(); // Changes state to 'published'
```

#### Anti-Pattern Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                  DocumentAntiPattern                              │
├───────────────────────────────────────────────────────────────────┤
│ - state: DocumentState (enum)                                     │
├───────────────────────────────────────────────────────────────────┤
│ + submitForReview()                                               │
│   if (state === DocumentState.DRAFT) -> MODERATION                │
│   if (state === DocumentState.MODERATION) -> no change            │
│   if (state === DocumentState.PUBLISHED) -> no change             │
│   if (state === DocumentState.REJECTED) -> MODERATION             │
│                                                                   │
│ + publish()                                                       │
│   if (state === DocumentState.DRAFT) -> no change                 │
│   if (state === DocumentState.MODERATION) -> PUBLISHED            │
│   if (state === DocumentState.PUBLISHED) -> no change             │
│   if (state === DocumentState.REJECTED) -> no change              │
│                                                                   │
│ + reject()                                                        │
│   if (state === DocumentState.DRAFT) -> no change                 │
│   if (state === DocumentState.MODERATION) -> REJECTED             │
│   if (state === DocumentState.PUBLISHED) -> no change             │
│   if (state === DocumentState.REJECTED) -> no change              │
│                                                                   │
│ + edit()                                                          │
│   if (state === DocumentState.*) -> DRAFT in most cases           │ś
└───────────────────────────────────────────────────────────────────┘
```

#### Issues with Anti-Pattern:

1. **Conditional complexity**: As the number of states and actions increases, the conditional statements become more complex
2. **Code duplication**: Similar conditional structures are repeated in each method
3. **Hard to maintain**: Adding a new state requires modifying every method with conditional logic
4. **Error-prone**: Easy to miss a state transition or make a mistake in the conditional logic
5. **Violates Open/Closed Principle**: Existing code must be modified to add new states

### Proper Pattern Implementation

The proper implementation uses separate state classes that encapsulate state-specific behavior and handle state transitions.

#### Pseudo Code (Proper Pattern)

```typescript
// The State interface declares methods for all state-specific behaviors
interface DocumentState {
    submitForReview(context: Document): void;
    publish(context: Document): void;
    reject(context: Document): void;
    edit(context: Document): void;
    getName(): string;
}

// The Context class maintains a reference to the current state
class Document {
    private state: DocumentState;

    constructor() {
        // Initial state is Draft
        this.state = new DraftState();
    }

    // Change the current state
    public changeState(state: DocumentState): void {
        this.state = state;
    }

    // Delegate behavior to the current state
    public submitForReview(): void {
        this.state.submitForReview(this);
    }

    public publish(): void {
        this.state.publish(this);
    }

    public reject(): void {
        this.state.reject(this);
    }

    public edit(): void {
        this.state.edit(this);
    }
}

// Concrete State: Draft
class DraftState implements DocumentState {
    public submitForReview(context: Document): void {
        // Logic for submitting from draft state
        context.changeState(new ModerationState());
    }

    public publish(context: Document): void {
        // Logic for publishing from draft state (not allowed)
    }

    // Other methods...
    
    public getName(): string {
        return 'Draft';
    }
}

// Concrete State: Moderation
class ModerationState implements DocumentState {
    public submitForReview(context: Document): void {
        // Logic for submitting from moderation state
    }

    public publish(context: Document): void {
        // Logic for publishing from moderation state
        context.changeState(new PublishedState());
    }

    // Other methods...
    
    public getName(): string {
        return 'Moderation';
    }
}

// Other concrete state classes...

// Usage
const document = new Document(); // Starts in Draft state
document.submitForReview(); // State changes to Moderation
document.publish(); // State changes to Published
```

#### Proper Pattern Diagram

```
┌─────────────────────────┐      ┌───────────────────────┐
│        Document         │      │    DocumentState      │
├─────────────────────────┤      ├───────────────────────┤
│ - state: DocumentState  │◆─────│ + submitForReview()   │
├─────────────────────────┤      │ + publish()           │
│ + changeState()         │      │ + reject()            │
│ + submitForReview()     │      │ + edit()              │
│ + publish()             │      │ + getName()           │
│ + reject()              │      └──────────┬────────────┘
│ + edit()                │                 │
└─────────────────────────┘                 │
                                            │
          ┌───────────────────────────────┐ │ ┌───────────────────────────────┐
          │         DraftState            │◄┼─┤        ModerationState        │
          ├───────────────────────────────┤   ├───────────────────────────────┤
          │ + submitForReview() →         │   │ + submitForReview()           │
          │   change to ModerationState   │   │ + publish() →                 │
          │ + publish()                   │   │   change to PublishedState    │
          │ + reject()                    │   │ + reject() →                  │
          │ + edit()                      │   │   change to RejectedState     │
          │ + getName()                   │   │ + edit() →                    │
          └───────────────────────────────┘   │   change to DraftState        │
                                              │ + getName()             ś      │
                                              └───────────────────────────────┘
          ┌───────────────────────────────┐     ┌───────────────────────────────┐
          │       PublishedState          │     │        RejectedState          │
          ├───────────────────────────────┤     ├───────────────────────────────┤
          │ + submitForReview()           │     │ + submitForReview() →         │
          │ + publish()                   │     │   change to ModerationState   │
          │ + reject()                    │     │ + publish()                   │
          │ + edit() →                    │     │ + reject()                    │
          │   change to DraftState        │     │ + edit() →                    │
          │ + getName()                   │     │   change to DraftState        │
          └───────────────────────────────┘     │ + getName()                   │
                                                └───────────────────────────────┘
```

#### Benefits of Proper Pattern:

1. **Encapsulation**: Each state's behavior is encapsulated in its own class
2. **Eliminates conditionals**: No need for complex conditional statements
3. **Open/Closed Principle**: New states can be added without modifying existing code
4. **Single Responsibility**: Each state class has a single responsibility
5. **Clarity**: State transitions are explicit and easy to understand
6. **Flexibility**: States can be swapped at runtime

## Visual Comparison

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                                                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  // Using enum for state but still with conditionals                              │
│  if (state === DocumentState.DRAFT) {                                             │
│      this.state = DocumentState.MODERATION;                                       │
│      this.outputs.push('Document submitted for review');                          │
│  } else if (state === DocumentState.MODERATION) {                                 │
│      this.outputs.push('Document is already under review');                       │
│  } else if (state === DocumentState.PUBLISHED) {                                  │
│      // Cannot submit a published document                                        │
│  } else if (state === DocumentState.REJECTED) {                                   │
│      this.state = DocumentState.MODERATION;                                       │
│      // Resubmit logic                                                            │
│  }                                                                                │
│                                                                                   │
│  // Adding a new state requires modifying all methods                             │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                                                │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  // Context delegates to current state                                            │
│  public submitForReview(): void {                                                 │
│      this.state.submitForReview(this);                                            │
│  }                                                                                │
│                                                                                   │
│  // Each state implements the DocumentState interface                             │
│  class DraftState implements DocumentState {                                      │
│      public submitForReview(context: Document): void {                            │
│          context.changeState(new ModerationState());                              │
│      }                                                                            │
│  }                                                                                │
│                                                                                   │
│  // Adding a new state is just creating a new class                               │
│  class ArchiveState implements DocumentState {                                    │
│      public submitForReview(context: Document): void {                            │
│          // New state-specific behavior                                           │
│      }                                                                ś            │
│  }                                                                                │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

## When to Use

- When an object's behavior depends on its state and must change at runtime
- When you have an object with operations that contain large, multipart conditional statements that depend on the object's state
- When you want to avoid massive conditional statements for state-dependent code
- When you need to add new states without changing existing state classes
- When state transitions follow specific rules that should be encapsulated

## When to Avoid

- When the state logic is simple and unlikely to change
- When there are only a few states with minimal transitions
- When the overhead of creating multiple state classes isn't justified by the complexity of the state logic
- When the state changes are rare or predictable

## Real-World Examples

1. **Document Management Systems**: Documents transition through various states (draft, review, approved, published)
2. **Order Processing**: Orders move through different states (new, paid, shipped, delivered, returned)
3. **Workflow Engines**: Tasks progress through different states based on user actions
4. **Game Development**: Character behavior changes based on current state (idle, walking, running, jumping)
5. **UI Components**: Elements change appearance and behavior based on state (normal, hover, active, disabled)

## Related Patterns

- **State vs Strategy**: Both patterns involve composition and delegation, but State focuses on changing behavior based on internal state, while Strategy focuses on selecting algorithms at runtime.
- **State vs Command**: Command encapsulates a request as an object, while State encapsulates state-dependent behavior.
- **State vs Memento**: Often used together - Memento can store the history of State changes.

## Example in Popular Frameworks

### React.js with TypeScript State Management

React's state management with TypeScript is a form of the State pattern, where component behavior changes based on state:

```typescript
interface LoginFormState {
  isLoggedIn: boolean;
}

interface LoginFormProps {
  username?: string;
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  constructor(props: LoginFormProps) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  login = (): void => {
    this.setState({ isLoggedIn: true });
  }

  logout = (): void => {
    this.setState({ isLoggedIn: false });
  }

  render(): React.ReactNode {
    if (this.state.isLoggedIn) {
      return (
        <div>
          <h1>Welcome back{this.props.username ? `, ${this.props.username}` : ''}!</h1>
          <button onClick={this.logout}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Please log in</h1>
          <button onClick={this.login}>Login</button>
        </div>
      );
    }
  }
}
```

### TypeScript Network Connection States

Here's a TypeScript example of using the State pattern to manage network connection states:

```typescript
// Define the connection states as an enum
enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting'
}

// State interface
interface IConnectionState {
  connect(context: Connection): void;
  disconnect(context: Connection): void;
  send(context: Connection, data: string): void;
  getName(): ConnectionState;
}

// Connection context class
class Connection {
  private state: IConnectionState;
  
  constructor() {
    // Initial state is disconnected
    this.state = new DisconnectedState();
    console.log(`Connection initialized in ${this.state.getName()} state`);
  }
  
  public changeState(state: IConnectionState): void {
    this.state = state;
    console.log(`Connection changed to ${this.state.getName()} state`);
  }
  
  public connect(): void {
    this.state.connect(this);
  }
  
  public disconnect(): void {
    this.state.disconnect(this);
  }
  
  public send(data: string): void {
    this.state.send(this, data);
  }
  
  public getStateName(): ConnectionState {
    return this.state.getName();
  }
}

// Concrete state implementations
class DisconnectedState implements IConnectionState {
  public connect(context: Connection): void {
    console.log('Attempting to connect...');
    context.changeState(new ConnectingState());
  }
  
  public disconnect(context: Connection): void {
    console.log('Already disconnected');
  }
  
  public send(context: Connection, data: string): void {
    console.log('Cannot send data: disconnected');
  }
  
  public getName(): ConnectionState {
    return ConnectionState.DISCONNECTED;
  }
}

class ConnectingState implements IConnectionState {
  private connectionTimer: NodeJS.Timeout;
  
  constructor() {
    // Simulate connection process
    this.connectionTimer = setTimeout(() => {}, 0);
  }
  
  public connect(context: Connection): void {
    console.log('Already connecting...');
  }
  
  public disconnect(context: Connection): void {
    console.log('Cancelling connection attempt');
    clearTimeout(this.connectionTimer);
    context.changeState(new DisconnectedState());
  }
  
  public send(context: Connection, data: string): void {
    console.log('Cannot send data: still connecting');
  }
  
  public getName(): ConnectionState {
    return ConnectionState.CONNECTING;
  }
}

// Usage example
const connection = new Connection();
connection.send('test data'); // Cannot send: disconnected
connection.connect();        // Changes to connecting state
connection.send('test data'); // Cannot send: still connecting
```

## Conclusion

The State pattern provides a clean way to organize state-dependent code by encapsulating each state's behavior in separate classes. This approach eliminates complex conditional statements, makes the code more maintainable, and allows for easy addition of new states without modifying existing code. While it introduces more classes, the benefits in code organization, flexibility, and maintainability often outweigh this overhead for complex state-dependent systems.
