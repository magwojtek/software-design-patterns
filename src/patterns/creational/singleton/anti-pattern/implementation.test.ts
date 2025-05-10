import { DatabaseConnection } from './implementation';

describe('Singleton Anti-Pattern Tests', () => {
    beforeEach(() => {
        // Reset the state between tests
        DatabaseConnection.instance = new DatabaseConnection();
        DatabaseConnection.instance.isConnected = false;
    });

    test('should be a globally accessible instance', () => {
        expect(DatabaseConnection.instance).toBeDefined();
    });

    test('should create new instances separately', () => {
        const connection1 = DatabaseConnection.instance;
        const connection2 = new DatabaseConnection();

        // Despite being a "singleton" we can still create multiple instances
        expect(connection1).not.toBe(connection2);
    });

    test('should allow changing global state directly', () => {
        // This is problematic - we can modify the global state directly
        DatabaseConnection.instance.connectionString = 'modified-connection';
        expect(DatabaseConnection.instance.connectionString).toBe('modified-connection');
    });

    test('should throw error when executing query without connection', () => {
        // Instance is not connected
        expect(() => {
            DatabaseConnection.instance.executeQuery('SELECT * FROM users');
        }).toThrow('Not connected to database');
    });

    test('should execute query when connected', () => {
        // Connect and run query
        DatabaseConnection.instance.connect();
        const result = DatabaseConnection.instance.executeQuery('SELECT * FROM users');

        expect(result).toEqual(['Result for: SELECT * FROM users']);
    });
});
