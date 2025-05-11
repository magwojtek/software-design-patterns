/**
 * Proxy Pattern Implementation
 *
 * The Proxy pattern provides a surrogate or placeholder for another object to control access to it.
 * This implementation demonstrates a virtual proxy (lazy loading), protection proxy (access control),
 * and cache proxy (performance optimization) all in one.
 *
 * Key components:
 * 1. Subject - common interface for both RealSubject and Proxy
 * 2. RealSubject - the actual object that the proxy represents
 * 3. Proxy - maintains a reference to the RealSubject and controls access to it
 */
import { logger } from '~/utils/logger';

// Subject interface - common interface for both RealSubject and Proxy
export interface ImageService {
    getImage(key: string): string;
}

// RealSubject - the actual resource-intensive service
export class ImageDatabase implements ImageService {
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

// Proxy that handles virtual (lazy loading), protection (access control), and cache functionality
export class ImageServiceProxy implements ImageService {
    private realService: ImageDatabase | null = null;
    private cachedImages: Map<string, string> = new Map();
    private accessLog: { timestamp: Date; username: string; image: string }[] = [];
    private isAuthenticated: boolean = false;
    private username: string = 'guest';

    // Authentication for protection proxy
    public authenticate(username: string, password: string): boolean {
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

    // Alternative authentication for different clients (e.g., mobile app)
    public authenticateWithApiKey(apiKey: string): boolean {
        // Support for different authentication methods
        this.isAuthenticated = apiKey === 'mobile-app-key';

        if (this.isAuthenticated) {
            logger.success('Mobile app authenticated successfully');
            this.username = 'mobile-app';
        } else {
            logger.error('Mobile app authentication failed');
        }

        return this.isAuthenticated;
    }

    public getImage(key: string): string {
        // Access control (protection proxy)
        if (!this.isAuthenticated && key !== 'landscape') {
            // Only 'landscape' is accessible to unauthenticated users
            logger.error('Error: Authentication required to access this image');
            return 'Error: Authentication required';
        }

        // Access logging
        this.logAccess(key);

        // Caching (cache proxy)
        if (this.cachedImages.has(key)) {
            logger.success(`Returning cached image for key: ${key}`);
            return this.cachedImages.get(key)!;
        }

        // Lazy initialization (virtual proxy)
        if (!this.realService) {
            logger.warn('Initializing image database on first use');
            this.realService = new ImageDatabase();
        }

        // Get the image from the real service
        const image = this.realService.getImage(key);

        // Cache the result
        this.cachedImages.set(key, image);

        return image;
    }

    // Method to optimize images for mobile devices
    public getMobileOptimizedImage(key: string): string {
        const image = this.getImage(key);

        // Only process if we got a valid image (not an error message)
        if (!image.startsWith('Error:')) {
            return `Mobile optimized: ${image}`;
        }

        return image;
    }

    // Admin function to get access logs
    public getAccessLog(): { timestamp: Date; username: string; image: string }[] {
        // Access control for admin feature
        if (this.username !== 'admin') {
            logger.error('Error: Only admin can view access logs');
            return [];
        }
        return this.accessLog;
    }

    // Admin function to clear the cache
    public clearCache(): void {
        // Access control for admin feature
        if (this.username !== 'admin') {
            logger.error('Error: Only admin can clear cache');
            return;
        }

        this.cachedImages.clear();
        logger.warn('Cache cleared');
    }

    // Private helper to log access
    private logAccess(key: string): void {
        this.accessLog.push({
            timestamp: new Date(),
            username: this.username,
            image: key,
        });
    }
}

// Client that uses the image service through the interface
export class ImageGalleryApp {
    constructor(private imageService: ImageService) {}

    displayImage(key: string): void {
        const image = this.imageService.getImage(key);
        if (!image.startsWith('Error:')) {
            logger.info(`Displaying image: ${key}`);
            logger.info(`Image data: ${image}`);
        } else {
            logger.error(`Failed to display image: ${image}`);
        }
    }
}

// Mobile client that uses the same service through the same interface
export class MobileGalleryApp {
    constructor(private imageService: ImageServiceProxy) {}

    displayImage(key: string): void {
        // We can use the proxy's special mobile optimization method
        const image = this.imageService.getMobileOptimizedImage(key);
        if (!image.startsWith('Error:')) {
            logger.info(`Displaying mobile image: ${key}`);
            logger.info(`Mobile image data: ${image}`);
        } else {
            logger.error(`Failed to display mobile image: ${image}`);
        }
    }
}

// Admin client with access to admin features
export class AdminConsole {
    constructor(private proxy: ImageServiceProxy) {}

    viewAccessLogs(): void {
        const logs = this.proxy.getAccessLog();
        if (logs.length > 0) {
            logger.info('Access logs:');
            logs.forEach((log) => {
                logger.info(
                    `Time: ${log.timestamp.toISOString()}, User: ${log.username}, Image: ${log.image}`,
                );
            });
        } else {
            logger.warn('No access logs available or access denied');
        }
    }

    clearImageCache(): void {
        this.proxy.clearCache();
    }
}

// Helper function to demonstrate the proper pattern
export function demonstrateProperProxyUsage(): void {
    // Create the proxy
    const imageProxy = new ImageServiceProxy();

    // Create clients that work with the proxy
    const webGallery = new ImageGalleryApp(imageProxy);
    const mobileGallery = new MobileGalleryApp(imageProxy);
    const adminConsole = new AdminConsole(imageProxy);

    // Public image access without authentication
    logger.info('\nAccessing public image without authentication:');
    webGallery.displayImage('landscape'); // This works for public image

    // Try to access restricted image without authentication
    logger.info('\nTrying to access restricted image without authentication:');
    webGallery.displayImage('portrait'); // This fails

    // Authenticate and try again
    logger.info('\nAuthenticating and accessing restricted image:');
    imageProxy.authenticate('admin', 'secret');
    webGallery.displayImage('portrait'); // This works now

    // Access the same image again to demonstrate caching
    logger.info('\nAccessing same image again (should use cache):');
    webGallery.displayImage('portrait'); // Uses cache

    // Access admin feature
    logger.info('\nAccessing admin feature (access logs):');
    adminConsole.viewAccessLogs();

    // Clear cache (admin feature)
    logger.info('\nClearing cache (admin feature):');
    adminConsole.clearImageCache();

    // Mobile client with API key authentication
    logger.info('\nMobile app authentication and usage:');
    imageProxy.authenticateWithApiKey('mobile-app-key');
    mobileGallery.displayImage('nature'); // Gets mobile-optimized version

    // Access again to demonstrate caching on the mobile side
    logger.info('\nMobile accessing same image again (should use cache):');
    mobileGallery.displayImage('nature'); // Uses cache
}
