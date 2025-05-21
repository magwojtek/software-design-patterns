# Chain of Responsibility Pattern

## Overview

The Chain of Responsibility pattern is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

## Problem

In many scenarios, we need to process a request through multiple handlers:

- Multiple objects may need to handle a request, but the exact handler isn't known in advance
- A request needs to be processed by multiple handlers in a specific sequence
- The set of handlers that process a request should be configurable at runtime
- The client shouldn't be aware of the chain's structure

## Diagram

```
┌─────────────────────────────┐
│        Handler              │
├─────────────────────────────┤
│ + setNext(handler)          │
│ + handle(request)           │
├─────────────────────────────┤
│ # handleRequest(request)    │
│ # canHandle(request)        │
└──────────────┬──────────────┘
               │
               │ extends
               │
               ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   ConcreteHandlerA   │     │   ConcreteHandlerB   │     │   ConcreteHandlerC   │
├──────────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ # canHandle(request) │     │ # canHandle(request) │     │ # canHandle(request) │
│ # handleRequest()    │     │ # handleRequest()    │     │ # handleRequest()    │
└──────────────────────┘     └──────────────────────┘     └──────────────────────┘
         ↑                             ↑                             ↑
         │                             │                             │
         └─────────────────────────────┼─────────────────────────────┘
                                       │
                                       │ passes to
                                       │
                                  ┌────┴────┐
                                  │ Request │
                                  └─────────┘
```

## Scenario

Imagine you're building an expense approval system for a company that needs to process expense requests through different levels of management based on the expense amount.

**The problem:**
1. Different expense amounts require approval from different levels of management
2. The approval process follows a hierarchical structure (Team Lead → Manager → Director → CEO → Board)
3. Each approver has a specific approval limit
4. If an approver can't handle a request, it should be passed to the next level
5. We need to be able to reconfigure the approval chain without modifying client code

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

The anti-pattern approach to implementing a chain of responsibility typically involves hard-coded approval logic and tight coupling between the client and handlers.

#### Pseudo Code (Anti-Pattern)

```typescript
// Monolithic expense processor with hard-coded approval logic
export class ExpenseProcessor {
    public processExpense(expense: Expense): boolean {
        // Hard-coded approval chain with tight coupling
        if (expense.amount <= 1000) {
            console.log(`Team Lead approved expense #${expense.id} for $${expense.amount}`);
            return true;
        } else if (expense.amount <= 5000) {
            console.log(`Manager approved expense #${expense.id} for $${expense.amount}`);
            return true;
        } else if (expense.amount <= 20000) {
            console.log(`Director approved expense #${expense.id} for $${expense.amount}`);
            return true;
        } else if (expense.amount <= 100000) {
            console.log(`CEO approved expense #${expense.id} for $${expense.amount}`);
            return true;
        } else {
            console.log(`Board approval required for expense #${expense.id}`);
            // Simulate board approval
            if (expense.amount <= 500000) {
                console.log(`Board approved expense #${expense.id} for $${expense.amount}`);
                return true;
            } else {
                console.log(`Expense #${expense.id} was rejected as too high`);
                return false;
            }
        }
    }
}

// Separate classes with duplicated logic and no chain structure
export class TeamLeadApprover {
    public approve(expense: Expense): boolean {
        if (expense.amount <= 1000) {
            console.log(`Team Lead approved expense #${expense.id} for $${expense.amount}`);
            return true;
        }
        return false;
    }
}

export class ManagerApprover {
    public approve(expense: Expense): boolean {
        if (expense.amount <= 5000) {
            console.log(`Manager approved expense #${expense.id} for $${expense.amount}`);
            return true;
        }
        return false;
    }
}

// Client code with hard-coded approval logic
export class ExpenseSystem {
    private teamLead = new TeamLeadApprover();
    private manager = new ManagerApprover();
    private director = new DirectorApprover();
    
