/**
 * Prototype Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Uses a formal Prototype interface with a clone method
 * 2. Properly handles deep copying of complex structures
 * 3. Provides flexibility with specialized cloning methods
 * 4. Encapsulates cloning details from client code
 * 5. Avoids expensive initialization when creating similar objects
 */
import { logger, LogColor } from '~/utils/logger';

// Define the Prototype interface
export interface Prototype<T> {
    clone(): T;
}

export class Character implements Prototype<Character> {
    private _name: string;
    private _health: number;
    private _attackPower: number;
    private _defensePower: number;
    private _skills: string[];
    private _inventory: { [key: string]: number };

    constructor(name: string) {
        this._name = name;
        this._health = 100;
        this._attackPower = 10;
        this._defensePower = 5;
        this._skills = ['basic attack'];
        this._inventory = { potion: 3 };

        // Expensive initialization - only runs when explicitly creating a new character
        this.loadDefaultStats();
    }

    private loadDefaultStats(): void {
        logger.log(`${this._name}: Loading default stats (expensive operation)`, LogColor.INFO);
        // Simulate a complex loading operation
    }

    // Implementation of the clone method from the Prototype interface
    public clone(): Character {
        // Create a new instance using Object.create to avoid calling constructor
        const clone = Object.create(Character.prototype);

        // Copy primitive values
        clone._name = `${this._name}_clone`;
        clone._health = this._health;
        clone._attackPower = this._attackPower;
        clone._defensePower = this._defensePower;

        // Deep copy for arrays
        clone._skills = [...this._skills];

        // Deep copy for objects
        clone._inventory = { ...this._inventory };

        logger.log(
            `Cloned ${this._name} into ${clone._name} (without expensive initialization)`,
            LogColor.INFO,
        );

        return clone;
    }

    // Specialized clone method with custom name
    public cloneWithName(name: string): Character {
        const clone = this.clone();
        clone._name = name;
        return clone;
    }

    // Helper method to create a specialized character prototype from base
    public static createSpecialized(
        baseCharacter: Character,
        name: string,
        healthBonus: number,
        attackBonus: number,
        defenseBonus: number,
        additionalSkill: string,
    ): Character {
        const specialized = baseCharacter.cloneWithName(name);
        specialized.increaseStats(healthBonus, attackBonus, defenseBonus);
        if (additionalSkill) specialized.addSkill(additionalSkill);
        return specialized;
    }

    public increaseStats(healthBonus = 0, attackBonus = 0, defenseBonus = 0): void {
        this._health += healthBonus;
        this._attackPower += attackBonus;
        this._defensePower += defenseBonus;
    }

    public addSkill(skill: string): void {
        this._skills.push(skill);
        logger.log(`${this._name} learned ${skill}`, LogColor.INFO);
    }

    public addItem(item: string, quantity = 1): void {
        if (this._inventory[item]) {
            this._inventory[item] += quantity;
        } else {
            this._inventory[item] = quantity;
        }
        logger.log(`${this._name} received ${quantity} ${item}(s)`, LogColor.INFO);
    }

    public displayStats(): void {
        logger.log(`=== ${this._name} Stats ===`, LogColor.INFO);
        logger.log(`Health: ${this._health}`, LogColor.INFO);
        logger.log(`Attack: ${this._attackPower}`, LogColor.INFO);
        logger.log(`Defense: ${this._defensePower}`, LogColor.INFO);
        logger.log(`Skills: ${this._skills.join(', ')}`, LogColor.INFO);

        logger.log('Inventory:', LogColor.INFO);
        Object.entries(this._inventory).forEach(([item, count]) => {
            logger.log(`  ${item}: ${count}`, LogColor.INFO);
        });
    }

    // Getters to access private properties
    get name(): string {
        return this._name;
    }
    get health(): number {
        return this._health;
    }
    get attackPower(): number {
        return this._attackPower;
    }
    get defensePower(): number {
        return this._defensePower;
    }
    get skills(): string[] {
        return [...this._skills];
    } // Return a copy to maintain encapsulation
    get inventory(): { [key: string]: number } {
        return { ...this._inventory };
    } // Return a copy to maintain encapsulation
}

// Example of a prototype registry/cache
export class CharacterPrototypeRegistry {
    private static _prototypes: Map<string, Character> = new Map();

    public static addPrototype(name: string, prototype: Character): void {
        CharacterPrototypeRegistry._prototypes.set(name, prototype);
        logger.log(`Added "${name}" prototype to registry`, LogColor.INFO);
    }

    public static getPrototype(name: string): Character | undefined {
        const prototype = CharacterPrototypeRegistry._prototypes.get(name);
        if (!prototype) {
            logger.log(`Prototype "${name}" not found in registry`, LogColor.WARNING);
            return undefined;
        }
        return prototype.clone();
    }

    public static listPrototypes(): string[] {
        return Array.from(CharacterPrototypeRegistry._prototypes.keys());
    }
}
