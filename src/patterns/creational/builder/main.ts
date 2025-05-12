/**
 * Builder Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Builder pattern.
 */

import {
    StandardComputerBuilder,
    ComputerDirector,
    CpuType,
    GpuType,
    MonitorType,
} from './proper-pattern/implementation';
import {
    createOfficeComputer,
    createGamingComputer,
    createCustomComputer,
} from './anti-pattern/implementation';
import { warning, properPattern } from '~/utils/colors';
import { logger } from '~/utils/logger';

/**
 * Demonstrates the anti-pattern approach to building complex objects
 * using constructors with many parameters
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating computers using constructor with many parameters:');
    const antiPatternOfficeComputer = createOfficeComputer();
    logger.info(`Created Office PC: ${warning(antiPatternOfficeComputer.toString())}`);

    const antiPatternGamingComputer = createGamingComputer();
    logger.info(`Created Gaming PC: ${warning(antiPatternGamingComputer.toString())}`);

    // Creating a custom computer requires passing all parameters in correct order
    logger.info('\nCreating custom computer with all parameters:');
    const antiPatternCustomComputer = createCustomComputer(
        'Custom Intel i7',
        16,
        512,
        'NVIDIA GTX 1660',
        true,
        true,
        '24" Monitor',
    );
    logger.info(`Created Custom PC: ${warning(antiPatternCustomComputer.toString())}`);

    logger.warn(
        '\nProblem: Creating objects requires knowing all parameters and their exact order',
    );
    logger.warn('No way to build objects step by step or skip optional parameters');

    try {
        // Attempt to demonstrate the limitation of this approach
        logger.info('\nAttempting to create a computer with partial parameters:');
        // This would fail in a real scenario as we can't easily skip parameters
        logger.error('Error: Cannot easily create object with only some parameters set');
        logger.error('Error: Cannot build object step by step');
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error: ${error.message}`);
        } else {
            logger.error(`Error: ${String(error)}`);
        }
    }
}

/**
 * Demonstrates the proper implementation of the Builder pattern
 * showing its flexibility and advantages
 */
function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Creating computers using builder pattern:');

    // Initialize builder and director
    const builder = new StandardComputerBuilder();
    const director = new ComputerDirector(builder);

    // Create predefined configurations using the director
    const officeComputer = director.makeOfficeComputer();
    logger.info(`Created Office PC: ${properPattern(officeComputer.toString())}`);

    const gamingComputer = director.makeGamingComputer();
    logger.info(`Created Gaming PC: ${properPattern(gamingComputer.toString())}`);

    const serverComputer = director.makeServerComputer();
    logger.info(`Created Server: ${properPattern(serverComputer.toString())}`);

    // Use the builder directly for custom configurations
    logger.info('\nCreating custom computer using the builder directly:');
    const customComputer = builder
        .setCpu(CpuType.INTEL_I7)
        .setRam(16)
        .setStorage(512)
        .setGpu(GpuType.NVIDIA_GTX_1660)
        .setWifi(true)
        .setBluetooth(true)
        .setMonitor(MonitorType.STANDARD_24)
        .build();

    logger.info(`Created Custom PC: ${properPattern(customComputer.toString())}`);

    // Demonstrate flexible construction
    logger.success('\nBenefit: Can build objects step by step, setting only needed properties');
    const minimalistComputer = builder
        .setCpu(CpuType.INTEL_I5)
        .setRam(4)
        .setStorage(128)
        // Skip other properties - they get default values
        .build();

    logger.info(`Created Minimalist PC: ${properPattern(minimalistComputer.toString())}`);

    logger.success(
        '\nBenefit: To add new computer configurations, we just use the existing builder',
    );
    logger.success('without modifying existing code (follows the Open/Closed principle)');

    // Extension example (showing how to extend the builder pattern)
    logger.info('\nExtension example (code comments):');
    logger.info('// 1. Create a new builder implementing the ComputerBuilder interface');
    logger.info('class GamingComputerBuilder implements ComputerBuilder { ... }');
    logger.info('// 2. Use the new builder with the existing director');
    logger.info('const gamingBuilder = new GamingComputerBuilder();');
    logger.info('director.changeBuilder(gamingBuilder);');
    logger.info('const ultimateGamingPC = director.makeGamingComputer();');
}

logger.info('=== Builder Pattern Example ===\n');

// Run the anti-pattern demonstration
demonstrateAntiPattern();

// Run the proper pattern demonstration
demonstrateProperPattern();

logger.info('\n=== End of Builder Pattern Example ===');
