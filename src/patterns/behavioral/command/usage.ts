/**
 * Command Pattern Usage Example
 *
 * This file demonstrates how to use the Command pattern in a real-world application.
 * The example shows how to create a simple smart home system with various devices
 * controlled through a unified command interface.
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
} from './proper-pattern/implementation';

// Function to demonstrate Command pattern usage
export function runCommandExample(): RemoteControl {
    // Create the remote control (invoker)
    const remoteControl = new RemoteControl();

    // Create the receivers (devices to be controlled)
    const livingRoomLight = new Light('Living Room');
    const kitchenLight = new Light('Kitchen');
    const ceilingFan = new CeilingFan('Living Room');

    // Create commands for the receivers
    const livingRoomLightOn = new LightOnCommand(livingRoomLight);
    const livingRoomLightOff = new LightOffCommand(livingRoomLight);
    const kitchenLightOn = new LightOnCommand(kitchenLight);
    const kitchenLightOff = new LightOffCommand(kitchenLight);
    const ceilingFanHigh = new FanHighCommand(ceilingFan);
    const ceilingFanOff = new FanOffCommand(ceilingFan);

    // Configure the remote with commands
    remoteControl.setCommand(0, livingRoomLightOn, livingRoomLightOff);
    remoteControl.setCommand(1, kitchenLightOn, kitchenLightOff);
    remoteControl.setCommand(2, ceilingFanHigh, ceilingFanOff);

    // Create macro commands for "party mode" and "all off"
    const partyOn = new MacroCommand([livingRoomLightOn, kitchenLightOn, ceilingFanHigh]);
    const allOff = new MacroCommand([livingRoomLightOff, kitchenLightOff, ceilingFanOff]);

    // Configure the remote with macro commands
    remoteControl.setCommand(3, partyOn, allOff);

    // Return the remote control for further use or demonstration
    return remoteControl;
}

// Example of using the Command pattern with a different context
export class SmartHomeController {
    private commandHistory: { name: string; command: { execute: () => void } }[] = [];

    public executeCommand(name: string, command: { execute: () => void }): void {
        // Store command for history
        this.commandHistory.push({ name, command });

        // Execute the command
        command.execute();
    }

    public showCommandHistory(): string[] {
        return this.commandHistory.map((entry) => entry.name);
    }

    public replayLastCommand(): void {
        if (this.commandHistory.length > 0) {
            const lastCommand = this.commandHistory[this.commandHistory.length - 1];
            lastCommand.command.execute();
        }
    }
}
