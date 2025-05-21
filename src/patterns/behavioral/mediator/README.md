# Mediator Pattern

## Overview

The Mediator pattern is a behavioral design pattern that defines an object that encapsulates how a set of objects interact. This pattern promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.

## Problem

In many complex systems, components need to communicate with each other, leading to:

- Direct dependencies between components, creating a tightly coupled system
- Components that know too much about each other's interfaces and behavior
- Difficulty in reusing components in different contexts
- Changes to one component requiring changes to many others
- Communication logic scattered across multiple components

## Diagram

```
┌───────────────────────────────┐
│        <<Interface>>          │
│          Mediator             │
├───────────────────────────────┤
│ + notify(sender, event)       │
└─────────────┬─────────────────┘
              │
              │ implements
              │
              ▼
┌───────────────────────────────┐
│     ConcreteMediator          │
├───────────────────────────────┤
│ + notify(sender, event)       │
│ - components                  │
└─────────────┬─────────────────┘
              │
              │ has references to
              │
              ▼
┌───────────────────────────────┐
│      <<Abstract>>             │
│       Component               │
├───────────────────────────────┤
│ # mediator                    │
│ + operation()                 │
└──┬─────────────┬──────────────┘
   │             │
   │ extends     │ extends
   │             │
   ▼             ▼
┌─────────────┐ ┌─────────────────┐
│ ComponentA  │ │   ComponentB    │
├─────────────┤ ├─────────────────┤
│ + operationA│ │ + operationB    │
└─────────────┘ └─────────────────┘
```

## Scenario

Imagine you're building a smart home system with various devices (lights, motion sensors, thermostats, security systems) that need to communicate with each other.

**The problem:**
1. Each device needs to interact with multiple other devices
2. Devices need to react to events from other devices
3. The interaction logic is complex and may change over time
4. Adding new device types requires modifying existing devices
5. Direct communication between devices creates a tangled web of dependencies

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach involves direct communication between components, with each component having explicit knowledge of other components.

#### Pseudo Code (Anti-Pattern)

```typescript
// Each component has direct references to other components
// and communicates with them directly
export class MotionSensor {
    private lights: Light[] = [];
    private thermostat: Thermostat | null = null;
    private securitySystem: SecuritySystem | null = null;

    public addLight(light: Light): void {
        this.lights.push(light);
    }

    public setThermostat(thermostat: Thermostat): void {
        this.thermostat = thermostat;
    }

    public setSecuritySystem(securitySystem: SecuritySystem): void {
        this.securitySystem = securitySystem;
    }

    public motionDetected(): void {
        // Directly control all connected lights
        for (const light of this.lights) {
            light.turnOn();
        }
        
        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(false);
        }
        
        // Directly interact with security system
        if (this.securitySystem && this.securitySystem.isArmed()) {
            this.securitySystem.triggerAlarm();
        }
    }
}

export class SecuritySystem {
    private armed: boolean = false;
    private lights: Light[] = [];
    private thermostat: Thermostat | null = null;

    public addLight(light: Light): void {
        this.lights.push(light);
    }

    public setThermostat(thermostat: Thermostat): void {
        this.thermostat = thermostat;
    }

    public arm(): void {
        this.armed = true;
        
        // Directly control all connected lights
        for (const light of this.lights) {
            light.turnOff();
        }
        
        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(true);
        }
    }
}

// Usage
const motionSensor = new MotionSensor();
const light = new Light();
const thermostat = new Thermostat();
const securitySystem = new SecuritySystem();

// Need to manually connect each component to others
motionSensor.addLight(light);
motionSensor.setThermostat(thermostat);
motionSensor.setSecuritySystem(securitySystem);
securitySystem.addLight(light);
securitySystem.setThermostat(thermostat);
```

#### Anti-Pattern Diagram

```
┌───────────────────────┐                  ┌───────────────┐
│ MotionSensor          │<---------------->│     Light     │
├───────────────────────┤                  ├───────────────┤
│ + addLight()          │                  │ + turnOn()    │
│ + setThermostat()     │                  │ + turnOff()   │
│ + setSecuritySystem() │                  └───────────────┘
│ + motionDetected()    │                          ▲
└─────────────┬─────────┘                          │
              │                                    │
              │                                    │
              ▼                                    │
┌────────────────┐                                 │
│  Thermostat    │<--------------------------------┘
├────────────────┤                                 │
│ + setEcoMode() │                                 │
└────────────────┘                                 │
              ▲                                    │
              │                                    │
              │                                    │
┌───────────────────┐                              │
│SecuritySystem     │<-----------------------------┘
├───────────────────┤
│ + addLight()      │
│ + setThermostat() │
│ + arm()           │
│ + triggerAlarm()  │
└───────────────────┘

// Each component has direct references to other components
// creating a complex web of dependencies
```

