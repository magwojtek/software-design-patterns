/**
 * Singleton Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Lazy initialization (instance created only when needed)
 * 2. Thread-safe with private constructor
 * 3. Better testability with dependency injection option
 * 4. Explicit instance access through getInstance method
 */
import { logger } from '~/utils/logger';

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
    private _lastOperation: string | null = null;

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

    public getLastOperation(): string | null {
        return this._lastOperation;
    }

    public connect(connectionString?: string): void {
        if (connectionString) {
            this._connectionString = connectionString;
        }
        const message = `Connecting to database with ${this._connectionString}`;
        logger.info(message);
        this._connected = true;
        this._lastOperation = message;
    }

    public disconnect(): void {
        const message = 'Disconnecting from database';
        logger.info(message);
        this._connected = false;
        this._lastOperation = message;
    }

    public executeQuery(query: string): string[] {
        if (!this._connected) {
            throw new Error('Not connected to database');
        }
        const message = `Executing query: ${query}`;
        logger.info(message);
        this._lastOperation = message;
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
