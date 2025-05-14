# Command Pattern

## Overview

The Command pattern is a behavioral design pattern that turns a request into a stand-alone object containing all information about the request. This transformation lets you parameterize methods with different requests, delay or queue a request's execution, and support undoable operations.

## Problem

In many scenarios, we need to decouple the object that invokes an operation from the object that actually performs it:

- UI components need to execute actions without knowing their implementation details
- Operations need to be queueable, schedulable, or executable remotely
- Support for transactional operations including rollbacks (undo)
- Support for composed operations (macros)

## Diagram

```
┌───────────────┐           ┌──────────────┐
│               │           │  Command     │
│    Invoker    │◄─────────►│  Interface   │
│               │           └──────┬───────┘
└───────────────┘                  │
                                   │
                                   │ implemented by
                                   │
                          ┌────────┼────────┐
                          │        │        │
                    ┌─────▼─┐  ┌───▼──┐  ┌──▼───┐
                    │ Cmd1  │  │ Cmd2 │  │ Cmd3 │
                    └─┬─────┘  └──────┘  └──────┘
                      │
                      │ uses
                      ▼
                 ┌──────────┐
                 │ Receiver │
                 └──────────┘
```

## Scenario

Imagine you're developing a home automation system with a universal remote control that can operate various devices like lights, ceiling fans, audio systems, and thermostats. The remote has multiple buttons, and each button should control a specific device action.

**The problem:**
1. The remote control (invoker) needs to work with any device (receiver) without being tightly coupled to them
2. Users want to be able to reprogram buttons to control different devices or actions
3. The system should support an "undo" button to revert the last operation
4. New devices should be easily integrated without modifying the remote control
5. For advanced users, some buttons should execute multiple operations in sequence (macros)

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach directly couples the invoker with receivers and hardcodes operations.

#### Pseudo Code (Anti-Pattern)

```typescript
class RemoteControl {
    // Direct references to the receivers
    private light: Light;
    private fan: CeilingFan;
    
    constructor() {
        // Creating concrete implementations directly
        this.light = new Light("Living Room");
        this.fan = new CeilingFan("Living Room");
    }
    
    // Methods directly call receiver operations
    public pressLightButton(): void {
        // Directly operates on the receiver
        this.light.on();
    }
    
    public pressFanButton(): void {
        // Directly operates on the receiver
        this.fan.high();
    }
    
    // No way to add new buttons or change functionality without modifying this class
    // No support for undo operations
}

// Receiver classes
class Light {
    public on(): void {
        console.log("Light is turned ON");
    }
    
    public off(): void {
        console.log("Light is turned OFF");
    }
}

class CeilingFan {
    public high(): void {
        console.log("Ceiling Fan is set to HIGH speed");
    }
    
    public off(): void {
        console.log("Ceiling Fan is turned OFF");
    }
}

// Usage
const remoteControl = new RemoteControl();
// No way to change commands at runtime
remoteControl.pressLightButton();
remoteControl.pressFanButton();
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Invoker has direct dependencies on concrete receiver classes
2. **Not flexible**: Cannot change commands at runtime
3. **Hard to extend**: Adding new commands requires modifying the invoker class
4. **No undo capability**: No built-in way to implement undo functionality
5. **Difficult testing**: Hard to mock concrete dependencies for unit tests

### Proper Pattern Implementation

The proper implementation uses an interface-based approach with Command objects that encapsulate operations.

#### Pseudo Code (Proper Pattern)

```typescript
// Command interface
interface Command {
    execute(): void;
    undo(): void;
}

// Receiver class
class Light {
    private isOn: boolean = false;
    
    public on(): void {
        this.isOn = true;
        console.log("Light is turned ON");
    }
    
    public off(): void {
        this.isOn = false;
        console.log("Light is turned OFF");
    }
}

// Concrete commands
class LightOnCommand implements Command {
    private light: Light;
    
    constructor(light: Light) {
        this.light = light;
    }
    
    public execute(): void {
        this.light.on();
    }
    
    public undo(): void {
        this.light.off();
    }
}

class LightOffCommand implements Command {
    private light: Light;
    
    constructor(light: Light) {
        this.light = light;
    }
    
    public execute(): void {
        this.light.off();
    }
    
    public undo(): void {
        this.light.on();
    }
}

// Invoker
class RemoteControl {
    private onCommand: Command;
    private offCommand: Command;
    private undoCommand: Command;
    
    constructor() {
        // Initialize with NoCommand
        this.onCommand = new NoCommand();
        this.offCommand = new NoCommand();
        this.undoCommand = new NoCommand();
    }
    
    public setCommand(onCommand: Command, offCommand: Command): void {
        this.onCommand = onCommand;
        this.offCommand = offCommand;
    }
    
    public onButtonPressed(): void {
        this.onCommand.execute();
        this.undoCommand = this.onCommand;
    }
    
    public offButtonPressed(): void {
        this.offCommand.execute();
        this.undoCommand = this.offCommand;
    }
    
    public undoButtonPressed(): void {
        this.undoCommand.undo();
    }
}

// Usage
const light = new Light();
const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);

const remote = new RemoteControl();
remote.setCommand(lightOn, lightOff);

// Execute commands
remote.onButtonPressed();
remote.offButtonPressed();
remote.undoButtonPressed(); // Undo the last command (turns light on again)

