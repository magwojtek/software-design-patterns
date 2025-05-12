/**
 * Command Pattern - Unit Tests
 *
 * This file contains tests for the Command pattern implementation.
 */
import {
    RemoteControl,
    Light,
    CeilingFan,
    LightOnCommand,
    LightOffCommand,
    FanHighCommand,
    FanOffCommand,
    MacroCommand,
    Command,
} from './proper-pattern/implementation';
import { runCommandExample, SmartHomeController } from './usage';
import { setupLoggerMock } from '~/__tests__/fixtures/logger';

// Mock the logger to prevent console output during tests
setupLoggerMock();

describe('Command Pattern Tests', () => {
    // Test Light and Light Commands
    describe('Light Commands', () => {
        let light: Light;
        let lightOnCommand: LightOnCommand;
        let lightOffCommand: LightOffCommand;

        beforeEach(() => {
            light = new Light('Test Room');
            lightOnCommand = new LightOnCommand(light);
            lightOffCommand = new LightOffCommand(light);
        });

        test('should turn on light when LightOnCommand is executed', () => {
            lightOnCommand.execute();
            expect(light.isLightOn()).toBe(true);
        });

        test('should turn off light when LightOffCommand is executed', () => {
            // First turn on light
            light.on();

            lightOffCommand.execute();
            expect(light.isLightOn()).toBe(false);
        });

        test('should undo light on command by turning light off', () => {
            // First execute the command
            lightOnCommand.execute();

            lightOnCommand.undo();
            expect(light.isLightOn()).toBe(false);
        });
    });

    // Test Fan and Fan Commands
    describe('Fan Commands', () => {
        let fan: CeilingFan;
        let fanHighCommand: FanHighCommand;
        let fanOffCommand: FanOffCommand;

        beforeEach(() => {
            fan = new CeilingFan('Test Room');
            fanHighCommand = new FanHighCommand(fan);
            fanOffCommand = new FanOffCommand(fan);
        });

        test('should set fan to high speed when FanHighCommand is executed', () => {
            fanHighCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);
        });

        test('should turn fan off when FanOffCommand is executed', () => {
            // First set fan to high
            fan.high();

            fanOffCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);
        });

        test('should restore previous speed when FanOffCommand is undone', () => {
            // First set fan to high
            fan.high();

            // Execute off command
            fanOffCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);

            // Undo the command
            fanOffCommand.undo();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);
        });
    });

    // Test Remote Control (Invoker)
    describe('Remote Control', () => {
        let remoteControl: RemoteControl;
        let light: Light;
        let lightOnCommand: Command;
        let lightOffCommand: Command;

        beforeEach(() => {
            remoteControl = new RemoteControl();
            light = new Light('Test Room');
            lightOnCommand = new LightOnCommand(light);
            lightOffCommand = new LightOffCommand(light);
        });

        test('should set and execute commands in slots', () => {
            // Set command in slot 0
            remoteControl.setCommand(0, lightOnCommand, lightOffCommand);

            // Press on button for slot 0
            remoteControl.onButtonPressed(0);
            expect(light.isLightOn()).toBe(true);
        });

        test('should support undo operation', () => {
            // Set command in slot 0
            remoteControl.setCommand(0, lightOnCommand, lightOffCommand);

            // Press on button for slot 0
            remoteControl.onButtonPressed(0);
            expect(light.isLightOn()).toBe(true);

            // Press undo button
            remoteControl.undoButtonPressed();
            expect(light.isLightOn()).toBe(false);
        });
    });

    // Test Macro Command
    describe('Macro Command', () => {
        let light1: Light;
        let light2: Light;
        let light1On: Command;
        let light2On: Command;
        let macroCommand: MacroCommand;

        beforeEach(() => {
            light1 = new Light('Light 1');
            light2 = new Light('Light 2');
            light1On = new LightOnCommand(light1);
            light2On = new LightOnCommand(light2);
            macroCommand = new MacroCommand([light1On, light2On]);
        });

        test('should execute all commands when macro is executed', () => {
            macroCommand.execute();

            // Both lights should be on
            expect(light1.isLightOn()).toBe(true);
            expect(light2.isLightOn()).toBe(true);
        });

        test('should undo all commands in reverse order when macro is undone', () => {
            // Execute macro command
            macroCommand.execute();

            // Undo macro command
            macroCommand.undo();

            // Both lights should be off
            expect(light1.isLightOn()).toBe(false);
            expect(light2.isLightOn()).toBe(false);
        });
    });

    // Test usage example
    describe('Usage Example', () => {
        test('runCommandExample should return a configured remote control', () => {
            const remote = runCommandExample();
            expect(remote).toBeInstanceOf(RemoteControl);
        });

        test('SmartHomeController should store and replay commands', () => {
            const controller = new SmartHomeController();
            const light = new Light('Test');
            const command = new LightOnCommand(light);

            // Execute a command
            controller.executeCommand('Turn on test light', command);

            // Check command history
            expect(controller.showCommandHistory()).toContain('Turn on test light');

            // Light should be on
            expect(light.isLightOn()).toBe(true);

            // Turn off light for testing the replay
            light.off();
            expect(light.isLightOn()).toBe(false);

            // Replay last command
            controller.replayLastCommand();

            // Light should be on again
            expect(light.isLightOn()).toBe(true);
        });
    });
});
