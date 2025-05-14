# Singleton Pattern

## Overview

The Singleton pattern ensures that a class has only one instance and provides a global point of access to it. This is particularly useful when exactly one object is needed to coordinate actions across the system, such as a configuration manager, connection pool, or file manager.

## Problem

Sometimes we want to ensure that a class has just a single instance throughout the application's lifecycle. For example:

- Database connections should be limited to avoid resource exhaustion
- Configuration managers should maintain consistent settings
- File system access should be controlled through a single point
- Thread pools should be managed centrally

## Diagram

```
┌───────────────────────────────────────┐
│                Client                 │
└───────────────────────┬───────────────┘
                        │
                        │ uses
                        ▼
┌───────────────────────────────────────┐
│             Singleton                 │
├───────────────────────────────────────┤
│ - static instance: Singleton          │
│ - private constructor()               │
├───────────────────────────────────────┤
│ + static getInstance(): Singleton     │
│ + doSomething()                       │
└───────────────────────────────────────┘
```

## Scenario

Imagine you're developing a web application that needs to interact with a database. Database connections are resource-intensive to create and maintain, and having too many connections can lead to performance issues or even application crashes.

**The problem:**
1. The application needs a reliable way to access the database
2. Connection parameters (server, credentials, etc.) should be configured only once
3. The application needs to limit the total number of database connections to prevent resource exhaustion

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing a singleton typically involves using a global variable or a public static instance.

#### Pseudo Code (Anti-Pattern)

```typescript
class DatabaseConnection {
    // Public static instance - exposed globally
    public static instance = new DatabaseConnection();
    
    public connectionString: string;
    public isConnected: boolean = false;
    
    // Problem: Constructor is public, allowing multiple instances
    constructor() {
        this.connectionString = "default-connection";
    }
    
    public connect() {
        // Connect to database logic
        this.isConnected = true;
    }
    
    public executeQuery(query: string) {
        // Execute query logic
        return ["results"];
    }
}

// Usage:
// Access through global static instance
DatabaseConnection.instance.connect();

// But nothing prevents creating new instances!
const anotherConnection = new DatabaseConnection();  // This should not be allowed!
anotherConnection.connectionString = "different-connection";
```

#### Issues with Anti-Pattern:

1. **No instance control**: Public constructor allows multiple instances to be created
2. **Global state**: Exposes global mutable state that can be modified from anywhere
3. **Hard to test**: Global state makes unit testing difficult
4. **Hidden dependencies**: Components using the singleton don't explicitly declare the dependency
5. **Initialization timing issues**: Instance is created even if never used

### Proper Pattern Implementation

The proper implementation uses a private constructor and a static method to control instance creation.

#### Pseudo Code (Proper Pattern)

```typescript
class DatabaseConnection {
    // Private static instance - not directly accessible
    private static instance: DatabaseConnection | null = null;
    
    private _connectionString: string;
    private _connected: boolean = false;
    
    // Private constructor prevents external instantiation
    private constructor() {
        this._connectionString = "default-connection";
    }
    
    // Static method to access the singleton instance
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            // Lazy initialization - only created when needed
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    
    public connect(connectionString?: string) {
        if (connectionString) {
            this._connectionString = connectionString;
        }
        // Connect to database logic
        this._connected = true;
    }
    
    public executeQuery(query: string) {
        // Execute query logic
        return ["results"];
    }
    
    public isConnected(): boolean {
        return this._connected;
    }
}

// Usage:
// Can only get the instance through getInstance()
const db1 = DatabaseConnection.getInstance();
db1.connect("production-db");

// This returns the same instance
const db2 = DatabaseConnection.getInstance();
// db1 === db2 will be true
```

#### Benefits of Proper Implementation:

1. **Controlled instance creation**: Private constructor ensures only one instance exists
2. **Lazy initialization**: Instance is created only when first needed
3. **Thread safety**: Can be implemented to be thread-safe in concurrent environments
4. **Explicit access**: getInstance method makes singleton usage explicit
5. **Testability**: Can be enhanced with reset methods for testing or dependency injection

## Visual Comparison

```
┌───────────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                              │
└───────────────────────────────────────────────────────────────┘
  Client 1  ──────►  DatabaseConnection.instance  ◄────  Client 2
                             ▲
                             │
  Client 3  ──────►  new DatabaseConnection()     ◄────  Client 4
                   (Creates independent instances)


┌───────────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                            │
└───────────────────────────────────────────────────────────────┘
                    ┌─────────────────────┐
  Client 1  ───────►│                     │◄────── Client 2
                    │  DatabaseConnection │
                    │   .getInstance()    │
  Client 3  ───────►│                     │◄────── Client 4
                    └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Single Shared      │
                    │     Instance        │
                    └─────────────────────┘
```

## Best Practices

1. Make the constructor private to prevent direct instantiation
2. Provide a static method for accessing the instance
3. Implement lazy initialization to save resources
4. Consider thread-safety in multi-threaded environments
5. For better testability, implement a reset mechanism or dependency injection options

## When to Use

- When a single shared instance must coordinate actions across the system
- When you need to restrict instantiation to exactly one object
- For resources that are expensive to create (database connections, file system access)
- When you need central state management (configurations, caches)

## When to Avoid

- When the singleton state is not actually required to be global
- When you need multiple instances with different configurations
- When tight coupling becomes a concern
- When global state makes testing difficult

## Real-World Examples

### Database Connection Pools
Application servers often implement connection pooling as singletons. The pool manages a limited set of database connections that are shared across the application, preventing resource exhaustion while providing centralized monitoring and configuration.

### Application Loggers
Logging frameworks like Log4j or Winston typically implement their logger as a singleton. This ensures consistent logging behavior across the application, with centralized configuration for log levels, output formats, and destinations.

### Configuration Managers
Applications use singleton configuration managers to maintain consistent settings throughout the system. A single configuration instance loads settings from files or environment variables once and provides them to all components that need them.

### Cache Managers
Memory caches in applications are often implemented as singletons to provide a central point for cache management. This allows for consistent caching policies and efficient memory usage by ensuring all components share the same cache.

### Thread Pools
In multi-threaded applications, thread pools are typically implemented as singletons. This provides centralized management of thread creation, scheduling, and lifecycle, preventing thread proliferation while optimizing resource utilization.

## Open-Source Examples

Here are some examples of the Singleton pattern in popular open-source TypeScript projects:

- **TypeORM**: The connection manager uses a singleton approach to manage database connections.
  - [TypeORM ConnectionManager](https://github.com/typeorm/typeorm/blob/master/src/connection/ConnectionManager.ts)
  - Example: The `ConnectionManager` handles all database connections in the application and ensures proper connection management and reuse.

- **NestJS**: Uses singleton providers for services and controllers by default.
  - [NestJS Core](https://github.com/nestjs/nest/blob/master/packages/core/injector/instance-wrapper.ts)
  - The dependency injection system ensures services are instantiated only once (singleton scope by default).

- **Angular**: Many Angular services are implemented as singletons by using the providedIn: 'root' property.
  - [Angular Core](https://github.com/angular/angular/blob/main/packages/core/src/di/injectable.ts)
  - Example: `@Injectable({ providedIn: 'root' })` creates singleton services.

## Further Considerations

- **Dependency Injection**: Consider using DI frameworks instead of singletons
- **Multithreading**: Ensure thread-safety in concurrent environments
- **Testing**: Design for testability by allowing state resets or mock injections