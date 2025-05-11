# Proxy Pattern

## Overview

The Proxy pattern is a structural design pattern that provides a surrogate or placeholder for another object to control access to it. It lets you create a substitute that acts as an interface to another resource, while also hiding the underlying complexity of the resource.

## Problem

Sometimes direct access to an object isn't desirable due to various reasons:
- The object might be resource-intensive to create (like our image database)
- Access to the object might need to be controlled (authentication and access rights)
- Additional behaviors might need to be added when accessing the object (logging, caching)
- The object might reside in a remote location

Using objects like these directly can lead to code that:
- Creates expensive objects prematurely or unnecessarily
- Mixes business logic with infrastructure concerns like caching and access control
- Duplicates cross-cutting concerns across multiple clients
- Becomes tightly coupled to implementation details

## Diagram

```
       ┌───────────┐
       │  Client   │
       └─────┬─────┘
             │
             ▼
       ┌─────────────┐
       │ «interface» |
       │  Subject    │
       └─────┬───────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌───────────┐ ┌─────────────┐
│   Proxy   │ │ RealSubject │
└─────┬─────┘ └─────────────┘
      │             ▲
      │             │
      └─────────────┘
        delegates to
```

## Anti-Pattern vs Proper Pattern

### Anti-Pattern Implementation

In the anti-pattern approach, clients directly access and manage resource-intensive objects, handling caching, access control, and other cross-cutting concerns themselves.

#### Pseudo Code (Anti-Pattern)

```typescript
// Without Proxy Pattern: Direct interaction with resource-intensive image database

class ImageDatabase {
    private images: Map<string, string>;
    
    constructor() {
        console.log("Loading high-resolution images... (this operation is expensive)");
        // Expensive initialization
        this.images = new Map<string, string>();
        this.loadImages();
    }
    
    private loadImages(): void {
        // Load lots of high-resolution images
        this.images.set("landscape", "High-resolution landscape image data");
        this.images.set("portrait", "High-resolution portrait image data");
        // ... more images
    }
    
    public getImage(key: string): string {
        console.log(`Retrieving image for key: ${key}`);
        return this.images.get(key) || "Image not found";
    }
}

// Client code - needs to handle all concerns directly
class ImageGalleryClient {
    private db: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private isAuthenticated: boolean = false;
    private accessLog: { timestamp: Date; image: string }[] = [];
    
    authenticate(username: string, password: string): boolean {
        // Authentication logic here
        this.isAuthenticated = (username === "admin" && password === "secret");
        return this.isAuthenticated;
    }
    
    getImage(key: string): string {
        // Client has to handle authentication check
        if (!this.isAuthenticated && key !== "landscape") {
            return "Error: Not authenticated";
        }
        
        // Client has to handle access logging
        this.accessLog.push({
            timestamp: new Date(),
            image: key,
        });
        
        // Client has to implement caching logic
        if (this.cachedImages.has(key)) {
            console.log(`Returning cached image for key: ${key}`);
            return this.cachedImages.get(key)!;
        }
        
        // Client has to handle lazy initialization
        if (!this.db) {
            console.log("Initializing image database on first use");
            this.db = new ImageDatabase();
        }
        
        // Get and cache the result
        const image = this.db.getImage(key);
        this.cachedImages.set(key, image);
        return image;
    }
    
    getAccessLog(): { timestamp: Date; image: string }[] {
        // Client has to handle access control for admin features
        if (/* not admin */) {
            return [];
        }
        return this.accessLog;
    }
}

// Another client - duplicating the same logic
class MobileAppClient {
    private db: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private isAuthenticated: boolean = false;
    
    // Duplication of authentication, caching, lazy loading logic...
}
```

#### Issues with Anti-Pattern:

1. **Mixed concerns**: Client code handles business logic, caching, lazy loading, and access control
2. **Tight coupling**: Client is tightly coupled to the concrete ImageDatabase implementation
3. **Code duplication**: Each client needs to implement the same cross-cutting concerns
4. **Maintainability issues**: Changes to access control or caching require updating all clients
5. **Single Responsibility Principle violation**: Client class has too many responsibilities

### Proper Pattern Implementation

The proxy acts as a surrogate for the real object, providing the same interface but adding additional functionality like access control, lazy loading, or caching.

#### Pseudo Code (Proper Pattern)

