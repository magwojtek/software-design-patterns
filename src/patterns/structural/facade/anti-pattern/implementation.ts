/**
 * Facade Anti-Pattern Implementation
 *
 * Issues with this implementation:
 * 1. Clients are tightly coupled to all subsystem classes
 * 2. Clients must understand all the intricacies of the subsystem
 * 3. Violation of Single Responsibility Principle - clients coordinate subsystem interactions
 * 4. When subsystem changes, all clients must be updated
 * 5. Complex client code with poor maintainability
 */
import { logger } from '~/utils/logger';

// Define interfaces for our data structures
export interface UserData {
    id: number;
    data: string;
    [key: string]: unknown;
}

// Subsystem: Database Access
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

// Subsystem: Authentication
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

// Subsystem: Data Validation
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

// Subsystem: User Data Service
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

// Client code using the subsystem directly - this is the anti-pattern
export function getUserInfo(username: string, password: string, userId: number): UserData | null {
    // Create instances of all subsystem components
    const dbConnection = new DatabaseConnection();
    const authService = new AuthenticationService();
    const validationService = new ValidationService();
    const userDataService = new UserDataService();

    // Client must coordinate all subsystem interactions
    logger.info(`Attempting to get data for user ID: ${userId}`);

    // Validate inputs
    if (!validationService.validateUserId(userId)) {
        return null;
    }

    if (!validationService.validateUsername(username)) {
        return null;
    }

    // Connect to database
    dbConnection.connect('mongodb://localhost:27017/userdb');

    // Set database connection for user service
    userDataService.setConnection(dbConnection);

    // Authenticate user
    if (!authService.login(username, password)) {
        dbConnection.disconnect();
        return null;
    }

    // Get user data
    const userData = userDataService.getUserData(userId);

    // Clean up resources
    authService.logout();
    dbConnection.disconnect();

    return userData;
}

// Create a sample user database
export function createSampleUserSystem(): {
    dbConnection: DatabaseConnection;
    authService: AuthenticationService;
    validationService: ValidationService;
    userDataService: UserDataService;
} {
    const dbConnection = new DatabaseConnection();
    const authService = new AuthenticationService();
    const validationService = new ValidationService();
    const userDataService = new UserDataService();

    // Set up the system
    dbConnection.connect('mongodb://localhost:27017/userdb');
    userDataService.setConnection(dbConnection);

    return {
        dbConnection,
        authService,
        validationService,
        userDataService,
    };
}
