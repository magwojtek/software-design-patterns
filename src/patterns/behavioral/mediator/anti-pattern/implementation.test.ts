import { Light, MotionSensor, Thermostat, SecuritySystem } from './implementation';

describe('Mediator Anti-Pattern Tests', () => {
    test('Light can be turned on and off', () => {
        const light = new Light('Living Room Light');

        light.turnOn();
        expect(light.isLightOn()).toBe(true);
        expect(light.outputs).toContain('Living Room Light light turned ON');

        light.turnOff();
        expect(light.isLightOn()).toBe(false);
        expect(light.outputs).toContain('Living Room Light light turned OFF');
    });

    test('MotionSensor directly controls connected devices when motion is detected', () => {
        const motionSensor = new MotionSensor('Living Room Sensor');
        const light1 = new Light('Living Room Light');
        const light2 = new Light('Kitchen Light');
        const thermostat = new Thermostat('Main Thermostat');
        const securitySystem = new SecuritySystem('Home Security');

        // Connect devices to motion sensor
        motionSensor.addLight(light1);
        motionSensor.addLight(light2);
        motionSensor.setThermostat(thermostat);
        motionSensor.setSecuritySystem(securitySystem);

        // Arm the security system
        securitySystem.arm();

        // Simulate motion detection
        motionSensor.motionDetected();

        // Verify lights were turned on
        expect(light1.isLightOn()).toBe(true);
        expect(light2.isLightOn()).toBe(true);

        // Verify thermostat eco mode was disabled
        expect(thermostat.isEcoModeEnabled()).toBe(false);

        // Verify alarm was triggered
        expect(securitySystem.isAlarmTriggered()).toBe(true);

        // Verify proper log messages
        expect(motionSensor.outputs).toContain('Living Room Sensor detected motion!');
        expect(motionSensor.outputs).toContain('Living Room Sensor turned on Living Room Light');
        expect(motionSensor.outputs).toContain('Living Room Sensor turned on Kitchen Light');
        expect(motionSensor.outputs).toContain(
            'Living Room Sensor disabled eco mode on Main Thermostat',
        );
        expect(motionSensor.outputs).toContain(
            'Living Room Sensor triggered alarm via Home Security',
        );
    });

    test('MotionSensor directly controls connected devices when no motion is detected', () => {
        const motionSensor = new MotionSensor('Living Room Sensor');
        const light1 = new Light('Living Room Light');
        const light2 = new Light('Kitchen Light');
        const thermostat = new Thermostat('Main Thermostat');

        // Turn on lights initially
        light1.turnOn();
        light2.turnOn();

        // Connect devices to motion sensor
        motionSensor.addLight(light1);
        motionSensor.addLight(light2);
        motionSensor.setThermostat(thermostat);

        // Simulate no motion detection
        motionSensor.noMotionDetected();

        // Verify lights were turned off
        expect(light1.isLightOn()).toBe(false);
        expect(light2.isLightOn()).toBe(false);

        // Verify thermostat eco mode was enabled
        expect(thermostat.isEcoModeEnabled()).toBe(true);

        // Verify proper log messages
        expect(motionSensor.outputs).toContain(
            'Living Room Sensor reports no motion for 10 minutes',
        );
        expect(motionSensor.outputs).toContain('Living Room Sensor turned off Living Room Light');
        expect(motionSensor.outputs).toContain('Living Room Sensor turned off Kitchen Light');
        expect(motionSensor.outputs).toContain(
            'Living Room Sensor enabled eco mode on Main Thermostat',
        );
    });

    test('SecuritySystem directly controls connected devices when armed', () => {
        const securitySystem = new SecuritySystem('Home Security');
        const light1 = new Light('Living Room Light');
        const light2 = new Light('Kitchen Light');
        const thermostat = new Thermostat('Main Thermostat');

        // Turn on lights initially
        light1.turnOn();
        light2.turnOn();

        // Connect devices to security system
        securitySystem.addLight(light1);
        securitySystem.addLight(light2);
        securitySystem.setThermostat(thermostat);

        // Arm the security system
        securitySystem.arm();

        // Verify lights were turned off
        expect(light1.isLightOn()).toBe(false);
        expect(light2.isLightOn()).toBe(false);

        // Verify thermostat eco mode was enabled
        expect(thermostat.isEcoModeEnabled()).toBe(true);

        // Verify proper log messages
        expect(securitySystem.outputs).toContain('Home Security armed');
        expect(securitySystem.outputs).toContain('Home Security turned off Living Room Light');
        expect(securitySystem.outputs).toContain('Home Security turned off Kitchen Light');
        expect(securitySystem.outputs).toContain(
            'Home Security enabled eco mode on Main Thermostat',
        );
    });

    test('SecuritySystem directly controls connected devices when alarm is triggered', () => {
        const securitySystem = new SecuritySystem('Home Security');
        const light1 = new Light('Living Room Light');
        const light2 = new Light('Kitchen Light');

        // Connect devices to security system
        securitySystem.addLight(light1);
        securitySystem.addLight(light2);

        // Arm the security system
        securitySystem.arm();

        // Turn off lights initially (they should be off after arming anyway)
        light1.turnOff();
        light2.turnOff();

        // Trigger the alarm
        securitySystem.triggerAlarm();

        // Verify lights were turned on
        expect(light1.isLightOn()).toBe(true);
        expect(light2.isLightOn()).toBe(true);

        // Verify proper log messages
        expect(securitySystem.outputs).toContain('Home Security ALARM TRIGGERED!');
        expect(securitySystem.outputs).toContain(
            'Home Security turned on Living Room Light as alarm response',
        );
        expect(securitySystem.outputs).toContain(
            'Home Security turned on Kitchen Light as alarm response',
        );
    });

    test('demonstrates issues with the anti-pattern approach', () => {
        // Issue 1: High coupling - components need direct references to each other
        const motionSensor = new MotionSensor('Living Room Sensor');
        const light = new Light('Living Room Light');
        const thermostat = new Thermostat('Main Thermostat');
        const securitySystem = new SecuritySystem('Home Security');

        // Need to manually connect each component to others
        motionSensor.addLight(light);
        motionSensor.setThermostat(thermostat);
        motionSensor.setSecuritySystem(securitySystem);
        securitySystem.addLight(light);
        securitySystem.setThermostat(thermostat);

        // Issue 2: Adding a new device requires modifying existing components
        // For example, to add a new device type, we would need to:
        // 1. Create the new device class
        // 2. Modify MotionSensor to add methods for connecting to the new device
        // 3. Modify MotionSensor to add logic for controlling the new device
        // 4. Modify SecuritySystem to add methods for connecting to the new device
        // 5. Modify SecuritySystem to add logic for controlling the new device

        // Issue 3: Complex communication logic is spread across multiple components
        // Each component needs to know how to interact with every other component
    });
});