```typescript
// Subject interface - common interface for both RealSubject and Proxy
interface ImageService {
    getImage(key: string): string;
}

// RealSubject - the actual resource-intensive service
class ImageDatabase implements ImageService {
    private images: Map<string, string>;
    
    constructor() {
        console.log("Loading high-resolution images... (this operation is expensive)");
        // Expensive initialization
        this.images = new Map<string, string>();
        this.loadImages();
    }
    
    private loadImages(): void {
        // Load lots of high-resolution images
        this.images.set("landscape", "High-resolution landscape image data");
        this.images.set("portrait", "High-resolution portrait image data");
        // ... more images
    }
    
    public getImage(key: string): string {
        console.log(`Retrieving image for key: ${key}`);
        return this.images.get(key) || "Image not found";
    }
}

// Proxy
class ImageServiceProxy implements ImageService {
    private realService: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private isAuthenticated: boolean = false;
    private accessLog: { timestamp: Date; username: string; image: string }[] = [];
    
    authenticate(username: string, password: string): boolean {
        // Authentication logic here
        this.isAuthenticated = (username === "admin" && password === "secret");
        return this.isAuthenticated;
    }
    
    public getImage(key: string): string {
        // Access control (protection proxy)
        if (!this.isAuthenticated && key !== "landscape") {
            return "Error: Authentication required";
        }
        
        // Access logging
        this.logAccess(key);
        
        // Caching (cache proxy)
        if (this.cachedImages.has(key)) {
            console.log(`Returning cached image for key: ${key}`);
            return this.cachedImages.get(key)!;
        }
        
        // Lazy initialization (virtual proxy)
        if (!this.realService) {
            console.log("Initializing image database on first use");
            this.realService = new ImageDatabase();
        }
        
        // Forward the call to the real object
        const image = this.realService.getImage(key);
        
        // Cache the result
        this.cachedImages.set(key, image);
        
        return image;
    }
    
    // Additional admin methods specific to the proxy
    getAccessLog(): { timestamp: Date; username: string; image: string }[] {
        if (this.username !== "admin") {
            return [];
        }
        return this.accessLog;
    }
    
    private logAccess(key: string): void {
        this.accessLog.push({
            timestamp: new Date(),
            username: this.username,
            image: key
        });
    }
}

// Client code - simple and focused on business logic
class ImageGalleryApp {
    constructor(private imageService: ImageService) {}
    
    displayImage(key: string): void {
        const image = this.imageService.getImage(key);
        console.log(`Displaying image: ${key}`);
        console.log(`Image data: ${image}`);
    }
}

// Usage
const proxy = new ImageServiceProxy();
proxy.authenticate("admin", "secret");

const client = new ImageGalleryApp(proxy);
client.displayImage("landscape"); // First access: initializes real database
client.displayImage("landscape"); // Second access: uses cached result
```

#### Benefits of Proper Implementation:

1. **Separation of concerns**: Proxy handles access control, caching and lazy initialization
2. **Open/Closed Principle**: Add new functionalities without modifying existing code
3. **Single Responsibility Principle**: Each class has a clear and specific role
4. **Improved testability**: Can easily substitute different proxy implementations
5. **Transparency to client**: Client code works with the subject interface, unaware of the proxy

## Visual Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                       ANTI-PATTERN                              │
└─────────────────────────────────────────────────────────────────┘
┌────────────────┐                  ┌─────────────────────────────┐
│                │                  │                             │
│ ImageGallery   │◄────Direct───────►    ImageDatabase            │
│ Client         │    Access        │                             │
└────────────────┘                  └─────────────────────────────┘
   Contains:
   - Business Logic
   - Authentication
   - Caching
   - Lazy Loading
   - Access Logging
   
┌────────────────┐                   ┌────────────────────────────┐
│                │                   │                            │
│ MobileApp      │◄────Direct───────►│    ImageDatabase           │
│ Client         │    Access         │ (Another instance)         │
└────────────────┘                   └────────────────────────────┘
   Duplicates:
   - Authentication
   - Caching
   - Lazy Loading


┌───────────────────────────────────────────────────────────────────┐
│                         PROPER PATTERN                            │
└───────────────────────────────────────────────────────────────────┘
┌──────────────┐      ┌──────────────┐     ┌────────────────────────┐
│              │      │ «interface»  │     │                        │
│ ImageGallery │◄────►│ ImageService │     │   ImageDatabase        │
│ App          │      │              │     │                        │
└──────────────┘      └──────┬───────┘     └────────────┬───────────┘
                             │                          │
                             │                          │
                             ▼                          │
                  ┌───────────────────┐                 │
                  │ ImageServiceProxy │◄────────────────┘
                  └───────────────────┘
                     Handles:
                     - Authentication
                     - Access Control
                     - Caching
                     - Lazy Loading
                     - Access Logging

┌───────────────┐           
│               │     
│ MobileGallery │────────►│
│ App           │         │ 
└───────────────┘         │
                          │
                          │ Uses the same proxy
                          │ instance
                          ▼   
                  ┌───────────────────┐
                  │ ImageServiceProxy │
                  └───────────────────┘
```

## Best Practices

1. Implement the same interface as the real subject to ensure transparency to clients
2. Consider using different types of proxies for different purposes:
   - Virtual Proxy: Delays creation of expensive objects until needed (our ImageDatabase)
   - Protection Proxy: Controls access to the real subject (authentication in our example)
   - Remote Proxy: Represents objects in different address spaces
   - Cache Proxy: Stores results of expensive operations (image caching in our example)
   - Logging Proxy: Logs all operations (access logs in our example)
3. Use the proxy pattern when you need to add cross-cutting concerns without modifying the real subject
4. Be careful not to add too much logic to the proxy - it should primarily delegate to the real subject
5. Consider combining proxy with other patterns like Factory Method to provide clients with appropriate proxies

## When to Use

- When you need lazy initialization of a resource-heavy object (like our image database)
- When you need to implement access control to a sensitive object (restricting certain images)
- When you need to add logging, caching, or monitoring without modifying the real object
- When you need a local representative for a remote object
- When you need to add thread safety to an existing object

## When to Avoid

- When the proxy would add unnecessary complexity for simple objects
- When direct access to the real object is required for performance reasons
- When the proxy would significantly change the behavior of the real subject
- When the interface of the real subject frequently changes, making it difficult to maintain the proxy

## Further Considerations

- **Proxy Chains**: Multiple proxies can be chained together to add different layers of functionality
- **Dynamic Proxies**: Some languages support creating proxies at runtime
- **Smart References**: Proxies can be used to manage references and resource cleanup
- **Combination with other patterns**: 
  - In our example, we could use Factory Method to create different types of proxies for different clients
  - We could apply the Decorator pattern to add image filtering capabilities without modifying the proxy
  - A Facade could use our proxy to provide a simpler interface for a complex subsystem