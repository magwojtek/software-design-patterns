/**
 * Command Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Command pattern.
 */
import { RemoteControl as AntiPatternRemote } from './anti-pattern/implementation';
import {
    RemoteControl as ProperPatternRemote,
    LightOnCommand,
    LightOffCommand,
    FanHighCommand,
    FanOffCommand,
    Light,
    CeilingFan,
    MacroCommand,
} from './proper-pattern/implementation';
import { logger, LogColor } from '~/utils/logger';

/**
 * Demonstrates the anti-pattern approach to the Command pattern
 */
export function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating a remote control with hardcoded commands:');
    const antiPatternRemote = new AntiPatternRemote();
    logger.info('Pressing the light button:');
    antiPatternRemote.pressLightButton();
    logger.info('Pressing the fan button:');
    antiPatternRemote.pressFanButton();

    logger.warn('\nProblem: Cannot change commands at runtime');
    logger.warn('Problem: Cannot add new commands without modifying the Remote class');
    logger.warn('Problem: Hard to test due to tight coupling between remote and devices');
    logger.warn('Problem: No way to undo operations');
}

/**
 * Sets up devices and commands for the proper pattern demonstration
 */
function setupDevicesAndCommands(): {
    remote: ProperPatternRemote;
    livingRoomLight: Light;
    bedroomLight: Light;
    ceilingFan: CeilingFan;
    commands: {
        livingRoomLightOn: LightOnCommand;
        livingRoomLightOff: LightOffCommand;
        bedroomLightOn: LightOnCommand;
        bedroomLightOff: LightOffCommand;
        ceilingFanHigh: FanHighCommand;
        ceilingFanOff: FanOffCommand;
    };
} {
    const remote = new ProperPatternRemote();

    // Create devices
    logger.log('- Creating devices (Light, CeilingFan)', LogColor.COMMAND_SETUP);
    const livingRoomLight = new Light('Living Room');
    const bedroomLight = new Light('Bedroom');
    const ceilingFan = new CeilingFan('Living Room');

    // Create commands
    logger.log('- Creating commands for devices', LogColor.COMMAND_SETUP);
    const livingRoomLightOn = new LightOnCommand(livingRoomLight);
    const livingRoomLightOff = new LightOffCommand(livingRoomLight);
    const bedroomLightOn = new LightOnCommand(bedroomLight);
    const bedroomLightOff = new LightOffCommand(bedroomLight);
    const ceilingFanHigh = new FanHighCommand(ceilingFan);
    const ceilingFanOff = new FanOffCommand(ceilingFan);

    // Set commands on remote
    logger.log('- Setting commands on remote', LogColor.COMMAND_SETUP);
    remote.setCommand(0, livingRoomLightOn, livingRoomLightOff);
    logger.info(`Slot 0 configured with ${livingRoomLightOn} and ${livingRoomLightOff}`);

    remote.setCommand(1, bedroomLightOn, bedroomLightOff);
    logger.info(`Slot 1 configured with ${bedroomLightOn} and ${bedroomLightOff}`);

    remote.setCommand(2, ceilingFanHigh, ceilingFanOff);
    logger.info(`Slot 2 configured with ${ceilingFanHigh} and ${ceilingFanOff}`);

    return {
        remote,
        livingRoomLight,
        bedroomLight,
        ceilingFan,
        commands: {
            livingRoomLightOn,
            livingRoomLightOff,
            bedroomLightOn,
            bedroomLightOff,
            ceilingFanHigh,
            ceilingFanOff,
        },
    };
}

/**
 * Demonstrates basic command execution
 */
function demonstrateBasicCommandExecution(remote: ProperPatternRemote): void {
    logger.info('\nExecuting commands:');
    logger.log('- Turning on living room light (slot 0)', LogColor.COMMAND_EXECUTION);
    remote.onButtonPressed(0);
    logger.log('- Turning off living room light (slot 0)', LogColor.COMMAND_EXECUTION);
    remote.offButtonPressed(0);
}

/**
 * Demonstrates command undo functionality
 */
function demonstrateUndoFunctionality(remote: ProperPatternRemote): void {
    logger.info('\nTesting undo functionality:');
    logger.log('- Turning on bedroom light (slot 1)', LogColor.COMMAND_UNDO);
    remote.onButtonPressed(1);
    logger.log('- Undoing last operation', LogColor.COMMAND_UNDO);
    remote.undoButtonPressed();
}

/**
 * Demonstrates command state handling
 */
function demonstrateStateHandling(remote: ProperPatternRemote): void {
    logger.info('\nTesting the fan with multiple speed states:');
    logger.log('- Turning fan to high speed (slot 2)', LogColor.COMMAND_EXECUTION);
    remote.onButtonPressed(2);
    logger.log('- Turning fan off (slot 2)', LogColor.COMMAND_EXECUTION);
    remote.offButtonPressed(2);
    logger.log('- Undoing (fan should return to high speed)', LogColor.COMMAND_UNDO);
    remote.undoButtonPressed();
}

/**
 * Demonstrates macro commands
 */
function demonstrateMacroCommands(
    remote: ProperPatternRemote,
    commands: {
        livingRoomLightOn: LightOnCommand;
        ceilingFanHigh: FanHighCommand;
        livingRoomLightOff: LightOffCommand;
        ceilingFanOff: FanOffCommand;
    },
): void {
    logger.info('\nCreating a macro command at runtime:');
    // Create a macro command that turns on multiple devices at once
    logger.log('- Creating macro command for party mode', LogColor.COMMAND_SETUP);
    const partyOnMacro = new MacroCommand([commands.livingRoomLightOn, commands.ceilingFanHigh]);
    const partyOffMacro = new MacroCommand([commands.livingRoomLightOff, commands.ceilingFanOff]);
    remote.setCommand(3, partyOnMacro, partyOffMacro);
    logger.info(`Slot 3 configured with ${partyOnMacro} and ${partyOffMacro}`);

    logger.log('- Executing party mode ON macro (slot 3)', LogColor.COMMAND_EXECUTION);
    remote.onButtonPressed(3);
    logger.log('- Executing party mode OFF macro (slot 3)', LogColor.COMMAND_EXECUTION);
    remote.offButtonPressed(3);
}

/**
 * Demonstrates the proper implementation of the Command pattern
 */
export function demonstrateProperPattern(): void {
    logger.success('--- Proper Pattern Example ---');
    logger.info('Creating a remote control:');
    const properRemoteSetup = setupDevicesAndCommands();
    const properPatternRemote = properRemoteSetup.remote;

    logger.info('\nConfiguring commands for slots:');

    // Demonstrate different aspects of the pattern
    demonstrateBasicCommandExecution(properPatternRemote);
    demonstrateUndoFunctionality(properPatternRemote);
    demonstrateStateHandling(properPatternRemote);
    demonstrateMacroCommands(properPatternRemote, properRemoteSetup.commands);

    logger.success('\nBenefits:');
    logger.success('1. Decouples sender from receiver');
    logger.success('2. Commands can be stored, passed around, and executed when needed');
    logger.success('3. Easy to add new commands without modifying existing code');
    logger.success('4. Supports undo operations');
    logger.success('5. Supports composite commands (macros)');
}

// Main execution
logger.info('=== Command Pattern Example ===\n');

// Run the demonstrations
demonstrateAntiPattern();
logger.info(''); // Add a separator line
demonstrateProperPattern();

logger.info('\n=== End of Command Pattern Example ===');
