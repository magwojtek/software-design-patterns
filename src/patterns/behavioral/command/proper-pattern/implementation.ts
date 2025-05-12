/**
 * Command Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Decouples sender (invoker) from receiver
 * 2. Commands are first-class objects that can be manipulated and extended
 * 3. Easy to add new commands without modifying existing code
 * 4. Supports undo operations
 * 5. Supports composite commands (macros)
 * 6. Better testability with interfaces and dependency injection
 */
import { logger, LogColor } from '~/utils/logger';

// Command interface that all concrete commands will implement
export interface Command {
    execute(): void;
    undo(): void;
    toString(): string; // Add toString method for testability
}

// Receiver class - Light
export class Light {
    private location: string;
    private isOn: boolean = false;

    constructor(location: string) {
        this.location = location;
    }

    public on(): void {
        this.isOn = true;
        logger.log(`${this.location} Light is turned ON`, LogColor.LIGHT_DEVICE);
    }

    public off(): void {
        this.isOn = false;
        logger.log(`${this.location} Light is turned OFF`, LogColor.LIGHT_DEVICE);
    }

    public isLightOn(): boolean {
        return this.isOn;
    }

    public getLocation(): string {
        return this.location;
    }
}

// Concrete command for turning light on
export class LightOnCommand implements Command {
    private light: Light;

    constructor(light: Light) {
        this.light = light;
    }

    public execute(): void {
        this.light.on();
    }

    public undo(): void {
        this.light.off();
    }

    public toString(): string {
        return `LightOnCommand: ${this.light.getLocation()} Light`;
    }
}

// Concrete command for turning light off
export class LightOffCommand implements Command {
    private light: Light;

    constructor(light: Light) {
        this.light = light;
    }

    public execute(): void {
        this.light.off();
    }

    public undo(): void {
        this.light.on();
    }

    public toString(): string {
        return `LightOffCommand: ${this.light.getLocation()} Light`;
    }
}

// Receiver class - CeilingFan
export class CeilingFan {
    public static readonly HIGH: number = 3;
    public static readonly MEDIUM: number = 2;
    public static readonly LOW: number = 1;
    public static readonly OFF: number = 0;

    private location: string;
    private speed: number = CeilingFan.OFF;

    constructor(location: string) {
        this.location = location;
    }

    public high(): void {
        this.speed = CeilingFan.HIGH;
        logger.log(`${this.location} Ceiling Fan is set to HIGH speed`, LogColor.FAN_DEVICE);
    }

    public medium(): void {
        this.speed = CeilingFan.MEDIUM;
        logger.log(`${this.location} Ceiling Fan is set to MEDIUM speed`, LogColor.FAN_DEVICE);
    }

    public low(): void {
        this.speed = CeilingFan.LOW;
        logger.log(`${this.location} Ceiling Fan is set to LOW speed`, LogColor.FAN_DEVICE);
    }

    public off(): void {
        this.speed = CeilingFan.OFF;
        logger.log(`${this.location} Ceiling Fan is turned OFF`, LogColor.FAN_DEVICE);
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getLocation(): string {
        return this.location;
    }
}

// Command for setting fan to high speed
export class FanHighCommand implements Command {
    private fan: CeilingFan;
    private prevSpeed: number;

    constructor(fan: CeilingFan) {
        this.fan = fan;
        this.prevSpeed = fan.getSpeed();
    }

    public execute(): void {
        this.prevSpeed = this.fan.getSpeed(); // Store state for undo
        this.fan.high();
    }

    public undo(): void {
        // Restore previous state
        switch (this.prevSpeed) {
            case CeilingFan.HIGH:
                this.fan.high();
                break;
            case CeilingFan.MEDIUM:
                this.fan.medium();
                break;
            case CeilingFan.LOW:
                this.fan.low();
                break;
            default:
                this.fan.off();
                break;
        }
    }

