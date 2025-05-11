import { ImageServiceProxy, ImageGalleryApp, MobileGalleryApp } from './implementation';

describe('Proxy Pattern - Proper Pattern Tests', () => {
    // Mock console.log to silence log messages during tests
    const originalConsoleLog = console.log;
    beforeAll(() => {
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = originalConsoleLog;
    });

    describe('ImageServiceProxy', () => {
        let proxy: ImageServiceProxy;

        beforeEach(() => {
            // Create fresh instances for each test
            proxy = new ImageServiceProxy();
        });

        it('should allow access to public images without authentication', () => {
            // The 'landscape' image is public and accessible to everyone
            const result = proxy.getImage('landscape');
            expect(result).toContain('High-resolution landscape');
        });

        it('should deny access to restricted images without authentication', () => {
            // The 'portrait' image requires authentication
            const result = proxy.getImage('portrait');
            expect(result).toContain('Error: Authentication required');
        });

        it('should allow access to restricted images after authentication', () => {
            // Authenticate first
            proxy.authenticate('admin', 'secret');

            // Now access should be allowed
            const result = proxy.getImage('portrait');
            expect(result).toContain('High-resolution portrait');
        });

        it('should support multiple authentication methods', () => {
            // Web authentication
            const webAuthResult = proxy.authenticate('admin', 'secret');
            expect(webAuthResult).toBe(true);

            // Reset proxy
            proxy = new ImageServiceProxy();

            // Mobile authentication
            const mobileAuthResult = proxy.authenticateWithApiKey('mobile-app-key');
            expect(mobileAuthResult).toBe(true);
        });

        it('should reject invalid authentication credentials', () => {
            const webAuthResult = proxy.authenticate('wrong', 'password');
            expect(webAuthResult).toBe(false);

            const mobileAuthResult = proxy.authenticateWithApiKey('wrong-key');
            expect(mobileAuthResult).toBe(false);
        });

        it('should restrict access to admin features for non-admin users', () => {
            // Authenticate as mobile user
            proxy.authenticateWithApiKey('mobile-app-key');

            // Try to access admin features
            const logs = proxy.getAccessLog();
            expect(logs).toEqual([]);

            // Try to clear cache
            // This won't throw an error but won't work either
            proxy.clearCache();

            // Cache should still work (not cleared)
            proxy.getImage('landscape');
            proxy.getImage('landscape'); // Second call should use cache
        });

        it('should allow access to admin features for admin users', () => {
            // Authenticate as admin
            proxy.authenticate('admin', 'secret');

            // Access a few images to create log entries
            proxy.getImage('landscape');
            proxy.getImage('portrait');

            // Admin should be able to access logs
            const logs = proxy.getAccessLog();
            expect(logs.length).toBe(2);

            // Admin should be able to clear cache
            proxy.clearCache();
        });
    });

    describe('Client interaction with proxy', () => {
        let proxy: ImageServiceProxy;
        let webClient: ImageGalleryApp;
        let mobileClient: MobileGalleryApp;

        beforeEach(() => {
            // Create fresh instances for each test
            proxy = new ImageServiceProxy();
            webClient = new ImageGalleryApp(proxy);
            mobileClient = new MobileGalleryApp(proxy);
        });

        it('should allow web client to work with proxy through ImageService interface', () => {
            // Web client works with the basic interface
            proxy.authenticate('admin', 'secret');

            // The line below should compile and work correctly
            // because webClient only knows about the ImageService interface
            webClient.displayImage('landscape');
        });

        it('should allow mobile client to access mobile-specific proxy features', () => {
            // Mobile client works with the extended interface
            proxy.authenticateWithApiKey('mobile-app-key');

            // Mobile client can use special mobile optimization method
            mobileClient.displayImage('landscape');
        });

        it('should apply mobile optimization to images', () => {
            proxy.authenticateWithApiKey('mobile-app-key');

            const mobileImage = proxy.getMobileOptimizedImage('landscape');
            expect(mobileImage).toContain('Mobile optimized');
            expect(mobileImage).toContain('High-resolution landscape');
        });
    });
});
