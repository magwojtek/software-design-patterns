# Facade Pattern

## Overview

The Facade pattern is a structural design pattern that provides a simplified interface to a complex subsystem of classes, library, or framework. It defines a higher-level interface that makes the subsystem easier to use by reducing complexity and hiding the implementation details.

## Example Implementation

In our example implementation, we demonstrate the Facade pattern by creating a user management system with multiple subsystems:

- **DatabaseConnection**: Manages database connections and queries
- **AuthenticationService**: Handles user authentication
- **ValidationService**: Validates user inputs
- **UserDataService**: Provides access to user data

The anti-pattern implementation requires clients to interact with all these subsystems directly, coordinating their operations and managing their lifecycle. The proper pattern implementation introduces a `UserSystemFacade` that encapsulates all these subsystems behind a simple, unified interface.

## Problem

When working with complex systems that consist of many classes and interactions:

- Client code may need to interact with multiple classes and understand their relationships
- Implementation details of subsystems may leak into client code, creating tight coupling
- Changes in subsystems may affect client code that directly uses them
- Clients may only need a small subset of a subsystem's functionality, but are exposed to its full complexity

Examples include working with multimedia frameworks, database libraries, complex API integrations, or any system with numerous interacting components.

## Diagram

```
┌─────────────┐        ┌──────────────────────────────────────────────────┐
│             │        │          User Management Subsystem               │
│   Client    │        │ ┌──────────────┐  ┌─────────────────────┐        │
│             │───────▶│ │  Database    │  │  Authentication     │        │
└─────────────┘        │ │ Connection   │  │  Service            │        │
      │                │ └──────────────┘  └─────────────────────┘        │
      │                │                                                  │
      │                │ ┌──────────────┐  ┌─────────────────────┐        │
      │                │ │ Validation   │  │  UserData           │        │
      │                │ │ Service      │  │  Service            │        │
      │                │ └──────────────┘  └─────────────────────┘        │
      │                └──────────────────────────────────────────────────┘
      │                                    ▲
      │                                    │
      │                     ┌──────────────┴───────────────┐
      └────────────────────▶│     UserSystemFacade         │
                            └──────────────────────────────┘
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach exposes the entire user management subsystem to clients, forcing them to interact directly with multiple classes and understand the complex relationships between them.

#### Pseudo Code (Anti-Pattern)

```typescript
// Subsystem classes
class DatabaseConnection {
  public connect(connectionString: string): boolean {
    console.log(`Connected to database: ${connectionString}`);
    return true;
  }
  
  public executeQuery(query: string): UserData[] {
    console.log(`Executing query: ${query}`);
    return [{ id: 1, data: 'Sample result' }];
  }
  
  public disconnect(): void {
    console.log('Disconnected from database');
  }
}

class AuthenticationService {
  public login(username: string, password: string): boolean {
    if (password.length > 3) {
      console.log(`User "${username}" logged in successfully`);
      return true;
    }
    console.log('Login failed: Invalid credentials');
    return false;
  }
  
  public logout(): void {
    console.log('User logged out');
  }
}

class ValidationService {
  public validateUserId(id: number): boolean {
    if (id > 0) {
      console.log(`User ID ${id} is valid`);
      return true;
    }
    console.log(`Invalid User ID: ${id}`);
    return false;
  }
  
  public validateUsername(username: string): boolean {
    if (username.length >= 3) {
      console.log(`Username "${username}" is valid`);
      return true;
    }
    console.log(`Invalid username: "${username}"`);
    return false;
  }
}

class UserDataService {
  private dbConnection: DatabaseConnection | null = null;
  
  public setConnection(connection: DatabaseConnection): void {
    this.dbConnection = connection;
  }
  
  public getUserData(userId: number): UserData | null {
    if (!this.dbConnection) {
      console.log('Database connection not set');
      return null;
    }
    const results = this.dbConnection.executeQuery(`SELECT * FROM users WHERE id = ${userId}`);
    return results.length > 0 ? results[0] : null;
  }
}

