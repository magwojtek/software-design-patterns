/**
 * Facade Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Provides a simplified interface to a complex subsystem
 * 2. Decouples client code from subsystem components
 * 3. Encapsulates subsystem initialization and interaction logic
 * 4. Hides complex subsystem coordination from clients
 * 5. Allows subsystem components to change without affecting client code
 */
import { logger } from '~/utils/logger';

// Define interfaces for our data structures
export interface UserData {
    id: number;
    data: string;
    [key: string]: unknown;
}

// Subsystem: Database Access (same as anti-pattern)
export class DatabaseConnection {
    private connectionString: string = '';
    private isConnected: boolean = false;

    constructor() {
        logger.info('DatabaseConnection instance created');
    }

    public connect(connectionString: string): boolean {
        this.connectionString = connectionString;
        this.isConnected = true;
        logger.success(`Connected to database: ${connectionString}`);
        return true;
    }

    public disconnect(): void {
        this.isConnected = false;
        logger.warn('Disconnected from database');
    }

    public isActive(): boolean {
        return this.isConnected;
    }

    public executeQuery(query: string): UserData[] {
        if (!this.isConnected) {
            logger.error('Cannot execute query: Not connected to database');
            return [];
        }
        logger.info(`Executing query: ${query}`);
        return [{ id: 1, data: 'Sample result' }];
    }
}

// Subsystem: Authentication (same as anti-pattern)
export class AuthenticationService {
    private loggedInUser: string | null = null;

    constructor() {
        logger.info('AuthenticationService instance created');
    }

    public login(username: string, password: string): boolean {
        // Simulate authentication
        if (password.length > 3) {
            this.loggedInUser = username;
            logger.success(`User "${username}" logged in successfully`);
            return true;
        }
        logger.error('Login failed: Invalid credentials');
        return false;
    }

    public logout(): void {
        const user = this.loggedInUser;
        this.loggedInUser = null;
        logger.warn(`User "${user}" logged out`);
    }

    public getCurrentUser(): string | null {
        return this.loggedInUser;
    }

    public isLoggedIn(): boolean {
        return this.loggedInUser !== null;
    }
}

// Subsystem: Data Validation (same as anti-pattern)
export class ValidationService {
    constructor() {
        logger.info('ValidationService instance created');
    }

    public validateUserId(id: number): boolean {
        if (id > 0) {
            logger.success(`User ID ${id} is valid`);
            return true;
        }
        logger.error(`Invalid User ID: ${id}`);
        return false;
    }

    public validateUsername(username: string): boolean {
        if (username.length >= 3) {
            logger.success(`Username "${username}" is valid`);
            return true;
        }
        logger.error(`Invalid username: "${username}"`);
        return false;
    }

    public validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        if (isValid) {
            logger.success(`Email "${email}" is valid`);
        } else {
            logger.error(`Invalid email: "${email}"`);
        }
        return isValid;
    }
}

// Subsystem: User Data Service (same as anti-pattern)
export class UserDataService {
    private dbConnection: DatabaseConnection | null = null;

    constructor() {
        logger.info('UserDataService instance created');
    }

    public setConnection(connection: DatabaseConnection): void {
        this.dbConnection = connection;
    }

    public getUserData(userId: number): UserData | null {
        if (!this.dbConnection) {
            logger.error('Database connection not set');
            return null;
        }
        if (!this.dbConnection.isActive()) {
            logger.error('Database connection not active');
            return null;
        }
        const results = this.dbConnection.executeQuery(`SELECT * FROM users WHERE id = ${userId}`);
        if (results.length > 0) {
            logger.success(`Found user data for ID: ${userId}`);
            return results[0];
        }
        logger.warn(`No user found with ID: ${userId}`);
        return null;
    }

    public updateUserData(userId: number, userData: UserData): boolean {
        if (!this.dbConnection) {
            logger.error('Database connection not set');
            return false;
        }
        if (!this.dbConnection.isActive()) {
            logger.error('Database connection not active');
            return false;
        }
        // Simulate update
        logger.success(`Updated user data for ID: ${userId} with: ${JSON.stringify(userData)}`);
        return true;
    }
}