// Can change commands at runtime
const fan = new CeilingFan();
const fanHigh = new FanHighCommand(fan);
const fanOff = new FanOffCommand(fan);
remote.setCommand(fanHigh, fanOff);
```

#### Benefits of Proper Implementation:

1. **Decoupling**: Invoker is decoupled from receivers and specific operations
2. **Runtime flexibility**: Commands can be changed at runtime
3. **Extensibility**: New commands can be added without modifying existing code
4. **Undo support**: Commands can implement undo operations
5. **Composite commands**: Commands can be combined into macro commands
6. **Better testability**: Commands can be mocked for unit testing

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
    ┌───────────────┐           ┌─────────────┐
    │ RemoteControl │- - - - - >│   Light     │
    │               │           └─────────────┘
    │               │           ┌─────────────┐
    │               │- - - - - >│ CeilingFan  │
    │               │           └─────────────┘
    └───────────────┘           
    Fixed references to concrete receiver implementations

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘

    ┌───────────────┐           ┌─────────────┐
    │               │           │ «interface» │
    │RemoteControl  │◄- - - - - │ Command     │
    │               │           └─────┬───────┘
    └───────────────┘                 │
                                      │
                                      │
                           ┌──────────┼─────────────────┐
                           │          │                 │
                ┌──────────┴──┐  ┌────┴────────┐  ┌─────┴──────┐
                │ LightOnCmd  │  │ LightOffCmd │  │ FanHighCmd │
                └─────┬───────┘  └───┬─────────┘  └─┬──────────┘
                      │              │              │
                      │              │              │
                      ▼              ▼              ▼
                 ┌────┴─────┐       ┌┴──────────────┴┐
                 │  Light   │       │   CeilingFan   │
                 └──────────┘       └────────────────┘
```

## Best Practices

1. Define a clear Command interface with execute and undo operations
2. Keep commands focused on a single responsibility
3. Use command history for undo/redo functionality
4. Consider using the Null Object pattern for uninitialized commands
5. Use composite commands (macros) for complex operations
6. Store command state necessary for undo operations

## When to Use

- When you want to parameterize objects with operations
- When you need to queue, specify, or execute requests at different times
- When you need support for undoable operations
- When you want to implement callbacks, event handlers or task scheduling
- When you need to support recording changes for logging or persistence

## When to Avoid

- When a simple function call would suffice and you don't need undo/history
- When commands are very simple and you don't need the overhead
- When there's no need for runtime flexibility of operations

## Variations

### Null Object Command

The NoCommand class implements the Command interface but does nothing, useful for initializing command slots.

```typescript
class NoCommand implements Command {
    execute(): void { /* do nothing */ }
    undo(): void { /* do nothing */ }
}
```

### Macro Command

Composite pattern applied to commands to execute multiple commands as one.

```typescript
class MacroCommand implements Command {
    private commands: Command[];
    
    constructor(commands: Command[]) {
        this.commands = [...commands];
    }
    
    execute(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }
    
    undo(): void {
        // Execute undo in reverse order
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
}
```

### Command Queue

Commands can be stored in a queue for delayed execution.

```typescript
class CommandQueue {
    private queue: Command[] = [];
    
    enqueue(command: Command): void {
        this.queue.push(command);
    }
    
    processQueue(): void {
        while (this.queue.length > 0) {
            const command = this.queue.shift();
            if (command) command.execute();
        }
    }
}
```

## Real-World Examples

- Menu items and button click handlers in GUI frameworks
- Transaction processing systems
- Task schedulers and batch processing systems
- Multi-level undo-redo functionality in applications
- Remote procedure calls

## Open-Source Examples

Here are some examples of the Command pattern in popular open-source TypeScript projects:

- **VS Code**: The command system in VS Code uses this pattern extensively. Commands are registered and executed through a central command registry.
  - [VS Code Commands API](https://github.com/microsoft/vscode/blob/main/src/vs/platform/commands/common/commands.ts)
  - Example: Commands are registered and can be executed by ID from anywhere in the application

- **Angular**: Uses commands for handling user actions in reactive forms and state management.
  - [Angular Material Dialog](https://github.com/angular/components/blob/main/src/material/dialog/dialog.ts)
  - The MatDialogRef provides commands like close() and backdropClick() that encapsulate dialog operations

- **NestJS**: Uses command handlers in CQRS (Command Query Responsibility Segregation) pattern implementation.
  - [NestJS CQRS Commands](https://github.com/nestjs/cqrs/blob/master/src/command-bus.ts)
  - Commands are dispatched via a CommandBus that routes them to the appropriate handlers

- **TypeORM**: Implements database transactions using command-like patterns.
  - [TypeORM QueryRunner](https://github.com/typeorm/typeorm/blob/master/src/query-runner/QueryRunner.ts)
  - Database operations are encapsulated in commands that can be executed and rolled back

## Further Considerations

- **Thread safety**: Ensure command objects are thread-safe in concurrent environments
- **Serialization**: Commands can be serialized for sending over networks or storage
- **Command history**: Managing the command history size to balance undo capabilities with memory usage
- **Event sourcing**: Using commands as the source of truth for system state
- **Error handling**: Handling execution failures and partial undos appropriately