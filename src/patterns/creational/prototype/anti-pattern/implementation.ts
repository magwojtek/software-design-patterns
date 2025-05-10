/**
 * Prototype Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Creates new objects from scratch each time (expensive initialization)
 * 2. Uses shallow copying that doesn't properly handle complex object structures
 * 3. Manual copying is error-prone and doesn't scale with new properties
 * 4. No formal interface for cloning operations
 */
import { logger } from '~/utils/logger';

export class Character {
    name: string;
    health: number;
    attackPower: number;
    defensePower: number;
    skills: string[];
    inventory: { [key: string]: number };

    constructor(name: string) {
        // Expensive initialization operations
        this.name = name;
        this.health = 100;
        this.attackPower = 10;
        this.defensePower = 5;
        this.skills = ['basic attack'];
        this.inventory = { potion: 3 };

        // Simulate expensive initialization
        this.loadDefaultStats();
    }

    loadDefaultStats(): void {
        logger.info(`${this.name}: Loading default stats (expensive operation)`);
        // Simulate a complex loading operation
    }

    increaseStats(healthBonus = 0, attackBonus = 0, defenseBonus = 0): void {
        this.health += healthBonus;
        this.attackPower += attackBonus;
        this.defensePower += defenseBonus;
    }

    addSkill(skill: string): void {
        this.skills.push(skill);
        logger.info(`${this.name} learned ${skill}`);
    }

    addItem(item: string, quantity = 1): void {
        if (this.inventory[item]) {
            this.inventory[item] += quantity;
        } else {
            this.inventory[item] = quantity;
        }
        logger.info(`${this.name} received ${quantity} ${item}(s)`);
    }

    // Problem: Manual copying is error-prone and doesn't properly handle complex objects
    copy(newName: string): Character {
        // This creates a brand new character and runs expensive initialization again
        const newCharacter = new Character(newName);

        // Manually copy each property
        newCharacter.health = this.health;
        newCharacter.attackPower = this.attackPower;
        newCharacter.defensePower = this.defensePower;

        // Problem: Shallow copy means both objects reference the same array
        newCharacter.skills = this.skills; // Wrong! This is just a reference

        // Problem: Shallow copy of nested objects
        newCharacter.inventory = this.inventory; // Wrong! This is just a reference

        return newCharacter;
    }

    displayStats(): void {
        logger.info(`=== ${this.name} Stats ===`);
        logger.info(`Health: ${this.health}`);
        logger.info(`Attack: ${this.attackPower}`);
        logger.info(`Defense: ${this.defensePower}`);
        logger.info(`Skills: ${this.skills.join(', ')}`);

        logger.info('Inventory:');
        Object.entries(this.inventory).forEach(([item, count]) => {
            logger.info(`  ${item}: ${count}`);
        });
    }
}
