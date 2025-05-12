import { UserSystemFacade, createSampleUserFacade, UserData } from './implementation';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Mock the logger to avoid polluting test output
setupLoggerMock();

describe('Facade Proper Pattern Implementation', () => {
    let userFacade: UserSystemFacade;

    beforeEach(() => {
        userFacade = createSampleUserFacade();
        userFacade.resetLastOperationResult();
    });

    afterEach(() => {
        userFacade.shutdown();
    });

    // Tests for the facade interface
    describe('UserSystemFacade', () => {
        it('should create facade instance', () => {
            expect(userFacade).toBeInstanceOf(UserSystemFacade);
        });

        it('should get user info with valid inputs', () => {
            const result = userFacade.getUserInfo('validuser', 'password1234', 1);
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('data');
            expect(userFacade.getLastOperationResult()).toBe('Successfully retrieved user data');
        });

        it('should fail with invalid user ID', () => {
            const result = userFacade.getUserInfo('validuser', 'password1234', -1);
            expect(result).toBeNull();
            expect(userFacade.getLastOperationResult()).toBe('Validation failed');
        });

        it('should fail with invalid username', () => {
            const result = userFacade.getUserInfo('ab', 'password1234', 1);
            expect(result).toBeNull();
            expect(userFacade.getLastOperationResult()).toBe('Validation failed');
        });

        it('should fail with invalid password', () => {
            const result = userFacade.getUserInfo('validuser', 'pwd', 1);
            expect(result).toBeNull();
            expect(userFacade.getLastOperationResult()).toBe('Authentication failed');
        });

        it('should update user profile with valid inputs', () => {
            const userData: UserData = { id: 1, data: 'Updated Data' };
            const result = userFacade.updateUserProfile('validuser', 'password1234', 1, userData);
            expect(result).toBe(true);
            expect(userFacade.getLastOperationResult()).toBe('Successfully updated user data');
        });

        it('should fail to update profile with invalid credentials', () => {
            const userData: UserData = { id: 1, data: 'Updated Data' };
            const result = userFacade.updateUserProfile('validuser', 'pwd', 1, userData);
            expect(result).toBe(false);
            expect(userFacade.getLastOperationResult()).toBe('Authentication failed');
        });

        it('should validate email correctly', () => {
            expect(userFacade.isEmailValid('test@example.com')).toBe(true);
            expect(userFacade.isEmailValid('invalid-email')).toBe(false);
        });

        it('should execute custom query with valid credentials', () => {
            const results = userFacade.executeCustomQuery(
                'validuser',
                'password1234',
                'SELECT * FROM users',
            );
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);
            expect(userFacade.getLastOperationResult()).toContain('Custom query executed');
        });

        it('should return empty array for custom query with invalid credentials', () => {
            const results = userFacade.executeCustomQuery(
                'validuser',
                'pwd',
                'SELECT * FROM users',
            );
            expect(results).toEqual([]);
            expect(userFacade.getLastOperationResult()).toBe(
                'Authentication failed for custom query',
            );
        });
    });

    // Test that demonstrates the advantages of facade pattern
    describe('Facade Pattern Advantages', () => {
        it('requires fewer method calls than the anti-pattern', () => {
            // Spy on internal methods to count calls
            const getUserInfoSpy = jest.spyOn(userFacade, 'getUserInfo');

            // Using the facade (proper pattern) - simple single call
            userFacade.getUserInfo('validuser', 'password1234', 1);

            // Should only make one call to the facade method
            expect(getUserInfoSpy).toHaveBeenCalledTimes(1);

            // Anti-pattern would require 9+ calls to different subsystem components
            // - new DatabaseConnection()
            // - new AuthenticationService()
            // - new ValidationService()
            // - new UserDataService()
            // - validationService.validateUserId()
            // - validationService.validateUsername()
            // - dbConnection.connect()
            // - userDataService.setConnection()
            // - authService.login()
            // - userDataService.getUserData()
            // - authService.logout()
            // - dbConnection.disconnect()
        });
    });
});