// Client code using the subsystem directly
function getUserInfo(username: string, password: string, userId: number): UserData | null {
  // Create instances of all subsystem components
  const dbConnection = new DatabaseConnection();
  const authService = new AuthenticationService();
  const validationService = new ValidationService();
  const userDataService = new UserDataService();
  
  // Client must coordinate all subsystem interactions
  console.log(`Attempting to get data for user ID: ${userId}`);
  
  // Validate inputs
  if (!validationService.validateUserId(userId)) {
    return null;
  }
  
  if (!validationService.validateUsername(username)) {
    return null;
  }
  
  // Connect to database
  dbConnection.connect('mongodb://localhost:27017/userdb');
  
  // Set database connection for user service
  userDataService.setConnection(dbConnection);
  
  // Authenticate user
  if (!authService.login(username, password)) {
    dbConnection.disconnect();
    return null;
  }
  
  // Get user data
  const userData = userDataService.getUserData(userId);
  
  // Clean up resources
  authService.logout();
  dbConnection.disconnect();
  
  return userData;
}
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Client code is coupled directly to all subsystem classes
2. **Complex client code**: Client must understand all the implementation details of the subsystem
3. **Violation of Single Responsibility Principle**: Client has to orchestrate the interactions between subsystem components
4. **Reduced reusability**: When subsystem usage patterns change, all client code must be updated
5. **Poor maintainability**: Changes in the subsystem might require changes in all client code

### Proper Pattern Implementation

The proper implementation introduces a facade class that provides a simple, unified interface to the complex user management subsystem.

#### Pseudo Code (Proper Pattern)

```typescript
// Subsystem classes (same as in the anti-pattern)
class DatabaseConnection {
  // Same implementation as before
}

class AuthenticationService {
  // Same implementation as before
}

class ValidationService {
  // Same implementation as before
}

class UserDataService {
  // Same implementation as before
}

// Facade class that simplifies interaction with the subsystem
class UserSystemFacade {
  private dbConnection: DatabaseConnection;
  private authService: AuthenticationService;
  private validationService: ValidationService;
  private userDataService: UserDataService;
  
  constructor(dbConnectionString: string = 'mongodb://localhost:27017/userdb') {
    console.log('Creating UserSystemFacade');
    
    // Initialize subsystem components
    this.dbConnection = new DatabaseConnection();
    this.authService = new AuthenticationService();
    this.validationService = new ValidationService();
    this.userDataService = new UserDataService();
    
    // Configure the subsystem
    this.dbConnection.connect(dbConnectionString);
    this.userDataService.setConnection(this.dbConnection);
  }
  
  // Simple methods that hide subsystem complexity
  public getUserInfo(username: string, password: string, userId: number): UserData | null {
    console.log(`Getting user info for ID: ${userId}`);
    
    // Validate inputs
    if (!this.validateUserInputs(username, userId)) {
      return null;
    }
    
    // Authenticate user
    if (!this.authService.login(username, password)) {
      return null;
    }
    
    // Get user data
    const userData = this.userDataService.getUserData(userId);
    
    // Clean up
    this.authService.logout();
    
    return userData;
  }
  
  public updateUserProfile(username: string, password: string, userId: number, newData: UserData): boolean {
    console.log(`Updating profile for user ID: ${userId}`);
    
    // Implementation details hidden from client
    // ...
    
    return true;
  }
  
  // Clean up resources
  public shutdown(): void {
    console.log('Shutting down user system');
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
    }
    this.dbConnection.disconnect();
  }
  
  // Private helper method
  private validateUserInputs(username: string, userId: number): boolean {
    return (
      this.validationService.validateUsername(username) && 
      this.validationService.validateUserId(userId)
    );
  }
}

// Client code using the facade
function getUserInfo(username: string, password: string, userId: number): UserData | null {
  const userFacade = new UserSystemFacade();
  
  // Simple single call to the facade
  const userData = userFacade.getUserInfo(username, password, userId);
  
  // Clean up resources through facade
  userFacade.shutdown();
  
  return userData;
}
```

