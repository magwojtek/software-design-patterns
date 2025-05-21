/**
 * Mediator Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Direct dependencies between components
 * 2. Components know about each other and communicate directly
 * 3. High coupling between components
 * 4. Hard to add new components without modifying existing ones
 * 5. Complex communication logic spread across multiple components
 */

export class SmartHomeDevice {
    public name: string;
    public outputs: string[] = [];

    constructor(name: string) {
        this.name = name;
    }

    protected log(message: string): void {
        this.outputs.push(message);
    }
}

export class Light extends SmartHomeDevice {
    private isOn: boolean = false;

    constructor(name: string) {
        super(name);
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

export class MotionSensor extends SmartHomeDevice {
    private lights: Light[] = [];
    private thermostat: Thermostat | null = null;
    private securitySystem: SecuritySystem | null = null;

    constructor(name: string) {
        super(name);
    }

    public addLight(light: Light): void {
        this.lights.push(light);
    }

    public setThermostat(thermostat: Thermostat): void {
        this.thermostat = thermostat;
    }

    public setSecuritySystem(securitySystem: SecuritySystem): void {
        this.securitySystem = securitySystem;
    }

    public motionDetected(): void {
        this.log(`${this.name} detected motion!`);

        // Directly control all connected lights
        for (const light of this.lights) {
            light.turnOn();
            this.log(`${this.name} turned on ${light.name}`);
        }

        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(false);
            this.log(`${this.name} disabled eco mode on ${this.thermostat.name}`);
        }

        // Directly interact with security system
        if (this.securitySystem && this.securitySystem.isArmed()) {
            this.securitySystem.triggerAlarm();
            this.log(`${this.name} triggered alarm via ${this.securitySystem.name}`);
        }
    }

    public noMotionDetected(): void {
        this.log(`${this.name} reports no motion for 10 minutes`);

        // Directly control all connected lights
        for (const light of this.lights) {
            light.turnOff();
            this.log(`${this.name} turned off ${light.name}`);
        }

        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(true);
            this.log(`${this.name} enabled eco mode on ${this.thermostat.name}`);
        }
    }
}

export class Thermostat extends SmartHomeDevice {
    private temperature: number = 22;
    private ecoMode: boolean = false;

    constructor(name: string) {
        super(name);
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

export class SecuritySystem extends SmartHomeDevice {
    private armed: boolean = false;
    private alarmTriggered: boolean = false;
    private lights: Light[] = [];
    private thermostat: Thermostat | null = null;

    constructor(name: string) {
        super(name);
    }

    public addLight(light: Light): void {
        this.lights.push(light);
    }

    public setThermostat(thermostat: Thermostat): void {
        this.thermostat = thermostat;
    }

    public arm(): void {
        this.armed = true;
        this.alarmTriggered = false;
        this.log(`${this.name} armed`);

        // Directly control all connected lights
        for (const light of this.lights) {
            light.turnOff();
            this.log(`${this.name} turned off ${light.name}`);
        }

        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(true);
            this.log(`${this.name} enabled eco mode on ${this.thermostat.name}`);
        }
    }

    public disarm(): void {
        this.armed = false;
        this.alarmTriggered = false;
        this.log(`${this.name} disarmed`);

        // Directly interact with thermostat
        if (this.thermostat) {
            this.thermostat.setEcoMode(false);
            this.log(`${this.name} disabled eco mode on ${this.thermostat.name}`);
        }
    }

    public triggerAlarm(): void {
        if (this.armed) {
            this.alarmTriggered = true;
            this.log(`${this.name} ALARM TRIGGERED!`);

            // Flash all lights
            for (const light of this.lights) {
                light.turnOn();
                this.log(`${this.name} turned on ${light.name} as alarm response`);
            }
        }
    }

    public isArmed(): boolean {
        return this.armed;
    }

    public isAlarmTriggered(): boolean {
        return this.alarmTriggered;
    }
}