#### Issues with Anti-Pattern:

1. **High coupling**: Components have direct dependencies on each other
2. **Distributed logic**: Communication logic is spread across multiple components
3. **Difficult to extend**: Adding a new component requires modifying existing ones
4. **Hard to maintain**: Changes to one component may affect multiple others
5. **Complex dependencies**: Creates a tangled web of references between components

### Proper Pattern Implementation

The proper implementation uses a mediator to centralize communication logic and decouple components.

#### Pseudo Code (Proper Pattern)

```typescript
// Event type enum for type safety
enum SmartHomeEvent {
    MOTION_DETECTED = 'MOTION_DETECTED',
    NO_MOTION_DETECTED = 'NO_MOTION_DETECTED',
    SYSTEM_ARMED = 'SYSTEM_ARMED',
    SYSTEM_DISARMED = 'SYSTEM_DISARMED',
    ALARM_TRIGGERED = 'ALARM_TRIGGERED'
}

// Mediator interface
interface SmartHomeMediator {
    notify(sender: SmartHomeComponent, event: SmartHomeEvent): void;
    registerComponent(component: SmartHomeComponent): void;
}

// Abstract component class
abstract class SmartHomeComponent {
    protected mediator: SmartHomeMediator;
    
    constructor(mediator: SmartHomeMediator) {
        this.mediator = mediator;
        this.mediator.registerComponent(this);
    }
}

// Concrete mediator implementation
class SmartHomeController implements SmartHomeMediator {
    private components: Map<string, SmartHomeComponent> = new Map();
    
    public registerComponent(component: SmartHomeComponent): void {
        this.components.set(component.name, component);
    }
    
    public notify(sender: SmartHomeComponent, event: string): void {
        // Handle different events based on sender and event type
        switch (event) {
            case 'MOTION_DETECTED':
                // Turn on all lights
                this.components.forEach(component => {
                    if (component instanceof Light) {
                        (component as Light).turnOn();
                    }
                });
                
                // Disable eco mode on thermostat
                const thermostat = this.getComponent('Thermostat') as Thermostat;
                if (thermostat) {
                    thermostat.setEcoMode(false);
                }
                
                // Check if security system is armed, trigger alarm if it is
                const securitySystem = this.getComponent('SecuritySystem') as SecuritySystem;
                if (securitySystem && securitySystem.isArmed()) {
                    securitySystem.triggerAlarm();
                }
                break;
                
            case 'SYSTEM_ARMED':
                // Turn off all lights
                this.components.forEach(component => {
                    if (component instanceof Light) {
                        (component as Light).turnOff();
                    }
                });
                
                // Enable eco mode on thermostat
                const thermostat = this.getComponent('Thermostat') as Thermostat;
                if (thermostat) {
                    thermostat.setEcoMode(true);
                }
                break;
        }
    }
}

// Concrete component implementations
class MotionSensor extends SmartHomeComponent {
    public motionDetected(): void {
        this.mediator.notify(this, SmartHomeEvent.MOTION_DETECTED);
    }
}

class SecuritySystem extends SmartHomeComponent {
    private armed: boolean = false;
    
    public arm(): void {
        this.armed = true;
        this.mediator.notify(this, 'SYSTEM_ARMED');
    }
    
    public isArmed(): boolean {
        return this.armed;
    }
}

// Usage
const mediator = new SmartHomeController();
const motionSensor = new MotionSensor(mediator);
const light = new Light(mediator);
const thermostat = new Thermostat(mediator);
const securitySystem = new SecuritySystem(mediator);

// Components only interact through the mediator
```

#### Proper Pattern Diagram

