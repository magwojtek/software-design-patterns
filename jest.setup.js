// Mock Winston transports to suppress logging in tests
jest.mock('winston', () => {
    const mockFormat = {
        combine: jest.fn().mockReturnThis(),
        timestamp: jest.fn().mockReturnThis(),
        printf: jest.fn().mockReturnThis(),
    };

    return {
        format: mockFormat,
        createLogger: jest.fn().mockReturnValue({
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        }),
        transports: {
            Console: jest.fn(),
        }
    };
});

// Mock native console methods to prevent console output during tests
global.console.log = jest.fn();
global.console.info = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
global.console.debug = jest.fn();
