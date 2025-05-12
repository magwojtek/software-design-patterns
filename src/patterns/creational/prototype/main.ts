/**
 * Prototype Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Prototype pattern.
 */
import { Character as AntiPatternCharacter } from './anti-pattern/implementation';
import {
    Character as ProperPatternCharacter,
    CharacterPrototypeRegistry,
} from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

/**
 * Demonstrates the anti-pattern approach to copying objects
 * using a copy method that doesn't handle references properly
 */
function demonstrateAntiPattern(): void {
    logger.info('--- Anti-pattern Example ---');
    logger.info('Creating base character (expensive operation):');
    const warrior = new AntiPatternCharacter('Warrior');
    warrior.addSkill('sword slash');
    warrior.addItem('sword', 1);
    warrior.displayStats();

    logger.info('\nCreating a copy (runs expensive initialization again):');
    const copiedWarrior = warrior.copy('WarriorCopy');
    copiedWarrior.displayStats();

    logger.info("\nModifying original warrior's skills:");
    warrior.addSkill('shield bash');
    logger.info(
        "Displaying copied warrior's skills (should not have shield bash, but does because of reference sharing):",
    );
    copiedWarrior.displayStats();

    logger.info("\nModifying copied warrior's inventory:");
    copiedWarrior.addItem('bow', 1);
    logger.info(
        "Displaying original warrior's inventory (should not have bow, but does because of reference sharing):",
    );
    warrior.displayStats();

    logger.error(
        '\nProblem: Modifications to one character affect the other due to shared references\n',
    );
}

/**
 * Demonstrates the proper implementation of the Prototype pattern
 * showing its flexibility and advantages
 */
function demonstrateProperPattern(): void {
    logger.success('--- Proper Pattern Example ---');

    logger.info('Creating base character prototypes (expensive operation):');
    logger.info('1. Creating warrior prototype:');
    const warriorPrototype = new ProperPatternCharacter('BaseWarrior');
    warriorPrototype.addSkill('sword slash');
    warriorPrototype.addItem('sword', 1);

    logger.info('2. Creating mage prototype:');
    const magePrototype = new ProperPatternCharacter('BaseMage');
    magePrototype.addSkill('fireball');
    magePrototype.addItem('staff', 1);
    magePrototype.increaseStats(0, 15, 0); // Higher attack power

    logger.info('3. Creating rogue prototype:');
    const roguePrototype = new ProperPatternCharacter('BaseRogue');
    roguePrototype.addSkill('backstab');
    roguePrototype.addItem('dagger', 2);
    roguePrototype.increaseStats(0, 5, 5); // Balanced attack and defense

    // Register prototypes
    CharacterPrototypeRegistry.addPrototype('warrior', warriorPrototype);
    CharacterPrototypeRegistry.addPrototype('mage', magePrototype);
    CharacterPrototypeRegistry.addPrototype('rogue', roguePrototype);

    logger.info(
        `\nRegistered character prototypes: ${CharacterPrototypeRegistry.listPrototypes().join(', ')}`,
    );

    logger.info('\nCloning warrior and mage characters (fast, no expensive initialization):');
    const player1 =
        CharacterPrototypeRegistry.getPrototype('warrior')?.cloneWithName('Player1_Warrior');
    const player2 = CharacterPrototypeRegistry.getPrototype('mage')?.cloneWithName('Player2_Mage');

    if (player1) player1.displayStats();
    if (player2) player2.displayStats();

    logger.info('\nModifying player1 character:');
    if (player1) {
        player1.addSkill('heavy blow');
        player1.addItem('shield', 1);
        player1.displayStats();
    }

    logger.info('\nChecking warrior prototype (should not have heavy blow or shield):');
    warriorPrototype.displayStats();

    logger.info('\nCreating specialized characters from the base prototype:');
    const eliteWarrior = ProperPatternCharacter.createSpecialized(
        warriorPrototype,
        'EliteWarrior',
        50, // health bonus
        15, // attack bonus
        10, // defense bonus
        'whirlwind attack', // additional skill
    );
    eliteWarrior.displayStats();

    logger.success('\nBenefits of the Prototype Pattern:');
    logger.success(
        '1. Efficient object creation: Avoids expensive initialization for each new character',
    );
    logger.success('2. Deep copying: Objects have their own independent properties and references');
    logger.success('3. Flexibility: Specialized cloning methods for different variations');
    logger.success('4. Registry: Centralized storage and access to available prototypes');
    logger.success('5. Type safety: Interface ensures all prototypes implement clone method');
}

logger.info('=== Prototype Pattern Example ===\n');

// Run the anti-pattern demonstration
demonstrateAntiPattern();

// Run the proper pattern demonstration
demonstrateProperPattern();

logger.info('\n=== End of Prototype Pattern Example ===');