```
                   ┌─────────────────────────┐
                   │   SmartHomeController   │
                   │       (Mediator)        │
                   ├─────────────────────────┤
                   │ + notify()              │
                   │ + registerComponent()   │
                   └─────────────┬───────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ MotionSensor  │     │     Light     │     │  Thermostat   │
├───────────────┤     ├───────────────┤     ├───────────────┤
│+ motionDetected     │ + turnOn()    │     │ + setEcoMode()│
└───────────────┘     │ + turnOff()   │     └───────────────┘
                      └───────────────┘
                                                    ┌───────────────┐
                                                    │SecuritySystem │
                                                    ├───────────────┤
                                                    │ + arm()       │
                                                    │ + triggerAlarm()
                                                    └───────────────┘

// Components only know about the mediator
// The mediator coordinates all interactions
```

#### Benefits of Proper Pattern:

1. **Reduced coupling**: Components only know about the mediator, not each other
2. **Centralized communication**: All interaction logic is in one place
3. **Easy to extend**: New components can be added without modifying existing ones
4. **Simplified maintenance**: Changes to interaction logic only affect the mediator
5. **Clear separation of concerns**: Components focus on their core functionality

## Best Practices

1. **Define clear interfaces**: Create well-defined interfaces for both the mediator and components
2. **Use typed events**: Implement an enum or type system for events to ensure type safety
3. **Avoid circular dependencies**: Ensure the mediator doesn't create circular dependencies between components
4. **Keep mediators focused**: Create multiple specialized mediators rather than one monolithic mediator
5. **Document the communication protocol**: Clearly document which events trigger which behaviors
6. **Consider asynchronous communication**: Use promises or observables for asynchronous operations

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐     │
│  │Component│◄───────►│Component│◄───────►│Component│     │
│  │    A    │         │    B    │         │    C    │     │
│  └─────────┘         └─────────┘         └─────────┘     │
│       ▲                   ▲                   ▲          │
│       │                   │                   │          │
│       ▼                   ▼                   ▼          │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐     │
│  │Component│◄───────►│Component│◄───────►│Component│     │
│  │    D    │         │    E    │         │    F    │     │
│  └─────────┘         └─────────┘         └─────────┘     │
└──────────────────────────────────────────────────────────┘
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │ Component A   │      │ Component B   │      │ Component C   │
    └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
            │                      │                      │
            │◄─────────────────────┼──────────────────────┘
            │                      │
            └──────────────────────►
    Each component has direct references to other components
    Creating a complex web of dependencies that is hard to maintain

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                 ┌─────────────────┐                      │
│                 │     Mediator    │                      │
│                 └─────────────────┘                      │
│                         ▲                                │
│                         │                                │
│         ┌───────────────┼───────────────┐                │
│         │               │               │                │
│         ▼               ▼               ▼                │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐             │
│  │Component│     │Component│     │Component│             │
│  │    A    │     │    B    │     │    C    │             │
│  └─────────┘     └─────────┘     └─────────┘             │
│                                                          │
│  • Components only know about the mediator               │
│  • Low coupling                                          │
│  • Centralized communication logic                       │
│  • Easy to maintain and extend                           │
└──────────────────────────────────────────────────────────┘
```

## When to Use

- When a set of objects communicate in well-defined but complex ways
- When reusing an object is difficult because it refers to and communicates with many other objects
- When you want to customize a behavior that's distributed between several classes without creating too many subclasses
- When changes to the interaction between objects should be centralized
- When you want to reduce coupling between components in a system

## When to Avoid

- When you only have a few objects with simple interactions between them
- When the centralized mediator would become too complex and hard to maintain
- When you need direct communication for performance-critical operations
- When the mediator would create a single point of failure in the system
- When the overhead of maintaining a mediator outweighs the benefits of decoupling
- For simple systems with few components and straightforward interactions
- When components rarely need to communicate with each other
- When the communication patterns are very simple and unlikely to change
- When the overhead of maintaining a mediator outweighs the benefits of decoupling

## Variations

### Event-Based Mediator

A common variation uses an event system where components publish events and the mediator subscribes to them:

```typescript
enum EventType {
  BUTTON_CLICK = 'button_click',
  FORM_SUBMIT = 'form_submit',
  DATA_LOADED = 'data_loaded'
}

interface EventMediator {
  publish(eventType: EventType, data: any): void;
  subscribe(eventType: EventType, listener: EventListener): void;
  unsubscribe(eventType: EventType, listener: EventListener): void;
}

class EventBus implements EventMediator {
  private listeners: Map<EventType, EventListener[]> = new Map();
  
  public subscribe(eventType: EventType, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }
  
  public publish(eventType: EventType, data: any): void {
    if (this.listeners.has(eventType)) {
      for (const listener of this.listeners.get(eventType)!) {
        listener.handleEvent({ type: eventType, payload: data });
      }
    }
  }
  