#### Benefits of Proper Implementation:

1. **Simplified interface**: Clients interact with one facade instead of multiple subsystem classes
2. **Loose coupling**: Clients are decoupled from the implementation details of the subsystem
3. **Single responsibility**: The facade handles the orchestration of subsystem components
4. **Improved maintainability**: Changes to the subsystem don't affect client code as long as the facade interface remains unchanged
5. **Better reusability**: Common usage patterns are encapsulated within the facade and can be reused across multiple clients

## Visual Comparison

```
┌────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                             │
└────────────────────────────────────────────────────────────────┘
                   ┌───────────┐
                   │  Client   │
                   └─────┬─────┘
                         │
          ┌──────────────┼─────────────────┬──────────────┐
          │              │                 │              │
          ▼              ▼                 ▼              ▼
  ┌─────────────┐ ┌────────────────┐ ┌────────────┐ ┌───────────┐
  │  Database   │ │ Authentication │ │ Validation │ │ UserData  │
  │ Connection  │ │   Service      │ │  Service   │ │ Service   │
  └─────────────┘ └────────────────┘ └────────────┘ └───────────┘
   - Client depends on multiple subsystem classes
   - Client must coordinate all interactions
   - Client is tightly coupled to the subsystem


┌────────────────────────────────────────────────────────────────┐
│                      PROPER PATTERN                            │
└────────────────────────────────────────────────────────────────┘
                   ┌───────────┐
                   │  Client   │
                   └─────┬─────┘
                         │
                         ▼
                 ┌───────────────────┐
                 │ UserSystemFacade  │
                 └─────────┬─────────┘
                           │
          ┌────────────────┼────────────────┬──────────────┐
          │                │                │              │
          ▼                ▼                ▼              ▼
   ┌─────────────┐ ┌────────────────┐ ┌────────────┐ ┌───────────┐
   │  Database   │ │ Authentication │ │ Validation │ │ UserData  │
   │ Connection  │ │   Service      │ │  Service   │ │ Service   │
   └─────────────┘ └────────────────┘ └────────────┘ └───────────┘
   - Client depends only on the Facade
   - Facade coordinates subsystem interactions
   - Client is decoupled from the subsystem
```

## Best Practices

1. Make the facade provide a simple default view of the subsystem while still allowing access to more specific functionality if needed
2. Design facades to decouple clients from subsystems, not to hide implementation details entirely
3. Use multiple facades for different use cases or client groups
4. Consider making facades stateless when possible for better reuse
5. Avoid turning facades into "god objects" that do too much — keep them focused on providing simplified interfaces
6. Use composition rather than inheritance to create facades

## When to Use

- When you want to provide a simple interface to a complex subsystem
- When there are many dependencies between clients and implementation classes
- When you want to layer your subsystems and use facades as entry points to each layer
- When you need to integrate with a complex third-party library but only use a small portion of its functionality
- When you're creating a library and want to provide a simplified API to common use cases

## When to Avoid

- When simplicity is not a concern and clients need direct access to subsystem components
- When the subsystem is already simple or well-designed with clear interfaces
- When you're creating a thin wrapper that doesn't provide any actual simplification
- When you risk creating a "god object" that does too much or knows too much

## Further Considerations

- **Adapter vs Facade**: While both simplify interfaces, adapters make incompatible interfaces work together, while facades simplify existing interfaces
- **Access to subsystem**: Consider whether to allow direct access to subsystem components in addition to the facade
- **Dependency injection**: Consider using dependency injection to provide subsystem components to the facade
- **Multiple facades**: Different facades can provide different views of the same subsystem for different clients
- **Facade hierarchy**: Facades can be organized hierarchically for increasingly complex operations