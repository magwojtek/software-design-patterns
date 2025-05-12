# Observer Pattern

## Overview

The Observer pattern is a behavioral design pattern that defines a one-to-many dependency between objects. When one object (the subject) changes state, all its dependents (observers) are notified and updated automatically. It's particularly useful for implementing distributed event handling systems.

## Problem

In many scenarios, we need objects to be notified when something they depend on changes:

- UI components need to update when data models change
- Multiple components need to respond to the same event
- Components need to be notified about state changes without tight coupling
- Different types of notifications may be needed for the same event

## Diagram

```
┌───────────────┐           ┌──────────────┐
│               │           │  Observer    │
│    Subject    │◄─────────►│  Interface   │
│               │           └──────┬───────┘
└───────┬───────┘                  │
        │                          │
        │ has                      │ implemented by
        ▼                          │
┌───────────────┐          ┌───────┼───────┐
│ - observers[] │          │       │       │
│ + register()  │     ┌────▼─┐ ┌───▼──┐ ┌──▼───┐
│ + remove()    │     │ Obs1 │ │ Obs2 │ │ Obs3 │
│ + notify()    │     └──────┘ └──────┘ └──────┘
└───────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing an observer typically involves direct references to concrete observers and manual notification mechanisms.

#### Pseudo Code (Anti-Pattern)

```typescript
class WeatherStation {
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;
    
    // Hard-coded references to specific concrete observer classes
    private phoneDisplay: PhoneDisplay;
    private webDisplay: WebDisplay;
    private smartHomeSystem: SmartHomeSystem;
    
    constructor() {
        // Creating concrete implementations directly
        this.phoneDisplay = new PhoneDisplay();
        this.webDisplay = new WebDisplay();
        this.smartHomeSystem = new SmartHomeSystem();
    }
    
    public setMeasurements(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        
        // Manual notification of each observer
        this.notifyObservers();
    }
    
    private notifyObservers(): void {
        // Direct method calls to specific observer types
        this.phoneDisplay.update(this.temperature, this.humidity, this.pressure);
        this.webDisplay.update(this.temperature, this.humidity, this.pressure);
        this.smartHomeSystem.update(this.temperature, this.humidity);
    }
}

// Different observer classes with inconsistent interfaces
class PhoneDisplay {
    public update(temperature: number, humidity: number, pressure: number): void {
        console.log(`Phone Display: Temperature ${temperature}°C, Humidity ${humidity}%, Pressure ${pressure} hPa`);
    }
}

class WebDisplay {
    public update(temperature: number, humidity: number, pressure: number): void {
        console.log(`Web Display: Weather update - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure ${pressure} hPa`);
    }
}

class SmartHomeSystem {
    // Notice different parameter list than other observers
    public update(temperature: number, humidity: number): void {
        if (temperature > 25) {
            console.log('Smart Home: Turning on air conditioning');
        } else if (temperature < 15) {
            console.log('Smart Home: Turning on heating');
        }
    }
}

// Usage
const weatherStation = new WeatherStation();
// No way to add/remove observers after creation
weatherStation.setMeasurements(25, 65, 1013);
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Subject has direct dependencies on concrete observer classes
2. **No standardized interface**: Observer implementations have inconsistent methods
3. **Fixed observer set**: Cannot dynamically add or remove observers at runtime
4. **Hard to extend**: Adding new observer types requires modifying the subject class
5. **Difficult testing**: Hard to mock concrete dependencies for unit tests

### Proper Pattern Implementation

The proper implementation uses interfaces and maintains a dynamic list of observers.

#### Pseudo Code (Proper Pattern)

```typescript
// Observer interface that all concrete observers will implement
interface Observer {
    update(temperature: number, humidity: number, pressure: number): void;
}

// Subject interface that defines operations for managing observers
interface Subject {
    registerObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
}

// Concrete subject implementation
class WeatherStation implements Subject {
    private observers: Observer[] = [];
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;
    
    public registerObserver(observer: Observer): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    
    public removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    
    public notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.temperature, this.humidity, this.pressure);
        }
    }
    
    // Method to update measurements and notify observers
    public setMeasurements(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        this.notifyObservers();
    }
}

// Concrete observer implementations
class PhoneDisplay implements Observer {
    private weatherStation: WeatherStation;
    
    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        // Self-registration
        this.weatherStation.registerObserver(this);
    }
    
    public update(temperature: number, humidity: number, pressure: number): void {
        console.log(`Phone Display: Temperature ${temperature}°C, Humidity ${humidity}%, Pressure ${pressure} hPa`);
    }
    
    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}

class WebDisplay implements Observer {
    private weatherStation: WeatherStation;
    
    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        this.weatherStation.registerObserver(this);
    }
    
    public update(temperature: number, humidity: number, pressure: number): void {
        console.log(`Web Display: Weather update - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure ${pressure} hPa`);
    }
    
    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}

class SmartHomeSystem implements Observer {
    private weatherStation: WeatherStation;
    
    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        this.weatherStation.registerObserver(this);
    }
    
    public update(temperature: number, humidity: number, pressure: number): void {
        // Using only the parameters it needs
        if (temperature > 25) {
            console.log('Smart Home: Turning on air conditioning');
        } else if (temperature < 15) {
            console.log('Smart Home: Turning on heating');
        }
    }
    
    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}

// Usage
const weatherStation = new WeatherStation();

// Create and register observers
const phoneDisplay = new PhoneDisplay(weatherStation);
const webDisplay = new WebDisplay(weatherStation);
const smartHome = new SmartHomeSystem(weatherStation);

// Update measurements - all observers get notified
weatherStation.setMeasurements(25, 65, 1013);

// Dynamically remove an observer
phoneDisplay.unsubscribe();

// Only remaining observers get notified
weatherStation.setMeasurements(26, 70, 1010);

// Add new observer at runtime
const newDisplay = new PhoneDisplay(weatherStation);
weatherStation.setMeasurements(24, 65, 1012);
```