  public unsubscribe(eventType: EventType, listener: EventListener): void {
    if (this.listeners.has(eventType)) {
      const index = this.listeners.get(eventType)!.indexOf(listener);
      if (index !== -1) {
        this.listeners.get(eventType)!.splice(index, 1);
      }
    }
  }
}
```

### Hierarchical Mediator

In complex systems, you might implement a hierarchy of mediators, each responsible for a specific subsystem:

```typescript
interface Mediator {
  notify(sender: Component, event: string): void;
}

class SystemMediator implements Mediator {
  private subsystemMediators: Map<string, Mediator> = new Map();
  
  public registerSubsystem(name: string, mediator: Mediator): void {
    this.subsystemMediators.set(name, mediator);
  }
  
  public notify(sender: Component, event: string): void {
    // Route the event to the appropriate subsystem mediator
    const subsystem = this.determineSubsystem(sender);
    if (this.subsystemMediators.has(subsystem)) {
      this.subsystemMediators.get(subsystem)!.notify(sender, event);
    }
  }
  
  private determineSubsystem(component: Component): string {
    // Logic to determine which subsystem a component belongs to
    return component.getSubsystemName();
  }
}
```

## Real-World Examples

1. **Air Traffic Control**: The control tower (mediator) coordinates communication between aircraft (components) to prevent collisions and manage traffic flow.

2. **Chat Applications**: A chat server (mediator) manages communication between users (components) without them having to know about each other directly.

3. **GUI Libraries**: Event handling systems in UI frameworks often use mediator patterns to handle communication between UI components.

4. **Middleware**: Application servers act as mediators between clients and backend services.

## Implementation Considerations

1. **Mediator Complexity**: Be careful not to create a "god object" mediator that knows too much and becomes difficult to maintain.

2. **Event-Based Communication**: Consider using an event-based system for communication between the mediator and components.

3. **Typed Events**: Use typed events or enums to make the communication protocol more explicit and easier to understand. This provides compile-time type safety, prevents typos in event names, and makes refactoring easier.

4. **Component Registration**: Decide whether components should register themselves with the mediator or if the mediator should keep track of components.

5. **Two-Way Communication**: Ensure that both the mediator can call components and components can notify the mediator of events.

## Related Patterns

- **Observer Pattern**: Often used within the Mediator pattern for event notification.
- **Command Pattern**: Can be used to encapsulate requests to the mediator.
- **Facade Pattern**: Both provide a higher-level interface, but Mediator focuses on coordinating interactions between objects.
- **Singleton Pattern**: The mediator is often implemented as a singleton.

## Code Examples

### TypeScript Chat Room Example

```typescript
// Mediator interface
interface ChatMediator {
  sendMessage(message: string, user: User): void;
  addUser(user: User): void;
}

// Concrete mediator
class ChatRoom implements ChatMediator {
  private users: User[] = [];

  public addUser(user: User): void {
    this.users.push(user);
    console.log(`${user.name} joined the chat`);
  }

  public sendMessage(message: string, sender: User): void {
    console.log(`[${sender.name}]: ${message}`);
    
    // Send message to all users except the sender
    this.users.forEach(user => {
      if (user !== sender) {
        user.receive(message, sender.name);
      }
    });
  }
}

// Component
class User {
  public name: string;
  private mediator: ChatMediator;

  constructor(name: string, mediator: ChatMediator) {
    this.name = name;
    this.mediator = mediator;
    this.mediator.addUser(this);
  }

  public send(message: string): void {
    this.mediator.sendMessage(message, this);
  }

  public receive(message: string, from: string): void {
    console.log(`${this.name} received from ${from}: ${message}`);
  }
}

// Usage
const chatroom = new ChatRoom();
const john = new User("John", chatroom);
const alice = new User("Alice", chatroom);
const bob = new User("Bob", chatroom);

john.send("Hello everyone!");
alice.send("Hi John!");
bob.send("Hey there!");
```

### TypeScript Air Traffic Control Example

```typescript
// Mediator interface
interface AirTrafficControlMediator {
  registerFlight(flight: Flight): void;
  requestLanding(flight: Flight): void;
  requestTakeoff(flight: Flight): void;
}

// Concrete mediator
class ControlTower implements AirTrafficControlMediator {
  private flights: Flight[] = [];
  private runwayFree: boolean = true;

