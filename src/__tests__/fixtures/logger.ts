/**
 * Logger mock for tests
 *
 * This file provides a standardized mock for the logger that can be used across all tests.
 * It mocks the logger's methods and provides a LogColor enum with all the required values.
 */

// Create mock logger functions
const mockLoggerObject = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
};

// Mock the LogColor enum with all possible values
const LogColor = {
    // Observer pattern colors
    PHONE_DISPLAY: 0,
    WEB_DISPLAY: 1,
    SMART_HOME: 2,
    WEATHER_STATION: 3,

    // Standard log colors
    INFO: 4,
    SUCCESS: 5,
    WARNING: 6,
    ERROR: 7,
    EMAIL_ALERT: 8,

    // Command pattern colors
    LIGHT_DEVICE: 9,
    FAN_DEVICE: 10,
    COMMAND_SETUP: 11,
    COMMAND_EXECUTION: 12,
    COMMAND_UNDO: 13,
};

// Setup the mock for the logger module
const mockLoggerModule = {
    logger: mockLoggerObject,
    LogColor,
};

// Jest mock function for ~/utils/logger
export const setupLoggerMock = () => {
    jest.mock('~/utils/logger', () => mockLoggerModule);
};

// Export the logger and LogColor for direct usage in tests
export { mockLoggerObject as logger, LogColor };

/**
 * Resets all logger mock states.
 *
 * This function clears the mock state of all logger methods (e.g., `log`, `info`, `warn`, etc.).
 * Use this in your test suites to ensure that mock states are consistent and do not carry over
 * between tests. Call this function in the `afterEach` or `beforeEach` hooks of your test files.
 */
export const resetLoggerMocks = () => {
    Object.values(mockLoggerObject).forEach((mock) => mock.mockClear());
};
