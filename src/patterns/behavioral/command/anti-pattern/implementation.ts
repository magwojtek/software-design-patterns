/**
 * Command Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Tight coupling between the invoker (RemoteControl) and the receivers (Light, Fan)
 * 2. No way to add new commands without modifying the RemoteControl class
 * 3. No way to change command behavior at runtime
 * 4. No support for undo operations
 * 5. Hard to test due to concrete dependencies
 */
import { logger, LogColor } from '~/utils/logger';

// Light receiver class
class Light {
    private location: string;

    constructor(location: string = 'Default') {
        this.location = location;
    }

    public on(): void {
        logger.log(`${this.location} Light is turned ON`, LogColor.LIGHT_DEVICE);
    }

    public off(): void {
        logger.log(`${this.location} Light is turned OFF`, LogColor.LIGHT_DEVICE);
    }
}

// Fan receiver class
class CeilingFan {
    private location: string;
    private speed: string = 'OFF';

    constructor(location: string = 'Default') {
        this.location = location;
    }

    public high(): void {
        this.speed = 'HIGH';
        logger.log(`${this.location} Ceiling Fan is set to HIGH speed`, LogColor.FAN_DEVICE);
    }

    public medium(): void {
        this.speed = 'MEDIUM';
        logger.log(`${this.location} Ceiling Fan is set to MEDIUM speed`, LogColor.FAN_DEVICE);
    }

    public low(): void {
        this.speed = 'LOW';
        logger.log(`${this.location} Ceiling Fan is set to LOW speed`, LogColor.FAN_DEVICE);
    }

    public off(): void {
        this.speed = 'OFF';
        logger.log(`${this.location} Ceiling Fan is turned OFF`, LogColor.FAN_DEVICE);
    }

    public getSpeed(): string {
        return this.speed;
    }
}

// The invoker with hardcoded commands
export class RemoteControl {
    // Direct references to the receivers
    private light: Light;
    private fan: CeilingFan;

    constructor() {
        // Creating concrete implementations directly
        this.light = new Light('Living Room');
        this.fan = new CeilingFan('Living Room');
        logger.log(
            'RemoteControl created with hardcoded Light and CeilingFan',
            LogColor.COMMAND_SETUP,
        );
    }

    // Methods directly call receiver operations
    public pressLightButton(): void {
        // Toggle light state (simplified for example)
        this.light.on();
    }

    public pressFanButton(): void {
        // Toggle fan state (simplified for example)
        this.fan.high();
    }

    // No way to add new buttons or change functionality without modifying this class
    // No support for undo operations
}