  public registerFlight(flight: Flight): void {
    this.flights.push(flight);
    console.log(`Flight ${flight.getFlightNumber()} registered with control tower`);
  }

  public requestLanding(flight: Flight): void {
    if (this.runwayFree) {
      console.log(`Control tower: Flight ${flight.getFlightNumber()} cleared for landing`);
      this.runwayFree = false;
      flight.land();
    } else {
      console.log(`Control tower: Flight ${flight.getFlightNumber()} please wait, runway occupied`);
    }
  }

  public requestTakeoff(flight: Flight): void {
    if (this.runwayFree) {
      console.log(`Control tower: Flight ${flight.getFlightNumber()} cleared for takeoff`);
      this.runwayFree = false;
      flight.takeoff();
    } else {
      console.log(`Control tower: Flight ${flight.getFlightNumber()} please wait, runway occupied`);
    }
  }

  public notifyRunwayClear(): void {
    this.runwayFree = true;
    console.log("Control tower: Runway is now clear");
  }
}

// Abstract component
abstract class Flight {
  protected mediator: AirTrafficControlMediator;
  protected flightNumber: string;

  constructor(mediator: AirTrafficControlMediator, flightNumber: string) {
    this.mediator = mediator;
    this.flightNumber = flightNumber;
    this.mediator.registerFlight(this);
  }

  public getFlightNumber(): string {
    return this.flightNumber;
  }

  public abstract land(): void;
  public abstract takeoff(): void;
}

// Concrete component
class CommercialFlight extends Flight {
  constructor(mediator: AirTrafficControlMediator, flightNumber: string) {
    super(mediator, flightNumber);
  }

  public land(): void {
    console.log(`Flight ${this.flightNumber} has landed`);
    (this.mediator as ControlTower).notifyRunwayClear();
  }

  public takeoff(): void {
    console.log(`Flight ${this.flightNumber} has taken off`);
    (this.mediator as ControlTower).notifyRunwayClear();
  }

  public requestLanding(): void {
    console.log(`Flight ${this.flightNumber} requesting landing`);
    this.mediator.requestLanding(this);
  }

  public requestTakeoff(): void {
    console.log(`Flight ${this.flightNumber} requesting takeoff`);
    this.mediator.requestTakeoff(this);
  }
}

// Usage
const tower = new ControlTower();
const flight1 = new CommercialFlight(tower, "CA123");
const flight2 = new CommercialFlight(tower, "BA456");

flight1.requestLanding();
flight2.requestLanding(); // Will be asked to wait

// After flight1 lands, the runway becomes clear
flight2.requestLanding(); // Now allowed to land
```

### TypeScript Event System Example

```typescript
// Define event types
enum EventType {
  BUTTON_CLICK = 'BUTTON_CLICK',
  FORM_SUBMIT = 'FORM_SUBMIT',
  DATA_LOADED = 'DATA_LOADED',
  ERROR = 'ERROR'
}

// Event interface
interface AppEvent {
  type: EventType;
  payload: any;
  source: UIComponent;
}

// Mediator interface
interface EventMediator {
  publish(event: AppEvent): void;
  subscribe(eventType: EventType, listener: UIComponent): void;
  unsubscribe(eventType: EventType, listener: UIComponent): void;
}

// Abstract component
abstract class UIComponent {
  protected mediator: EventMediator;
  public readonly id: string;
  
  constructor(mediator: EventMediator, id: string) {
    this.mediator = mediator;
    this.id = id;
  }
  
  public abstract handleEvent(event: AppEvent): void;
  
  protected publishEvent(type: EventType, payload: any = {}): void {
    this.mediator.publish({
      type,
      payload,
      source: this
    });
  }
}

// Concrete mediator
class EventBus implements EventMediator {
  private listeners: Map<EventType, Set<UIComponent>> = new Map();
  
  public publish(event: AppEvent): void {
    console.log(`EventBus: Publishing ${event.type} from ${event.source.id}`);
    
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        if (listener !== event.source) { // Don't send event back to source
          listener.handleEvent(event);
        }
      });
    }
  }
  
  public subscribe(eventType: EventType, listener: UIComponent): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)?.add(listener);
    console.log(`EventBus: ${listener.id} subscribed to ${eventType}`);
  }
  
  public unsubscribe(eventType: EventType, listener: UIComponent): void {
    const eventListeners = this.listeners.get(eventType);
    if (eventListeners) {
      eventListeners.delete(listener);
      console.log(`EventBus: ${listener.id} unsubscribed from ${eventType}`);
    }
  }
}

