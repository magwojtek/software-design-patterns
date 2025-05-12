/**
 * Proxy Anti-Pattern Implementation
 *
 * Issues with this implementation:
 * 1. Client code is handling cross-cutting concerns (authentication, caching, lazy loading)
 * 2. Tight coupling between client and ImageDatabase implementation
 * 3. Violation of Single Responsibility Principle
 * 4. Code duplication across multiple clients
 * 5. Difficult to maintain and extend
 */
import { logger } from '~/utils/logger';

// Resource-intensive service that loads high-resolution images
export class ImageDatabase {
    private images: Map<string, string>;

    constructor() {
        logger.warn('Loading image database... (this operation is expensive)');
        // Simulate expensive initialization
        this.images = new Map<string, string>();
        this.loadImages();
    }

    private loadImages(): void {
        // Simulate loading high-resolution images
        this.images.set('landscape', 'High-resolution landscape image data');
        this.images.set('portrait', 'High-resolution portrait image data');
        this.images.set('architecture', 'High-resolution architecture image data');
        this.images.set('nature', 'High-resolution nature image data');
        logger.success('Image database loaded with 4 high-resolution images');
    }

    public getImage(key: string): string {
        logger.info(`Retrieving image for key: ${key}`);
        return this.images.get(key) || 'Image not found';
    }
}

// Client directly using and managing the resource-intensive ImageDatabase
export class ImageGalleryClient {
    private db: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private isAuthenticated: boolean = false;
    private accessLog: { timestamp: Date; image: string }[] = [];

    constructor(private username: string = 'guest') {}

    authenticate(username: string, password: string): boolean {
        // Simple authentication logic
        const validCredentials = username === 'admin' && password === 'secret';
        this.isAuthenticated = validCredentials;

        if (validCredentials) {
            logger.success(`User ${username} authenticated successfully`);
            this.username = username;
        } else {
            logger.error(`Authentication failed for user ${username}`);
        }

        return this.isAuthenticated;
    }

    getImage(key: string): string {
        // Client has to handle authentication check
        if (!this.isAuthenticated && key !== 'landscape') {
            // Only 'landscape' is accessible to unauthenticated users
            logger.error('Error: Authentication required to access this image');
            return 'Error: Authentication required';
        }

        // Client has to handle access logging
        this.accessLog.push({
            timestamp: new Date(),
            image: key,
        });

        // Client has to implement caching logic
        if (this.cachedImages.has(key)) {
            logger.success(`Returning cached image for key: ${key}`);
            return this.cachedImages.get(key)!;
        }

        // Client has to handle lazy initialization
        if (!this.db) {
            logger.warn('Initializing image database on first use');
            this.db = new ImageDatabase();
        }

        // Get and cache the result
        const image = this.db.getImage(key);
        this.cachedImages.set(key, image);
        return image;
    }

    getAccessLog(): { timestamp: Date; image: string }[] {
        // Client has to handle access control for admin features
        if (this.username !== 'admin') {
            logger.error('Error: Only admin can view access logs');
            return [];
        }
        return this.accessLog;
    }

    clearCache(): void {
        this.cachedImages.clear();
        logger.warn('Cache cleared');
    }
}

// Another client with duplicated code for the same service
export class MobileAppClient {
    private db: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private isAuthenticated: boolean = false;

    authenticate(apiKey: string): boolean {
        // Different authentication method, but same concept
        this.isAuthenticated = apiKey === 'mobile-app-key';

        if (this.isAuthenticated) {
            logger.success('Mobile app authenticated successfully');
        } else {
            logger.error('Mobile app authentication failed');
        }

        return this.isAuthenticated;
    }

    getImage(key: string): string {
        // Duplicate authentication check
        if (!this.isAuthenticated) {
            logger.error('Error: Authentication required for mobile app');
            return 'Error: Authentication required';
        }

        // Duplicate caching logic
        if (this.cachedImages.has(key)) {
            logger.success(`Returning cached image for key: ${key}`);
            return this.cachedImages.get(key)!;
        }

        // Duplicate lazy initialization
        if (!this.db) {
            logger.warn('Initializing image database for mobile app');
            this.db = new ImageDatabase();
        }

        // Different processing for mobile (e.g., resize for mobile screen)
        const image = this.db.getImage(key);
        const mobileOptimizedImage = `Mobile optimized: ${image}`;
        this.cachedImages.set(key, mobileOptimizedImage);
        return mobileOptimizedImage;
    }
}

// Helper function to demonstrate the anti-pattern
export function demonstrateImageClientUsage(): void {
    // First client (web gallery)
    const galleryClient = new ImageGalleryClient();

    // Public image access without authentication
    logger.info('\nAccessing public image without authentication:');
    const publicImage = galleryClient.getImage('landscape'); // This works for public image
    logger.info(`Received: ${publicImage}`);

    // Try to access restricted image without authentication
    logger.info('\nTrying to access restricted image without authentication:');
    galleryClient.getImage('portrait'); // This fails - removed unused variable

    // Authenticate and try again
    logger.info('\nAuthenticating and accessing restricted image:');
    galleryClient.authenticate('admin', 'secret');
    const accessedAfterAuth = galleryClient.getImage('portrait'); // This works now
    logger.info(`Received: ${accessedAfterAuth}`);

    // Access the same image again to demonstrate caching
    logger.info('\nAccessing same image again (should use cache):');
    galleryClient.getImage('portrait'); // Uses cache

    // Access admin feature
    logger.info('\nAccessing admin feature (access logs):');
    const logs = galleryClient.getAccessLog();
    logger.info(`Access log entries: ${logs.length}`);

    // Second client (mobile app) with duplicate code
    logger.info('\nMobile app usage with duplicate code:');
    const mobileClient = new MobileAppClient();
    mobileClient.authenticate('mobile-app-key');
    const mobileImage = mobileClient.getImage('nature');
    logger.info(`Mobile received: ${mobileImage}`);

    // Access again to demonstrate duplicate caching logic
    logger.info('\nMobile accessing same image again (should use cache):');
    mobileClient.getImage('nature'); // Uses cache
}
