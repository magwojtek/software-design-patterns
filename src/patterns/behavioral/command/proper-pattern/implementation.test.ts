/**
 * Command Pattern - Proper Pattern Tests
 *
 * This file contains tests for the proper pattern implementation of the Command pattern.
 */
import {
    Command,
    Light,
    CeilingFan,
    LightOnCommand,
    LightOffCommand,
    FanHighCommand,
    FanOffCommand,
    NoCommand,
    MacroCommand,
    RemoteControl,
} from './implementation';

describe('Command Pattern Proper Implementation Tests', () => {
    describe('Command Interface and Concrete Commands', () => {
        test('LightOnCommand should implement Command interface', () => {
            const light = new Light('Test Light');
            const command = new LightOnCommand(light);

            expect(command).toHaveProperty('execute');
            expect(command).toHaveProperty('undo');
            expect(typeof command.execute).toBe('function');
            expect(typeof command.undo).toBe('function');
        });

        test('FanHighCommand should implement Command interface', () => {
            const fan = new CeilingFan('Test Fan');
            const command = new FanHighCommand(fan);

            expect(command).toHaveProperty('execute');
            expect(command).toHaveProperty('undo');
            expect(typeof command.execute).toBe('function');
            expect(typeof command.undo).toBe('function');
        });

        test('NoCommand should implement Command interface and do nothing', () => {
            const command = new NoCommand();

            // Execute and undo should not cause errors
            expect(() => {
                command.execute();
                command.undo();
            }).not.toThrow();
        });
    });

    describe('Receiver Classes', () => {
        test('Light should track its state', () => {
            const light = new Light('Test Light');
            expect(light.isLightOn()).toBe(false);

            light.on();
            expect(light.isLightOn()).toBe(true);

            light.off();
            expect(light.isLightOn()).toBe(false);
        });

        test('CeilingFan should track its speed', () => {
            const fan = new CeilingFan('Test Fan');
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);

            fan.high();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);

            fan.medium();
            expect(fan.getSpeed()).toBe(CeilingFan.MEDIUM);

            fan.low();
            expect(fan.getSpeed()).toBe(CeilingFan.LOW);

            fan.off();
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);
        });
    });

    describe('Light Commands', () => {
        let light: Light;
        let onCommand: Command;
        let offCommand: Command;

        beforeEach(() => {
            light = new Light('Test Light');
            onCommand = new LightOnCommand(light);
            offCommand = new LightOffCommand(light);
        });

        test('LightOnCommand should turn on light when executed', () => {
            onCommand.execute();
            expect(light.isLightOn()).toBe(true);
        });

        test('LightOffCommand should turn off light when executed', () => {
            light.on();
            offCommand.execute();
            expect(light.isLightOn()).toBe(false);
        });

        test('LightOnCommand should turn off light when undone', () => {
            onCommand.execute();
            expect(light.isLightOn()).toBe(true);

            onCommand.undo();
            expect(light.isLightOn()).toBe(false);
        });

        test('LightOffCommand should turn on light when undone', () => {
            light.on();
            offCommand.execute();
            expect(light.isLightOn()).toBe(false);

            offCommand.undo();
            expect(light.isLightOn()).toBe(true);
        });
    });

    describe('Fan Commands', () => {
        let fan: CeilingFan;
        let highCommand: Command;
        let offCommand: Command;

        beforeEach(() => {
            fan = new CeilingFan('Test Fan');
            highCommand = new FanHighCommand(fan);
            offCommand = new FanOffCommand(fan);
        });

        test('FanHighCommand should set fan to high when executed', () => {
            highCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);
        });

        test('FanOffCommand should turn off fan when executed', () => {
            fan.high();
            offCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);
        });

        test('FanHighCommand should remember previous state for undo', () => {
            fan.medium();
            highCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);

            // Should return to medium speed
            highCommand.undo();
            expect(fan.getSpeed()).toBe(CeilingFan.MEDIUM);
        });

        test('FanOffCommand should remember previous state for undo', () => {
            fan.high();
            offCommand.execute();
            expect(fan.getSpeed()).toBe(CeilingFan.OFF);

            // Should return to high speed
            offCommand.undo();
            expect(fan.getSpeed()).toBe(CeilingFan.HIGH);
        });
    });

    describe('MacroCommand', () => {
        test('should execute multiple commands in sequence', () => {
            const light1 = new Light('Light 1');
            const light2 = new Light('Light 2');

            const light1On = new LightOnCommand(light1);
            const light2On = new LightOnCommand(light2);

            const macroCommand = new MacroCommand([light1On, light2On]);

            macroCommand.execute();

            expect(light1.isLightOn()).toBe(true);
            expect(light2.isLightOn()).toBe(true);
        });

        test('should undo multiple commands in reverse sequence', () => {
            const light1 = new Light('Light 1');
            const light2 = new Light('Light 2');

            const light1On = new LightOnCommand(light1);
            const light2On = new LightOnCommand(light2);

            const macroCommand = new MacroCommand([light1On, light2On]);

            macroCommand.execute();
            macroCommand.undo();

            expect(light1.isLightOn()).toBe(false);
            expect(light2.isLightOn()).toBe(false);
        });
    });

    describe('RemoteControl (Invoker)', () => {
        let remoteControl: RemoteControl;
        let light: Light;
        let lightOn: Command;
        let lightOff: Command;

        beforeEach(() => {
            remoteControl = new RemoteControl();
            light = new Light('Test Light');
            lightOn = new LightOnCommand(light);
            lightOff = new LightOffCommand(light);
        });

        test('should initialize with NoCommand instances', () => {
            // Check string representation for NoCommand instances
            const remoteString = remoteControl.toString();
            expect(remoteString).toContain('NoCommand');
        });

        test('should set commands in slots', () => {
            // Set a command in a slot
            remoteControl.setCommand(0, lightOn, lightOff);

            // Use the remote's toString method to verify the command was set
            const remoteString = remoteControl.toString();
            expect(remoteString).toContain('LightOnCommand');
            expect(remoteString).toContain('LightOffCommand');
        });

        test('should execute on commands', () => {
            remoteControl.setCommand(0, lightOn, lightOff);
            remoteControl.onButtonPressed(0);

            expect(light.isLightOn()).toBe(true);
        });

        test('should execute off commands', () => {
            remoteControl.setCommand(0, lightOn, lightOff);
            light.on();
            remoteControl.offButtonPressed(0);

            expect(light.isLightOn()).toBe(false);
        });

        test('should track last command for undo', () => {
            remoteControl.setCommand(0, lightOn, lightOff);

            remoteControl.onButtonPressed(0);
            expect(light.isLightOn()).toBe(true);

            remoteControl.undoButtonPressed();
            expect(light.isLightOn()).toBe(false);

            remoteControl.offButtonPressed(0);
            expect(light.isLightOn()).toBe(false);

            remoteControl.undoButtonPressed();
            expect(light.isLightOn()).toBe(true);
        });

        test('should handle invalid slot indices gracefully', () => {
            // Try to access an invalid slot index - should not throw an error
            expect(() => {
                remoteControl.onButtonPressed(-1);
                remoteControl.offButtonPressed(-1);
                remoteControl.onButtonPressed(100);
                remoteControl.offButtonPressed(100);
            }).not.toThrow();

            // The state of the light should remain unchanged
            expect(light.isLightOn()).toBe(false);
        });
    });
});