// Concrete components
class Button extends UIComponent {
  constructor(mediator: EventMediator, id: string) {
    super(mediator, id);
  }
  
  public click(): void {
    console.log(`Button ${this.id} clicked`);
    this.publishEvent(EventType.BUTTON_CLICK, { buttonId: this.id });
  }
  
  public handleEvent(event: AppEvent): void {
    // Buttons don't handle events in this example
  }
}

class Form extends UIComponent {
  private data: Record<string, any> = {};
  
  constructor(mediator: EventMediator, id: string) {
    super(mediator, id);
    // Subscribe to button clicks
    mediator.subscribe(EventType.BUTTON_CLICK, this);
  }
  
  public setData(key: string, value: any): void {
    this.data[key] = value;
  }
  
  public submit(): void {
    console.log(`Form ${this.id} submitted with data:`, this.data);
    this.publishEvent(EventType.FORM_SUBMIT, { formId: this.id, formData: this.data });
  }
  
  public handleEvent(event: AppEvent): void {
    if (event.type === EventType.BUTTON_CLICK && event.payload.buttonId === 'submitButton') {
      this.submit();
    }
  }
}

class DataDisplay extends UIComponent {
  constructor(mediator: EventMediator, id: string) {
    super(mediator, id);
    // Subscribe to form submissions and data loading
    mediator.subscribe(EventType.FORM_SUBMIT, this);
    mediator.subscribe(EventType.DATA_LOADED, this);
  }
  
  public handleEvent(event: AppEvent): void {
    if (event.type === EventType.FORM_SUBMIT) {
      console.log(`DataDisplay ${this.id} received form data:`, event.payload.formData);
      // Simulate data processing
      setTimeout(() => {
        this.publishEvent(EventType.DATA_LOADED, { 
          processedData: `Processed: ${JSON.stringify(event.payload.formData)}` 
        });
      }, 1000);
    } else if (event.type === EventType.DATA_LOADED) {
      console.log(`DataDisplay ${this.id} showing processed data:`, event.payload.processedData);
    }
  }
}

// Usage
const eventBus = new EventBus();
const submitButton = new Button(eventBus, 'submitButton');
const userForm = new Form(eventBus, 'userForm');
const dataDisplay = new DataDisplay(eventBus, 'mainDisplay');

// Set form data and trigger button click
userForm.setData('username', 'john_doe');
userForm.setData('email', 'john@example.com');
submitButton.click(); // This will trigger form submission through the mediator
```

## Further Considerations

1. **Performance Impact**: In systems with a high volume of interactions, the mediator can become a bottleneck. Consider implementing optimizations like event batching or filtering to reduce overhead.

2. **Testing Strategy**: The Mediator pattern can simplify testing by allowing you to mock the mediator and test components in isolation. Consider designing your mediator interface with testability in mind.

3. **Asynchronous Communication**: In modern applications, especially in distributed systems, consider implementing asynchronous communication mechanisms in your mediator (like Promises, Observables, or message queues).

4. **Scalability**: For large-scale applications, consider implementing multiple specialized mediators instead of a single monolithic one. This approach creates a hierarchy of mediators, each responsible for a specific subsystem.

5. **Stateful vs. Stateless Mediators**: Decide whether your mediator needs to maintain state. Stateless mediators are easier to scale but may require components to maintain more state themselves.

6. **Error Handling**: Implement robust error handling in the mediator to prevent failures in one component from affecting others. Consider using the Circuit Breaker pattern for critical communications.

7. **Versioning and Backward Compatibility**: In long-lived systems, plan for how the mediator will handle versioning of messages or events as the system evolves.

8. **Security Considerations**: In systems where the mediator handles sensitive operations, implement appropriate validation and authorization checks within the mediator.

## Conclusion

The Mediator pattern is a powerful solution for managing complex interactions between components in a system. By centralizing communication logic, it reduces coupling between components, making the system more maintainable and extensible. The pattern is particularly valuable in large systems with many interconnected components, where direct communication would lead to a tangled web of dependencies.

While the pattern introduces an additional layer of abstraction through the mediator, the benefits of reduced coupling, improved maintainability, and centralized communication logic often outweigh this overhead. By carefully designing your mediator interfaces and using typed events, you can create robust systems that are easy to extend and modify as requirements change.
