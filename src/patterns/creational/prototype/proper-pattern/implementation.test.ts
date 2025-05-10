import { Character, CharacterPrototypeRegistry } from './implementation';

describe('Prototype Pattern - Proper Implementation', () => {
    it('should create a character with basic stats', () => {
        const character = new Character('Warrior');

        expect(character.name).toBe('Warrior');
        expect(character.health).toBe(100);
        expect(character.attackPower).toBe(10);
        expect(character.defensePower).toBe(5);
        expect(character.skills).toContain('basic attack');
        expect(character.inventory).toHaveProperty('potion', 3);
    });

    it('should add skills to a character', () => {
        const character = new Character('Mage');
        character.addSkill('fireball');

        expect(character.skills).toContain('fireball');
    });

    it('should create a clone with independent properties', () => {
        // Create original character
        const warrior = new Character('Warrior');
        warrior.addSkill('sword slash');
        warrior.addItem('sword', 1);

        // Clone the character
        const clonedWarrior = warrior.clone();

        // Initial values should match (except the name)
        expect(clonedWarrior.name).toBe('Warrior_clone');
        expect(clonedWarrior.health).toBe(warrior.health);
        expect(clonedWarrior.attackPower).toBe(warrior.attackPower);
        expect(clonedWarrior.defensePower).toBe(warrior.defensePower);
        expect(clonedWarrior.skills).toContain('sword slash');
        expect(clonedWarrior.inventory).toHaveProperty('sword', 1);

        // Modify the original - should not affect the clone
        warrior.addSkill('shield bash');
        warrior.addItem('shield', 1);

        // Clone should not have the new skill or item
        expect(clonedWarrior.skills).not.toContain('shield bash');
        expect(clonedWarrior.inventory).not.toHaveProperty('shield');

        // Modify the clone - should not affect the original
        clonedWarrior.addSkill('dual wield');
        clonedWarrior.addItem('second sword', 1);

        // Original should not have the cloned character's new skill or item
        expect(warrior.skills).not.toContain('dual wield');
        expect(warrior.inventory).not.toHaveProperty('second sword');
    });

    it('should clone with a custom name', () => {
        const mage = new Character('Mage');
        mage.addSkill('fireball');

        const customNameClone = mage.cloneWithName('ArchMage');

        expect(customNameClone.name).toBe('ArchMage');
        expect(customNameClone.skills).toContain('fireball');
    });

    it('should create specialized characters from a base prototype', () => {
        const baseWarrior = new Character('BaseWarrior');

        // Create specialized warrior with bonuses
        const eliteWarrior = Character.createSpecialized(
            baseWarrior,
            'EliteWarrior',
            50, // health bonus
            15, // attack bonus
            10, // defense bonus
            'whirlwind attack', // additional skill
        );

        expect(eliteWarrior.name).toBe('EliteWarrior');
        expect(eliteWarrior.health).toBe(150); // 100 base + 50 bonus
        expect(eliteWarrior.attackPower).toBe(25); // 10 base + 15 bonus
        expect(eliteWarrior.defensePower).toBe(15); // 5 base + 10 bonus
        expect(eliteWarrior.skills).toContain('whirlwind attack');
    });

    it('should store and retrieve prototypes from registry', () => {
        // Create base prototypes
        const warriorPrototype = new Character('Warrior');
        warriorPrototype.addSkill('sword slash');

        const magePrototype = new Character('Mage');
        magePrototype.addSkill('fireball');

        // Register prototypes
        CharacterPrototypeRegistry.addPrototype('warrior', warriorPrototype);
        CharacterPrototypeRegistry.addPrototype('mage', magePrototype);

        // Get available prototypes
        expect(CharacterPrototypeRegistry.listPrototypes()).toContain('warrior');
        expect(CharacterPrototypeRegistry.listPrototypes()).toContain('mage');

        // Get a warrior from registry
        const newWarrior = CharacterPrototypeRegistry.getPrototype('warrior');
        expect(newWarrior).toBeDefined();
        expect(newWarrior?.skills).toContain('sword slash');

        // Get a mage from registry
        const newMage = CharacterPrototypeRegistry.getPrototype('mage');
        expect(newMage).toBeDefined();
        expect(newMage?.skills).toContain('fireball');

        // Modify the retrieved characters without affecting originals
        if (newWarrior) newWarrior.addSkill('heavy blow');
        expect(warriorPrototype.skills).not.toContain('heavy blow');
    });
});