#### Benefits of Proper Implementation:

1. **Loose coupling**: Subject depends only on the Observer interface, not concrete classes
2. **Standardized interface**: All observers implement the same interface
3. **Dynamic registration**: Observers can be added and removed at runtime
4. **Easy to extend**: New observer types can be added without modifying the subject
5. **Better testability**: Interfaces can be mocked for unit testing

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
    ┌───────────────┐           ┌────────────┐
    │ WeatherStation│- - - - - >│PhoneDisplay│
    │               │           └────────────┘
    │               │           ┌────────────┐
    │               │- - - - - >│WebDisplay  │
    │               │           └────────────┘
    │               │           ┌────────────┐
    │               │- - - - - >│SmartHome   │
    └───────────────┘           └────────────┘
    Fixed references to concrete implementations

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘

    ┌───────────────┐           ┌───────────┐
    │«interface»    │           │«interface»│
    │Subject        │<>- - - - >│Observer   │
    └───────┬───────┘           └─────┬─────┘
            ▲                         ▲
            │                         │
    ┌───────┴───────┐                 │
    │WeatherStation │                 │
    │               │                 │
    │ observers[]   │                 │
    └───────────────┘                 │
                                      │
                          ┌───────────┼───────────┐
                          │           │           │
                ┌─────────┴──┐  ┌─────┴────┐  ┌───┴────────┐
                │PhoneDisplay│  │WebDisplay│  │  SmartHome │
                └────────────┘  └──────────┘  └────────────┘
```

## Best Practices

1. Define clear interfaces for both subjects and observers
2. Implement centralized observer registration and notification mechanisms
3. Allow dynamic addition and removal of observers
4. Consider weak references to observers to avoid memory leaks
5. Implement unsubscribe methods for observers to clean up properly
6. Use the Observer pattern for loosely coupled, event-based systems

## When to Use

- When changes to one object require changing others, and you don't know how many objects need to change
- When an object should be able to notify other objects without making assumptions about them
- For implementing distributed event handling systems
- When you want to achieve loose coupling between related objects
- For implementing pub/sub (publish-subscribe) architectures

## When to Avoid

- When the relationship between observers and subjects is more complex
- When notifications need to be highly optimized for performance
- When changes need to be synchronized or happen in a specific order
- When observer chain dependencies could create circular references or cascade problems

## Variations

### Push vs. Pull Models

- **Push model**: Subject sends all data to observers (as shown in examples)
- **Pull model**: Subject notifies observers of changes but observers request specific data

### Event-Based Observers

Observers subscribe to specific events rather than the entire subject state.

```typescript
interface EventObserver {
    update(event: string, data: any): void;
}

class Subject {
    private observers: Map<string, EventObserver[]> = new Map();
    
    public on(event: string, observer: EventObserver): void {
        if (!this.observers.has(event)) {
            this.observers.set(event, []);
        }
        this.observers.get(event)!.push(observer);
    }
    
    public off(event: string, observer: EventObserver): void {
        // Remove observer
    }
    
    protected emit(event: string, data: any): void {
        const observers = this.observers.get(event);
        if (observers) {
            for (const observer of observers) {
                observer.update(event, data);
            }
        }
    }
}
```

## Real-World Examples

- Event listeners in DOM
- Model-View-Controller architectures
- Reactive programming libraries ([RxJS](https://rxjs.dev/guide/overview), [Kefir](https://kefirjs.github.io/kefir/)([atomic](https://www.npmjs.com/package/@hitorisensei/kefir-atomic)))
- Notification systems

## Further Considerations

- **Thread safety**: Ensure thread-safety in concurrent environments
- **Performance**: Consider batching notifications for performance optimization
- **Sequencing**: Be aware of the order of observer notifications if it matters
- **Memory management**: Avoid memory leaks by ensuring observers can be garbage collected
- **Error handling**: Handle exceptions in observer update methods to prevent notification chains from breaking