    public processExpense(expense: Expense): boolean {
        // Hard-coded approval chain with client managing the flow
        if (this.teamLead.approve(expense)) {
            return true;
        } else if (this.manager.approve(expense)) {
            return true;
        } else if (this.director.approve(expense)) {
            return true;
        } else {
            console.log(`No one could approve expense #${expense.id}`);
            return false;
        }
    }
}
```

#### Anti-Pattern Diagram

```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  TeamLeadApprover │  │  ManagerApprover  │  │ DirectorApprover  │
├───────────────────┤  ├───────────────────┤  ├───────────────────┤
│ + approve()       │  │ + approve()       │  │ + approve()       │
└───────────────────┘  └───────────────────┘  └───────────────────┘
         ↑                      ↑                      ↑
         |                      |                      |
         └──────────────────────┼──────────────────────┘
                                |
                       ┌────────┴─────────┐
                       │  ExpenseSystem   │
                       ├──────────────────┤
                       │ + processExpense │
                       └──────────────────┘
                                |
                                | creates and manages
                                ↓
                       ┌────────────────┐
                       │ Client Code    │
                       └────────────────┘
```

#### Issues with Anti-Pattern:

1. **Tight coupling**: Client code is tightly coupled to specific handlers
2. **Hard-coded logic**: Approval chain is hard-coded in the client or processor
3. **No standardized structure**: Each handler has its own method and implementation
4. **Difficult to modify**: Changing the chain requires modifying existing code
5. **Not extensible**: Adding new handlers requires modifying client code

### Proper Pattern Implementation

The proper implementation uses an abstract handler class that defines the chain structure and allows dynamic configuration.

#### Pseudo Code (Proper Pattern)

```typescript
// Abstract handler class that defines the chain structure
export abstract class ExpenseHandler {
    private nextHandler: ExpenseHandler | null = null;

    // Set the next handler in the chain
    public setNext(handler: ExpenseHandler): ExpenseHandler {
        this.nextHandler = handler;
        return handler;
    }

    // The template method that defines the handling algorithm
    public handleExpense(expense: Expense): boolean {
        // If this handler can process the request, do it
        if (this.canHandle(expense)) {
            this.processExpense(expense);
            return true;
        }
        
        // Otherwise, pass to the next handler if available
        if (this.nextHandler) {
            console.log(`Passing expense request to ${this.nextHandler.getName()}`);
            return this.nextHandler.handleExpense(expense);
        }
        
        // If no handler can process the request
        console.log(`No handler could approve expense of $${expense.amount}`);
        return false;
    }

    // These methods must be implemented by concrete handlers
    protected abstract canHandle(expense: Expense): boolean;
    protected abstract processExpense(expense: Expense): void;
    protected abstract getName(): string;
}

// Concrete handler for team lead approval
export class TeamLeadExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 1000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        console.log(`Team Lead approved expense #${expense.id} for $${expense.amount}`);
    }

    protected getName(): string {
        return 'Team Lead';
    }
}

// Concrete handler for manager approval
export class ManagerExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 5000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        console.log(`Manager approved expense #${expense.id} for $${expense.amount}`);
    }

    protected getName(): string {
        return 'Manager';
    }
}

// Client code
// Create the handler objects
const teamLead = new TeamLeadExpenseHandler();
const manager = new ManagerExpenseHandler();
const director = new DirectorExpenseHandler();

// Set up the chain
teamLead.setNext(manager);
manager.setNext(director);

