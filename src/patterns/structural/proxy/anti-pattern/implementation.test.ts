import { ImageGalleryClient, MobileAppClient } from './implementation';

describe('Proxy Pattern - Anti-Pattern Tests', () => {
    // Mock console.log to silence log messages during tests
    const originalConsoleLog = console.log;
    beforeAll(() => {
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    describe('ImageGalleryClient', () => {
        let client: ImageGalleryClient;

        beforeEach(() => {
            // Create a fresh client for each test
            client = new ImageGalleryClient();
        });

        it('should allow access to public images without authentication', () => {
            // The 'landscape' image is public and accessible to everyone
            const result = client.getImage('landscape');
            expect(result).toContain('High-resolution landscape');
        });

        it('should deny access to restricted images without authentication', () => {
            // The 'portrait' image requires authentication
            const result = client.getImage('portrait');
            expect(result).toContain('Error: Authentication required');
        });

        it('should allow access to restricted images after authentication', () => {
            // Authenticate first
            client.authenticate('admin', 'secret');

            // Now access should be allowed
            const result = client.getImage('portrait');
            expect(result).toContain('High-resolution portrait');
        });

        it('should reject invalid authentication credentials', () => {
            const result = client.authenticate('wrong', 'password');
            expect(result).toBe(false);
        });

        it('should restrict access to admin features for regular users', () => {
            // Regular user can't access admin features
            const logs = client.getAccessLog();
            expect(logs).toEqual([]);
        });

        it('should allow access to admin features for admin users', () => {
            // Authenticate as admin
            client.authenticate('admin', 'secret');

            // Access a few images to create log entries
            client.getImage('landscape');
            client.getImage('portrait');

            // Admin should be able to access logs
            const logs = client.getAccessLog();
            expect(logs.length).toBe(2);
        });
    });

    describe('MobileAppClient', () => {
        let mobileClient: MobileAppClient;

        beforeEach(() => {
            // Create a fresh mobile client for each test
            mobileClient = new MobileAppClient();
        });

        it('should deny access without authentication', () => {
            const result = mobileClient.getImage('landscape');
            expect(result).toContain('Error: Authentication required');
        });

        it('should allow access after authentication', () => {
            mobileClient.authenticate('mobile-app-key');

            const result = mobileClient.getImage('landscape');
            expect(result).toContain('Mobile optimized');
            expect(result).toContain('High-resolution landscape');
        });

        it('should reject invalid API key', () => {
            const result = mobileClient.authenticate('wrong-key');
            expect(result).toBe(false);
        });
    });
});
