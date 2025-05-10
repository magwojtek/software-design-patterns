import { DatabaseConnection, createDatabaseConnection } from './implementation';
import { logger, LogColor } from '~/utils/logger';

describe('Singleton Proper Pattern Tests', () => {
    beforeEach(() => {
        // Reset singleton instance between tests
        DatabaseConnection.resetInstance();
    });

    test('should always return the same instance', () => {
        const instance1 = DatabaseConnection.getInstance();
        const instance2 = DatabaseConnection.getInstance();

        expect(instance1).toBe(instance2);
    });

    test('should initialize only when first requested', () => {
        const spy = jest.spyOn(logger, 'log');

        // No initialization yet
        expect(spy).not.toHaveBeenCalled();

        // Get instance and connect
        const instance = DatabaseConnection.getInstance();
        instance.connect();

        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining('Connecting to database'),
            LogColor.INFO,
        );

        spy.mockRestore();
    });

    test('should throw error when executing query without connection', () => {
        const instance = DatabaseConnection.getInstance();

        expect(() => {
            instance.executeQuery('SELECT * FROM users');
        }).toThrow('Not connected to database');
    });

    test('should execute query when connected', () => {
        const instance = DatabaseConnection.getInstance();
        instance.connect();

        const result = instance.executeQuery('SELECT * FROM users');
        expect(result).toEqual(['Result for: SELECT * FROM users']);
    });

    test('should be injectable via factory function', () => {
        const connection = createDatabaseConnection();
        connection.connect();

        expect(connection.isConnected()).toBe(true);

        const result = connection.executeQuery('SELECT * FROM users');
        expect(result).toEqual(['Result for: SELECT * FROM users']);
    });
});
