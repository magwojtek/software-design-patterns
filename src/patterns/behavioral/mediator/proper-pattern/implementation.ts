/**
 * Mediator Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Reduces coupling between components
 * 2. Components don't know about each other directly
 * 3. Centralizes complex communication logic
 * 4. Makes it easier to add new components
 * 5. Simplifies component interactions
 */

// Event type enum for type safety
export enum SmartHomeEvent {
    MOTION_DETECTED = 'MOTION_DETECTED',
    NO_MOTION_DETECTED = 'NO_MOTION_DETECTED',
    SYSTEM_ARMED = 'SYSTEM_ARMED',
    SYSTEM_DISARMED = 'SYSTEM_DISARMED',
    ALARM_TRIGGERED = 'ALARM_TRIGGERED',
}

// Mediator interface
export interface SmartHomeMediator {
    notify(sender: SmartHomeComponent, event: SmartHomeEvent): void;
    registerComponent(component: SmartHomeComponent): void;
}

// Abstract component class
export abstract class SmartHomeComponent {
    protected mediator: SmartHomeMediator;
    public name: string;
    public outputs: string[] = [];

    constructor(mediator: SmartHomeMediator, name: string) {
        this.mediator = mediator;
        this.name = name;
        this.mediator.registerComponent(this);
    }

    protected log(message: string): void {
        this.outputs.push(message);
    }
}

// Concrete mediator implementation
export class SmartHomeController implements SmartHomeMediator {
    protected components: Map<string, SmartHomeComponent> = new Map();
    public outputs: string[] = [];

    public registerComponent(component: SmartHomeComponent): void {
        this.components.set(component.name, component);
        this.log(`Registered component: ${component.name}`);
    }

    public notify(sender: SmartHomeComponent, event: SmartHomeEvent): void {
        this.log(`Event received from ${sender.name}: ${event}`);

        // Handle different events based on sender and event type
        switch (event) {
            case SmartHomeEvent.MOTION_DETECTED:
                this.handleMotionDetected();
                break;
            case SmartHomeEvent.NO_MOTION_DETECTED:
                this.handleNoMotionDetected();
                break;
            case SmartHomeEvent.SYSTEM_ARMED:
                this.handleSystemArmed();
                break;
            case SmartHomeEvent.SYSTEM_DISARMED:
                this.handleSystemDisarmed();
                break;
            case SmartHomeEvent.ALARM_TRIGGERED:
                this.handleAlarmTriggered();
                break;
            default:
                this.log(`Unknown event: ${event}`);
        }
    }

    private handleMotionDetected(): void {
        // Turn on all lights
        this.components.forEach((component) => {
            if (component instanceof Light) {
                (component as Light).turnOn();
            }
        });

        // Disable eco mode on thermostat
        const thermostat = this.getComponent('Thermostat') as Thermostat;
        if (thermostat) {
            thermostat.setEcoMode(false);
        }

        // Check if security system is armed, trigger alarm if it is
        const securitySystem = this.getComponent('SecuritySystem') as SecuritySystem;
        if (securitySystem && securitySystem.isArmed()) {
            securitySystem.triggerAlarm();
        }
    }

    private handleNoMotionDetected(): void {
        // Turn off all lights
        this.components.forEach((component) => {
            if (component instanceof Light) {
                (component as Light).turnOff();
            }
        });

        // Enable eco mode on thermostat
        const thermostat = this.getComponent('Thermostat') as Thermostat;
        if (thermostat) {
            thermostat.setEcoMode(true);
        }
    }

    private handleSystemArmed(): void {
        // Turn off all lights
        this.components.forEach((component) => {
            if (component instanceof Light) {
                (component as Light).turnOff();
            }
        });

        // Enable eco mode on thermostat
        const thermostat = this.getComponent('Thermostat') as Thermostat;
        if (thermostat) {
            thermostat.setEcoMode(true);
        }
    }

    private handleSystemDisarmed(): void {
        // Disable eco mode on thermostat
        const thermostat = this.getComponent('Thermostat') as Thermostat;
        if (thermostat) {
            thermostat.setEcoMode(false);
        }
    }

    private handleAlarmTriggered(): void {
        // Flash all lights
        this.components.forEach((component) => {
            if (component instanceof Light) {
                (component as Light).turnOn();
            }
        });
    }

    private getComponent(name: string): SmartHomeComponent | undefined {
        return this.components.get(name);
    }

    private log(message: string): void {
        this.outputs.push(message);
    }
}

// Concrete component implementations
export class Light extends SmartHomeComponent {
    private isOn: boolean = false;

    constructor(mediator: SmartHomeMediator, name: string) {
        super(mediator, name);
    }

    public turnOn(): void {
        this.isOn = true;
        this.log(`${this.name} light turned ON`);
    }

    public turnOff(): void {
        this.isOn = false;
        this.log(`${this.name} light turned OFF`);
    }

    public isLightOn(): boolean {
        return this.isOn;
    }
}

export class MotionSensor extends SmartHomeComponent {
    constructor(mediator: SmartHomeMediator, name: string) {
        super(mediator, name);
    }

    public motionDetected(): void {
        this.log(`${this.name} detected motion!`);
        this.mediator.notify(this, SmartHomeEvent.MOTION_DETECTED);
    }

    public noMotionDetected(): void {
        this.log(`${this.name} reports no motion for 10 minutes`);
        this.mediator.notify(this, SmartHomeEvent.NO_MOTION_DETECTED);
    }
}

export class Thermostat extends SmartHomeComponent {
    private temperature: number = 22;
    private ecoMode: boolean = false;

    constructor(mediator: SmartHomeMediator, name: string) {
        super(mediator, name);
    }

    public setTemperature(temperature: number): void {
        this.temperature = temperature;
        this.log(`${this.name} temperature set to ${temperature}°C`);
    }

    public setEcoMode(enabled: boolean): void {
        this.ecoMode = enabled;
        if (enabled) {
            this.temperature = 18; // Lower temperature to save energy
            this.log(`${this.name} eco mode enabled, temperature set to ${this.temperature}°C`);
        } else {
            this.temperature = 22; // Restore comfortable temperature
            this.log(`${this.name} eco mode disabled, temperature set to ${this.temperature}°C`);
        }
    }

    public isEcoModeEnabled(): boolean {
        return this.ecoMode;
    }

    public getTemperature(): number {
        return this.temperature;
    }
}

export class SecuritySystem extends SmartHomeComponent {
    private armed: boolean = false;
    private alarmTriggered: boolean = false;

    constructor(mediator: SmartHomeMediator, name: string) {
        super(mediator, name);
    }

    public arm(): void {
        this.armed = true;
        this.alarmTriggered = false;
        this.log(`${this.name} armed`);
        this.mediator.notify(this, SmartHomeEvent.SYSTEM_ARMED);
    }

    public disarm(): void {
        this.armed = false;
        this.alarmTriggered = false;
        this.log(`${this.name} disarmed`);
        this.mediator.notify(this, SmartHomeEvent.SYSTEM_DISARMED);
    }

    public triggerAlarm(): void {
        if (this.armed) {
            this.alarmTriggered = true;
            this.log(`${this.name} ALARM TRIGGERED!`);
            this.mediator.notify(this, SmartHomeEvent.ALARM_TRIGGERED);
        }
    }

    public isArmed(): boolean {
        return this.armed;
    }

    public isAlarmTriggered(): boolean {
        return this.alarmTriggered;
    }
}
