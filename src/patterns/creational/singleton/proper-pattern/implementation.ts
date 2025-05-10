/**
 * Singleton Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Lazy initialization (instance created only when needed)
 * 2. Thread-safe with private constructor
 * 3. Better testability with dependency injection option
 * 4. Explicit instance access through getInstance method
 */
import { logger, LogColor } from '~/utils/logger';

export interface IDatabaseConnection {
    connect(connectionString?: string): void;
    disconnect(): void;
    executeQuery(query: string): string[];
    isConnected(): boolean;
}

export class DatabaseConnection implements IDatabaseConnection {
    private static instance: DatabaseConnection | null = null;
    private _connectionString: string;
    private _connected: boolean = false;

    private constructor() {
        this._connectionString = 'default-connection-string';
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    // For testing purposes - allows resetting the singleton
    public static resetInstance(): void {
        DatabaseConnection.instance = null;
    }

    public connect(connectionString?: string): void {
        if (connectionString) {
            this._connectionString = connectionString;
        }
        logger.log(`Connecting to database with ${this._connectionString}`, LogColor.INFO);
        this._connected = true;
    }

    public disconnect(): void {
        logger.log('Disconnecting from database', LogColor.INFO);
        this._connected = false;
    }

    public executeQuery(query: string): string[] {
        if (!this._connected) {
            throw new Error('Not connected to database');
        }
        logger.log(`Executing query: ${query}`, LogColor.INFO);
        return [`Result for: ${query}`];
    }

    public isConnected(): boolean {
        return this._connected;
    }
}

// Factory function for dependency injection
export function createDatabaseConnection(): IDatabaseConnection {
    return DatabaseConnection.getInstance();
}