// Facade: Provides a unified interface to the subsystem
export class UserSystemFacade {
    private dbConnection: DatabaseConnection;
    private authService: AuthenticationService;
    private validationService: ValidationService;
    private userDataService: UserDataService;
    private lastOperationResult: string | null = null;

    constructor(dbConnectionString: string = 'mongodb://localhost:27017/userdb') {
        logger.info('Creating UserSystemFacade');

        // Initialize subsystem components
        this.dbConnection = new DatabaseConnection();
        this.authService = new AuthenticationService();
        this.validationService = new ValidationService();
        this.userDataService = new UserDataService();

        // Configure the subsystem
        this.dbConnection.connect(dbConnectionString);
        this.userDataService.setConnection(this.dbConnection);
    }

    // Instance method to get last operation result (for testing)
    public getLastOperationResult(): string | null {
        return this.lastOperationResult;
    }

    // Method to reset the last operation result
    public resetLastOperationResult(): void {
        this.lastOperationResult = null;
    }

    // Simple methods that hide subsystem complexity
    public getUserInfo(username: string, password: string, userId: number): UserData | null {
        logger.info(`Facade: Getting user info for ID: ${userId}`);

        // Validate inputs
        if (!this.validateUserInputs(username, userId)) {
            this.lastOperationResult = 'Validation failed';
            return null;
        }

        // Authenticate user
        if (!this.authService.login(username, password)) {
            this.lastOperationResult = 'Authentication failed';
            return null;
        }

        // Get user data
        const userData = this.userDataService.getUserData(userId);

        // Clean up
        this.authService.logout();

        if (userData) {
            this.lastOperationResult = 'Successfully retrieved user data';
        } else {
            this.lastOperationResult = 'User data not found';
        }

        return userData;
    }

    public updateUserProfile(
        username: string,
        password: string,
        userId: number,
        newData: UserData,
    ): boolean {
        logger.info(`Facade: Updating profile for user ID: ${userId}`);

        // Validate inputs
        if (!this.validateUserInputs(username, userId)) {
            this.lastOperationResult = 'Validation failed';
            return false;
        }

        // Authenticate user
        if (!this.authService.login(username, password)) {
            this.lastOperationResult = 'Authentication failed';
            return false;
        }

        // Update user data
        const updateResult = this.userDataService.updateUserData(userId, newData);

        // Clean up
        this.authService.logout();

        if (updateResult) {
            this.lastOperationResult = 'Successfully updated user data';
        } else {
            this.lastOperationResult = 'Failed to update user data';
        }

        return updateResult;
    }

    public isEmailValid(email: string): boolean {
        return this.validationService.validateEmail(email);
    }

    // Clean up resources
    public shutdown(): void {
        logger.warn('Facade: Shutting down user system');
        if (this.authService.isLoggedIn()) {
            this.authService.logout();
        }
        this.dbConnection.disconnect();
    }

    // Additional method that demonstrates exposing some subsystem functionality
    // when needed, but still coordinated through the facade
    public executeCustomQuery(username: string, password: string, query: string): UserData[] {
        if (!this.authService.login(username, password)) {
            this.lastOperationResult = 'Authentication failed for custom query';
            return [];
        }

        const results = this.dbConnection.executeQuery(query);
        this.authService.logout();

        this.lastOperationResult = `Custom query executed with ${results.length} results`;
        return results;
    }

    // Private helper method
    private validateUserInputs(username: string, userId: number): boolean {
        return (
            this.validationService.validateUsername(username) &&
            this.validationService.validateUserId(userId)
        );
    }
}

// Helper function to create a sample facade for demonstration
export function createSampleUserFacade(): UserSystemFacade {
    return new UserSystemFacade('mongodb://localhost:27017/userdb');
}