// Process an expense through the chain
const expense = { id: 1, amount: 3000, purpose: 'Team event' };
teamLead.handleExpense(expense);
```

#### Proper Pattern Diagram

```
┌───────────────────────────────────────┐
│           ExpenseHandler              │
├───────────────────────────────────────┤
│ + setNext(handler)                    │
│ + handleExpense(expense)              │
├───────────────────────────────────────┤
│ # abstract canHandle(expense)         │
│ # abstract processExpense(expense)    │
│ # abstract getName()                  │
└─────────────────────┬─────────────────┘
                      │
                      │ extends
          ┌───────────┼───────────┬───────────────┐
          │           │           │               │
          ▼           ▼           ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ TeamLeadHandler │ │ ManagerHandler  │ │ DirectorHandler │ ...
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ # canHandle()   │ │ # canHandle()   │ │ # canHandle()   │
│ # processExp()  │ │ # processExp()  │ │ # processExp()  │
│ # getName()     │ │ # getName()     │ │ # getName()     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
        │                   ▲                   ▲
        │                   │                   │
        └───────────────────┘                   │
                │                               │
                └───────────────────────────────┘
                            passes to
```

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────┐     ┌──────────┐     ┌──────────┐           │
│  │ Handler1│     │ Handler2 │     │ Handler3 │           │
│  └─────────┘     └──────────┘     └──────────┘           │
│       ▲               ▲               ▲                  │
│       │               │               │                  │
│       └───────────────┼───────────────┘                  │
│                       │                                  │
│                 ┌─────┴─────┐                            │
│                 │  Client   │                            │
│                 └───────────┘                            │
│                                                          │
│ • Client knows about all handlers                        │
│ • Client manages the chain flow                          │
│ • Hard-coded approval logic                              │
│ • Tight coupling                                         │
│ • No standardized handling structure                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐          │
│  │ Handler1 │────▶│ Handler2 │────▶│ Handler3 │────▶ ... │
│  └──────────┘     └──────────┘     └──────────┘          │
│       ▲                                                  │
│       │                                                  │
│  ┌────┴────┐                                             │
│  │ Client  │                                             │
│  └─────────┘                                             │
│                                                          │
│ • Client only knows about the first handler              │
│ • Handlers manage the chain flow                         │
│ • Standardized handling structure                        │
│ • Loose coupling                                         │
│ • Dynamic chain configuration                            │
└──────────────────────────────────────────────────────────┘
```

## Benefits of Chain of Responsibility Pattern

1. **Decoupling**: Decouples senders from receivers of a request
2. **Single Responsibility**: Each handler focuses on its specific responsibility
3. **Flexibility**: Chain can be configured dynamically at runtime
4. **Open/Closed Principle**: New handlers can be added without changing existing code
5. **Reduced Conditional Complexity**: Eliminates complex conditional statements

## When to Use

- When multiple objects may handle a request, and the handler isn't known in advance
- When you want to issue a request to one of several objects without specifying the receiver explicitly
- When the set of handlers that can process a request should be specified dynamically
- When you want to decouple the sender of a request from its receivers

## When to Avoid

- When the request handling logic is simple and doesn't require a chain
- When the chain structure is fixed and known in advance
- When the overhead of creating and maintaining the chain isn't justified
- When immediate handling of requests is required (chains can add processing overhead)

## Real-World Examples

1. **Exception Handling**: In Java, exceptions propagate up the call stack until caught by an appropriate handler.
2. **Event Bubbling**: In DOM event handling, events propagate from the target element up through its ancestors.
3. **Middleware**: In web frameworks like Express.js, requests pass through a chain of middleware functions.
4. **Servlet Filters**: In Java web applications, HTTP requests pass through a chain of filters.

## Code Example

```typescript
// In Java's Servlet API
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    // Pre-processing
    // ...
    
    // Pass the request along the filter chain
    chain.doFilter(request, response);
    
    // Post-processing
    // ...
}

// In Express.js middleware
app.use((req, res, next) => {
    // Pre-processing
    // ...
    
    // Pass to next middleware
    next();
    
    // Post-processing (after response)
    // ...
});
```

## Open-Source Examples

### 1. Express.js Middleware

Express.js, a popular Node.js web framework, uses the Chain of Responsibility pattern for its middleware system:

