import {
    DatabaseConnection,
    AuthenticationService,
    ValidationService,
    UserDataService,
    getUserInfo,
    createSampleUserSystem,
    UserData,
} from './implementation';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Mock the logger to avoid polluting test output
setupLoggerMock();

describe('Facade Anti-Pattern Implementation', () => {
    // Tests for individual subsystem components
    describe('Subsystem Components', () => {
        describe('DatabaseConnection', () => {
            let db: DatabaseConnection;

            beforeEach(() => {
                db = new DatabaseConnection();
            });

            it('should connect to database', () => {
                const result = db.connect('test-connection-string');
                expect(result).toBe(true);
                expect(db.isActive()).toBe(true);
            });

            it('should disconnect from database', () => {
                db.connect('test-connection-string');
                db.disconnect();
                expect(db.isActive()).toBe(false);
            });

            it('should execute query when connected', () => {
                db.connect('test-connection-string');
                const results = db.executeQuery('SELECT * FROM test');
                expect(Array.isArray(results)).toBe(true);
                expect(results.length).toBeGreaterThan(0);
            });

            it('should return empty array when executing query while disconnected', () => {
                const results = db.executeQuery('SELECT * FROM test');
                expect(results).toEqual([]);
            });
        });

        describe('AuthenticationService', () => {
            let auth: AuthenticationService;

            beforeEach(() => {
                auth = new AuthenticationService();
            });

            it('should login with valid credentials', () => {
                const result = auth.login('testuser', 'validpassword');
                expect(result).toBe(true);
                expect(auth.isLoggedIn()).toBe(true);
                expect(auth.getCurrentUser()).toBe('testuser');
            });

            it('should fail login with invalid credentials', () => {
                const result = auth.login('testuser', 'bad');
                expect(result).toBe(false);
                expect(auth.isLoggedIn()).toBe(false);
                expect(auth.getCurrentUser()).toBeNull();
            });

            it('should logout correctly', () => {
                auth.login('testuser', 'validpassword');
                auth.logout();
                expect(auth.isLoggedIn()).toBe(false);
                expect(auth.getCurrentUser()).toBeNull();
            });
        });

        describe('ValidationService', () => {
            let validator: ValidationService;

            beforeEach(() => {
                validator = new ValidationService();
            });

            it('should validate correct user ID', () => {
                expect(validator.validateUserId(1)).toBe(true);
                expect(validator.validateUserId(100)).toBe(true);
            });

            it('should invalidate incorrect user ID', () => {
                expect(validator.validateUserId(0)).toBe(false);
                expect(validator.validateUserId(-1)).toBe(false);
            });

            it('should validate correct username', () => {
                expect(validator.validateUsername('john')).toBe(true);
                expect(validator.validateUsername('johndoe')).toBe(true);
            });

            it('should invalidate incorrect username', () => {
                expect(validator.validateUsername('jo')).toBe(false);
                expect(validator.validateUsername('')).toBe(false);
            });

            it('should validate correct email', () => {
                expect(validator.validateEmail('test@example.com')).toBe(true);
                expect(validator.validateEmail('john.doe@domain.co.uk')).toBe(true);
            });

            it('should invalidate incorrect email', () => {
                expect(validator.validateEmail('test')).toBe(false);
                expect(validator.validateEmail('test@')).toBe(false);
                expect(validator.validateEmail('@domain.com')).toBe(false);
            });
        });

        describe('UserDataService', () => {
            let userService: UserDataService;
            let dbConnection: DatabaseConnection;

            beforeEach(() => {
                userService = new UserDataService();
                dbConnection = new DatabaseConnection();
                dbConnection.connect('test-connection');
                userService.setConnection(dbConnection);
            });

            it('should get user data when properly connected', () => {
                const userData = userService.getUserData(1);
                expect(userData).not.toBeNull();
                expect(userData).toHaveProperty('id');
                expect(userData).toHaveProperty('data');
            });

            it('should return null when getting data without connection', () => {
                const newUserService = new UserDataService(); // No connection set
                const userData = newUserService.getUserData(1);
                expect(userData).toBeNull();
            });

            it('should update user data successfully', () => {
                const userData: UserData = { id: 1, data: 'Updated Data' };
                const result = userService.updateUserData(1, userData);
                expect(result).toBe(true);
            });
        });
    });

    // Tests for the client code that uses the subsystem
    describe('Client Code Using Subsystem', () => {
        it('should get user info with valid inputs', () => {
            const result = getUserInfo('validuser', 'password1234', 1);
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('data');
        });

        it('should return null with invalid user ID', () => {
            const result = getUserInfo('validuser', 'password1234', -1);
            expect(result).toBeNull();
        });

        it('should return null with invalid username', () => {
            const result = getUserInfo('ab', 'password1234', 1);
            expect(result).toBeNull();
        });

        it('should return null with invalid password', () => {
            const result = getUserInfo('validuser', 'pwd', 1);
            expect(result).toBeNull();
        });

        it('should create a sample user system', () => {
            const system = createSampleUserSystem();
            expect(system.dbConnection).toBeInstanceOf(DatabaseConnection);
            expect(system.authService).toBeInstanceOf(AuthenticationService);
            expect(system.validationService).toBeInstanceOf(ValidationService);
            expect(system.userDataService).toBeInstanceOf(UserDataService);
            expect(system.dbConnection.isActive()).toBe(true);
        });
    });
});
