/**
 * Singleton Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Global state that can be modified from anywhere
 * 2. Hard to test because of global state
 * 3. No control over creation/initialization timing
 * 4. Hidden dependencies
 */
import { logger } from '~/utils/logger';

export class DatabaseConnection {
    // Simply exposed as a global static instance
    public static instance: DatabaseConnection = new DatabaseConnection();

    public connectionString: string;
    public isConnected: boolean = false;

    constructor() {
        this.connectionString = 'default-connection-string';
    }

    public connect(): void {
        logger.info(`Connecting to database with ${this.connectionString}`);
        this.isConnected = true;
    }

    public disconnect(): void {
        logger.info('Disconnecting from database');
        this.isConnected = false;
    }

    public executeQuery(query: string): string[] {
        if (!this.isConnected) {
            throw new Error('Not connected to database');
        }
        logger.info(`Executing query: ${query}`);
        return [`Result for: ${query}`];
    }
}
