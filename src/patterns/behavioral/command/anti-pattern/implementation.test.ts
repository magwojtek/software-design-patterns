/**
 * Command Pattern - Anti-Pattern Tests
 *
 * This file contains tests for the anti-pattern implementation of the Command pattern.
 */
import { RemoteControl } from './implementation';

describe('Command Pattern Anti-Pattern Tests', () => {
    let remoteControl: RemoteControl;

    beforeEach(() => {
        // Create a new instance of RemoteControl before each test
        remoteControl = new RemoteControl();
    });

    test('should create a RemoteControl instance successfully', () => {
        // When created, RemoteControl should initialize properly
        expect(remoteControl).toBeInstanceOf(RemoteControl);
    });

    test('should have methods to control devices', () => {
        // The remote should have methods to control devices
        expect(typeof remoteControl.pressLightButton).toBe('function');
        expect(typeof remoteControl.pressFanButton).toBe('function');
    });

    // This test demonstrates a limitation of the anti-pattern
    test('should not be able to add new commands without modifying the class', () => {
        // In the anti-pattern, there's no way to add or change commands at runtime
        // We can only check that the public API doesn't have methods for this
        expect(remoteControl).not.toHaveProperty('setCommand');
        expect(remoteControl).not.toHaveProperty('addCommand');
    });

    // This test demonstrates another limitation of the anti-pattern
    test('should not support undo operations', () => {
        // In the anti-pattern, there's no support for undo operations
        expect(remoteControl).not.toHaveProperty('undoButtonPressed');
        expect(remoteControl).not.toHaveProperty('undo');
    });
});
