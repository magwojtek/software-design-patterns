import { Character } from './implementation';

describe('Prototype Pattern - Anti-Pattern', () => {
    it('should create a new character with basic stats', () => {
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

    it('should add items to inventory', () => {
        const character = new Character('Rogue');
        character.addItem('dagger', 2);

        expect(character.inventory).toHaveProperty('dagger', 2);
    });

    it('should create a copy of a character but with problematic references', () => {
        // Original character
        const warrior = new Character('Warrior');
        warrior.addSkill('sword slash');
        warrior.addItem('sword', 1);

        // Make a copy
        const copiedWarrior = warrior.copy('WarriorCopy');

        // Initial state should match between original and copy
        expect(copiedWarrior.health).toBe(warrior.health);
        expect(copiedWarrior.attackPower).toBe(warrior.attackPower);
        expect(copiedWarrior.defensePower).toBe(warrior.defensePower);

        // ISSUE 1: Demonstrate problematic array reference
        warrior.addSkill('shield bash');
        // The copied warrior should not have the new skill, but it does due to shared reference
        expect(copiedWarrior.skills).toContain('shield bash');

        // ISSUE 2: Demonstrate problematic object reference
        warrior.addItem('shield', 1);
        // The copied warrior should not have the new item, but it does due to shared reference
        expect(copiedWarrior.inventory).toHaveProperty('shield', 1);

        // Even direct modification to the copied warrior affects the original
        copiedWarrior.addSkill('backstab');
        expect(warrior.skills).toContain('backstab');
    });
});
