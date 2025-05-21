/**
 * Mediator Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Mediator pattern.
 */
import { logger, LogColor } from '~/utils/logger';
import {
    Light as AntiPatternLight,
    MotionSensor as AntiPatternMotionSensor,
    Thermostat as AntiPatternThermostat,
    SecuritySystem as AntiPatternSecuritySystem,
} from './anti-pattern/implementation';

import {
    SmartHomeController,
    Light,
    MotionSensor,
    Thermostat,
    SecuritySystem,
} from './proper-pattern/implementation';

logger.log('=== Mediator Pattern Example ===\n', LogColor.HEADING);

/**
 * Demonstrates the anti-pattern implementation of the Mediator pattern
 * with direct dependencies between components.
 */
function demonstrateAntiPattern(): void {
    logger.log('--- Anti-pattern Example ---', LogColor.ANTI_PATTERN);
    logger.info('Creating smart home devices with direct dependencies:');

    const livingRoomLight = new AntiPatternLight('Living Room Light');
    const kitchenLight = new AntiPatternLight('Kitchen Light');
    const motionSensor = new AntiPatternMotionSensor('Living Room Sensor');
    const thermostat = new AntiPatternThermostat('Main Thermostat');
    const securitySystem = new AntiPatternSecuritySystem('Home Security');

    // Connect devices directly to each other
    logger.info('\nConnecting devices directly to each other:');
    motionSensor.addLight(livingRoomLight);
    motionSensor.addLight(kitchenLight);
    motionSensor.setThermostat(thermostat);
    motionSensor.setSecuritySystem(securitySystem);

    securitySystem.addLight(livingRoomLight);
    securitySystem.addLight(kitchenLight);
    securitySystem.setThermostat(thermostat);

    // Demonstrate the anti-pattern behavior
    logger.info('\nArming the security system:');
    securitySystem.arm();

    logger.info('\nSimulating motion detection:');
    motionSensor.motionDetected();

    logger.info('\nSimulating no motion for 10 minutes:');
    motionSensor.noMotionDetected();

    logger.warn('\nProblems:');
    logger.error('1. Direct dependencies between components');
    logger.error('2. Components know about each other and communicate directly');
    logger.error('3. High coupling between components');
    logger.error('4. Hard to add new components without modifying existing ones');
    logger.error('5. Complex communication logic spread across multiple components\n');
}

/**
 * Demonstrates the proper implementation of the Mediator pattern
 * with centralized communication through a mediator.
 */
function demonstrateProperPattern(): void {
    logger.log('--- Proper Pattern Example ---', LogColor.PROPER_PATTERN);
    logger.info('Creating smart home devices with a mediator:');

    // Create the mediator
    const mediator = new SmartHomeController();

    // Create components that only know about the mediator
    // All components are used in the demonstration through the mediator
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const livingRoomLight = new Light(mediator, 'Living Room Light');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const kitchenLight = new Light(mediator, 'Kitchen Light');
    const motionSensor = new MotionSensor(mediator, 'Living Room Sensor');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const thermostat = new Thermostat(mediator, 'Main Thermostat');
    const securitySystem = new SecuritySystem(mediator, 'Home Security');

    // No need to connect components to each other - they only know the mediator

    // Demonstrate the proper pattern behavior
    logger.info('\nArming the security system:');
    securitySystem.arm();

    logger.info('\nSimulating motion detection:');
    motionSensor.motionDetected();

    logger.info('\nSimulating no motion for 10 minutes:');
    motionSensor.noMotionDetected();

    logger.info('\nCreating a new component type at runtime:');

    // Define a new component type
    class MusicPlayer extends Light {
        constructor(mediator: SmartHomeController, name: string) {
            super(mediator, name);
        }

        public playMusic(): void {
            this.log(`${this.name} started playing music`);
            // In a real implementation, this would actually play music
        }

        public stopMusic(): void {
            this.log(`${this.name} stopped playing music`);
            // In a real implementation, this would actually stop music
        }
    }

    // Add the new component type
    const musicPlayer = new MusicPlayer(mediator, 'Living Room Music Player');

    logger.info('\nDisarming the security system:');
    securitySystem.disarm();

    // We can use the new component without modifying existing ones
    logger.info('\nPlaying music:');
    musicPlayer.playMusic();

    logger.success('\nBenefits:');
    logger.success('1. Reduces coupling between components');
    logger.success("2. Components don't know about each other directly");
    logger.success('3. Centralizes complex communication logic');
    logger.success('4. Makes it easier to add new components');
    logger.success('5. Simplifies component interactions');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.log('\n=== End of Mediator Pattern Example ===', LogColor.HEADING);
