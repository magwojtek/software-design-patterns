import {
    SmartHomeController,
    Light,
    MotionSensor,
    Thermostat,
    SecuritySystem,
    SmartHomeEvent,
    SmartHomeComponent,
    SmartHomeMediator,
} from './implementation';

describe('Mediator Proper Pattern Tests', () => {
    let mediator: SmartHomeController;
    let livingRoomLight: Light;
    let kitchenLight: Light;
    let motionSensor: MotionSensor;
    let thermostat: Thermostat;
    let securitySystem: SecuritySystem;

    beforeEach(() => {
        // Create a fresh mediator and components for each test
        mediator = new SmartHomeController();
        livingRoomLight = new Light(mediator, 'Living Room Light');
        kitchenLight = new Light(mediator, 'Kitchen Light');
        motionSensor = new MotionSensor(mediator, 'Living Room Sensor');
        thermostat = new Thermostat(mediator, 'Thermostat');
        securitySystem = new SecuritySystem(mediator, 'SecuritySystem');
    });

    test('Light can be turned on and off', () => {
        livingRoomLight.turnOn();
        expect(livingRoomLight.isLightOn()).toBe(true);
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned ON');

        livingRoomLight.turnOff();
        expect(livingRoomLight.isLightOn()).toBe(false);
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned OFF');
    });

    test('MotionSensor triggers mediator when motion is detected', () => {
        // Arm the security system
        securitySystem.arm();

        // Simulate motion detection
        motionSensor.motionDetected();

        // Verify lights were turned on via mediator
        expect(livingRoomLight.isLightOn()).toBe(true);
        expect(kitchenLight.isLightOn()).toBe(true);

        // Verify thermostat eco mode was disabled via mediator
        expect(thermostat.isEcoModeEnabled()).toBe(false);

        // Verify alarm was triggered via mediator
        expect(securitySystem.isAlarmTriggered()).toBe(true);

        // Verify proper log messages
        expect(motionSensor.outputs).toContain('Living Room Sensor detected motion!');
        expect(mediator.outputs).toContain(
            'Event received from Living Room Sensor: MOTION_DETECTED',
        );
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned ON');
        expect(kitchenLight.outputs).toContain('Kitchen Light light turned ON');
        expect(thermostat.outputs).toContain(
            'Thermostat eco mode disabled, temperature set to 22°C',
        );
        expect(securitySystem.outputs).toContain('SecuritySystem ALARM TRIGGERED!');
    });

    test('MotionSensor triggers mediator when no motion is detected', () => {
        // Turn on lights initially
        livingRoomLight.turnOn();
        kitchenLight.turnOn();

        // Simulate no motion detection
        motionSensor.noMotionDetected();

        // Verify lights were turned off via mediator
        expect(livingRoomLight.isLightOn()).toBe(false);
        expect(kitchenLight.isLightOn()).toBe(false);

        // Verify thermostat eco mode was enabled via mediator
        expect(thermostat.isEcoModeEnabled()).toBe(true);

        // Verify proper log messages
        expect(motionSensor.outputs).toContain(
            'Living Room Sensor reports no motion for 10 minutes',
        );
        expect(mediator.outputs).toContain(
            'Event received from Living Room Sensor: NO_MOTION_DETECTED',
        );
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned OFF');
        expect(kitchenLight.outputs).toContain('Kitchen Light light turned OFF');
        expect(thermostat.outputs).toContain(
            'Thermostat eco mode enabled, temperature set to 18°C',
        );
    });

    test('SecuritySystem triggers mediator when armed', () => {
        // Turn on lights initially
        livingRoomLight.turnOn();
        kitchenLight.turnOn();

        // Arm the security system
        securitySystem.arm();

        // Verify lights were turned off via mediator
        expect(livingRoomLight.isLightOn()).toBe(false);
        expect(kitchenLight.isLightOn()).toBe(false);

        // Verify thermostat eco mode was enabled via mediator
        expect(thermostat.isEcoModeEnabled()).toBe(true);

        // Verify proper log messages
        expect(securitySystem.outputs).toContain('SecuritySystem armed');
        expect(mediator.outputs).toContain('Event received from SecuritySystem: SYSTEM_ARMED');
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned OFF');
        expect(kitchenLight.outputs).toContain('Kitchen Light light turned OFF');
        expect(thermostat.outputs).toContain(
            'Thermostat eco mode enabled, temperature set to 18°C',
        );
    });

    test('SecuritySystem triggers mediator when alarm is triggered', () => {
        // Arm the security system
        securitySystem.arm();

        // Turn off lights initially (they should be off after arming anyway)
        livingRoomLight.turnOff();
        kitchenLight.turnOff();

        // Trigger the alarm directly (normally would be via motion sensor)
        securitySystem.triggerAlarm();

        // Verify lights were turned on via mediator
        expect(livingRoomLight.isLightOn()).toBe(true);
        expect(kitchenLight.isLightOn()).toBe(true);

        // Verify proper log messages
        expect(securitySystem.outputs).toContain('SecuritySystem ALARM TRIGGERED!');
        expect(mediator.outputs).toContain('Event received from SecuritySystem: ALARM_TRIGGERED');
        expect(livingRoomLight.outputs).toContain('Living Room Light light turned ON');
        expect(kitchenLight.outputs).toContain('Kitchen Light light turned ON');
    });

    test('demonstrates adding a new component type without modifying existing components', () => {
        // Create a new component type
        class MusicPlayer extends SmartHomeComponent {
            private isPlaying: boolean = false;

            constructor(mediator: SmartHomeMediator, name: string) {
                super(mediator, name);
            }

            public play(): void {
                this.isPlaying = true;
                this.log(`${this.name} started playing music`);
            }

            public stop(): void {
                this.isPlaying = false;
                this.log(`${this.name} stopped playing music`);
            }

            public isPlayingMusic(): boolean {
                return this.isPlaying;
            }
        }

        // Extend the mediator to handle music player events
        class ExtendedMediator extends SmartHomeController {
            public notify(sender: SmartHomeComponent, event: SmartHomeEvent | string): void {
                super.notify(sender as SmartHomeComponent, event as SmartHomeEvent);

                // Add new handling for music player
                if (
                    event === SmartHomeEvent.SYSTEM_ARMED ||
                    event === SmartHomeEvent.NO_MOTION_DETECTED
                ) {
                    this.components.forEach((component) => {
                        if (component instanceof MusicPlayer) {
                            (component as MusicPlayer).stop();
                        }
                    });
                } else if (event === SmartHomeEvent.SYSTEM_DISARMED) {
                    this.components.forEach((component) => {
                        if (component instanceof MusicPlayer) {
                            (component as MusicPlayer).play();
                        }
                    });
                }
            }
        }

        // Create the extended mediator and components
        const extendedMediator = new ExtendedMediator();
        const musicPlayer = new MusicPlayer(extendedMediator, 'Living Room Music');
        const newSecuritySystem = new SecuritySystem(extendedMediator, 'New Security System');

        // Test the new functionality
        newSecuritySystem.arm();
        expect(musicPlayer.isPlayingMusic()).toBe(false);

        newSecuritySystem.disarm();
        expect(musicPlayer.isPlayingMusic()).toBe(true);

        // Note: We didn't have to modify any existing component classes
        // We only extended the mediator to handle the new component type
    });

    test('demonstrates benefits of the mediator pattern', () => {
        // Benefit 1: Reduced coupling - components only know about the mediator
        // Benefit 2: Centralized communication logic - all in the mediator
        // Benefit 3: Easy to add new components - no need to modify existing ones

        // Example: Adding a new event type without modifying components
        class CustomMediator extends SmartHomeController {
            public triggerCustomEvent(): void {
                // Create a proper component to use as sender
                const systemComponent = new Light(this, 'System');
                this.notify(systemComponent, 'CUSTOM_EVENT' as unknown as SmartHomeEvent);
            }

            public notify(sender: SmartHomeComponent, event: SmartHomeEvent | string): void {
                super.notify(sender as SmartHomeComponent, event as SmartHomeEvent);

                // Using a custom event not in the enum
                if (event === ('CUSTOM_EVENT' as unknown)) {
                    // Handle the custom event
                    this.components.forEach((component) => {
                        if (component instanceof Light) {
                            // Toggle all lights
                            if ((component as Light).isLightOn()) {
                                (component as Light).turnOff();
                            } else {
                                (component as Light).turnOn();
                            }
                        }
                    });
                }
            }
        }

        const customMediator = new CustomMediator();
        const newLight = new Light(customMediator, 'New Light');

        // Test the custom event
        newLight.turnOn();
        expect(newLight.isLightOn()).toBe(true);

        customMediator.triggerCustomEvent();
        expect(newLight.isLightOn()).toBe(false);

        customMediator.triggerCustomEvent();
        expect(newLight.isLightOn()).toBe(true);
    });
});