    public toString(): string {
        return `FanHighCommand: ${this.fan.getLocation()} Fan`;
    }
}

// Command for turning fan off
export class FanOffCommand implements Command {
    private fan: CeilingFan;
    private prevSpeed: number;

    constructor(fan: CeilingFan) {
        this.fan = fan;
        this.prevSpeed = fan.getSpeed();
    }

    public execute(): void {
        this.prevSpeed = this.fan.getSpeed(); // Store state for undo
        this.fan.off();
    }

    public undo(): void {
        // Restore previous state
        switch (this.prevSpeed) {
            case CeilingFan.HIGH:
                this.fan.high();
                break;
            case CeilingFan.MEDIUM:
                this.fan.medium();
                break;
            case CeilingFan.LOW:
                this.fan.low();
                break;
            default:
                this.fan.off();
                break;
        }
    }

    public toString(): string {
        return `FanOffCommand: ${this.fan.getLocation()} Fan`;
    }
}

// No-operation command for empty slots
export class NoCommand implements Command {
    public execute(): void {
        // Do nothing
    }

    public undo(): void {
        // Do nothing
    }

    public toString(): string {
        return 'NoCommand';
    }
}

// Macro command for executing multiple commands
export class MacroCommand implements Command {
    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = [...commands];
    }

    public execute(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }

    public undo(): void {
        // Execute undo in reverse order
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }

    public toString(): string {
        return `MacroCommand: ${this.commands.length} commands`;
    }
}

// The invoker class
export class RemoteControl {
    public static readonly SLOTS: number = 7; // Number of command slots
    private onCommands: Command[];
    private offCommands: Command[];
    private undoCommand: Command;

    constructor() {
        // Initialize with NoCommand as the default for all slots
        this.onCommands = Array(RemoteControl.SLOTS)
            .fill(null)
            .map(() => new NoCommand());
        this.offCommands = Array(RemoteControl.SLOTS)
            .fill(null)
            .map(() => new NoCommand());
        this.undoCommand = new NoCommand();

        logger.log('RemoteControl created with no commands assigned', LogColor.COMMAND_SETUP);
    }

    public setCommand(slot: number, onCommand: Command, offCommand: Command): void {
        if (slot < 0 || slot >= RemoteControl.SLOTS) {
            logger.error(
                `Invalid slot: ${slot}. Must be between 0 and ${RemoteControl.SLOTS - 1}.`,
            );
            return;
        }

        this.onCommands[slot] = onCommand;
        this.offCommands[slot] = offCommand;
        logger.log(
            `Slot ${slot} configured with ${onCommand.toString()} and ${offCommand.toString()}`,
            LogColor.COMMAND_SETUP,
        );
    }

    public onButtonPressed(slot: number): void {
        if (slot < 0 || slot >= RemoteControl.SLOTS) {
            logger.error(
                `Invalid slot: ${slot}. Must be between 0 and ${RemoteControl.SLOTS - 1}.`,
            );
            return;
        }

        this.onCommands[slot].execute();
        this.undoCommand = this.onCommands[slot];
    }

    public offButtonPressed(slot: number): void {
        if (slot < 0 || slot >= RemoteControl.SLOTS) {
            logger.error(
                `Invalid slot: ${slot}. Must be between 0 and ${RemoteControl.SLOTS - 1}.`,
            );
            return;
        }

        this.offCommands[slot].execute();
        this.undoCommand = this.offCommands[slot];
    }

    public undoButtonPressed(): void {
        logger.log(`Undoing last command: ${this.undoCommand.toString()}`, LogColor.COMMAND_UNDO);
        this.undoCommand.undo();
    }

    public toString(): string {
        let str = '\n------ Remote Control -------\n';

        for (let i = 0; i < RemoteControl.SLOTS; i++) {
            str += `[slot ${i}] ${this.onCommands[i].toString()}   ${this.offCommands[i].toString()}\n`;
        }

        str += `[undo] ${this.undoCommand.toString()}\n`;
        return str;
    }
}