```javascript
const express = require('express');
const app = express();

// Middleware 1: Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass to next handler in the chain
});

// Middleware 2: Authentication
app.use((req, res, next) => {
  if (req.headers.authorization) {
    next(); // Authenticated, continue to next handler
  } else {
    res.status(401).send('Unauthorized'); // Break the chain
  }
});

// Middleware 3: Route handler
app.get('/api/data', (req, res) => {
  res.json({ data: 'Here is your data' }); // End of the chain
});
```

### 2. NestJS Interceptors

NestJS, a TypeScript framework for building scalable server-side applications, uses interceptors that implement the Chain of Responsibility pattern:

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    
    console.log(`[Request] ${method} ${url}`);
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        console.log(`[Response] ${method} ${url} ${Date.now() - now}ms`);
      }),
    );
  }
}

// Usage in a controller
@Controller('items')
@UseInterceptors(LoggingInterceptor, CacheInterceptor)
export class ItemsController {
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
```

### 3. TypeORM Entity Subscribers

TypeORM, a TypeScript ORM for databases, uses entity subscribers that form a chain of responsibility for entity events:

```typescript
@EventSubscriber()
export class UserSubscriber implements EntitySubscriber<User> {
  listenTo() {
    return User;
  }
  
  beforeInsert(event: InsertEvent<User>) {
    // Hash password before saving
    if (event.entity.password) {
      event.entity.password = bcrypt.hashSync(event.entity.password, 10);
    }
    // Continue to next subscriber in the chain
  }
  
  afterInsert(event: InsertEvent<User>) {
    // Send welcome email
    const emailService = new EmailService();
    emailService.sendWelcomeEmail(event.entity.email);
    // Continue to next subscriber
  }
}

// Another subscriber in the chain
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriber<any> {
  beforeUpdate(event: UpdateEvent<any>) {
    // Add audit information
    event.entity.updatedAt = new Date();
    event.entity.updatedBy = getCurrentUser();
    // Continue to next subscriber
  }
}
```

## Further Considerations

### 1. Performance Implications

When implementing the Chain of Responsibility pattern, consider the performance impact:

- **Chain Length**: Long chains may impact performance as requests pass through many handlers
- **Early Termination**: Design handlers to quickly determine if they can process a request
- **Caching**: Consider caching results for common requests that pass through the chain

### 2. Error Handling and Recovery

Robust chain implementations should address error handling:

- **Exception Propagation**: Decide whether exceptions should break the chain or be handled locally
- **Fallback Handlers**: Consider adding fallback handlers at the end of the chain
- **Logging**: Log which handlers processed or rejected a request for debugging

### 3. Dynamic Chain Configuration

For more flexible systems, consider making the chain configurable at runtime:

- **Chain Builder**: Implement a builder class to construct chains with different configurations
- **Configuration-Driven**: Allow chain setup to be defined in configuration files
- **Dependency Injection**: Use DI containers to wire up handler chains based on application context

### 4. Combining with Other Patterns

The Chain of Responsibility pattern works well with other design patterns:

- **Command**: Encapsulate requests as command objects that pass through the chain
- **Composite**: Use the Composite pattern to create tree-structured handler hierarchies
- **Decorator**: Add behavior to handlers using decorators without affecting other handlers
- **Observer**: Notify observers about the processing state of requests in the chain

## Conclusion

The Chain of Responsibility pattern provides a flexible and decoupled way to process requests through a series of handlers. It promotes the single responsibility principle by separating different aspects of request processing into distinct handlers and supports the open/closed principle by allowing new handlers to be added without modifying existing code.

By organizing handlers in a chain and allowing each to decide whether to process a request or pass it along, this pattern creates systems that are more maintainable, extensible, and adaptable to changing requirements. The pattern is particularly valuable in scenarios where the exact sequence of processing steps isn't known in advance or may change dynamically.

When implemented thoughtfully, with attention to performance considerations and proper error handling, the Chain of Responsibility pattern can significantly improve the structure and flexibility of request processing systems.
