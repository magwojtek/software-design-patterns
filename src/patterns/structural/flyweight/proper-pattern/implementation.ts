/**
 * Flyweight Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Significantly reduces memory usage by sharing common state
 * 2. Separates intrinsic (shared) and extrinsic (unique) state
 * 3. Allows efficient representation of large numbers of fine-grained objects
 * 4. Centralizes state management for shared properties
 * 5. Improves performance with large numbers of similar objects
 */
import { logger, LogColor } from '~/utils/logger';

// Text formatting options (intrinsic state)
export interface CharacterFormatting {
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    color: string;
}

// Character position (extrinsic state)
export interface CharacterPosition {
    x: number;
    y: number;
}

// Flyweight interface
export interface CharacterFlyweight {
    render(position: CharacterPosition): void;
    getCharacter(): string;
    getFormatting(): CharacterFormatting;
    getMemoryFootprint(): number;
}

// Concrete Flyweight - only stores intrinsic state
export class CharacterFlyweightImpl implements CharacterFlyweight {
    // Intrinsic state - shared across multiple instances
    constructor(
        private readonly char: string,
        private readonly formatting: CharacterFormatting,
    ) {}

    render(position: CharacterPosition): void {
        let styleDescription = `${this.formatting.fontFamily} ${this.formatting.fontSize}px`;
        if (this.formatting.isBold) styleDescription += ' bold';
        if (this.formatting.isItalic) styleDescription += ' italic';
        if (this.formatting.isUnderline) styleDescription += ' underline';

        logger.log(
            `Character '${this.char}' at position (${position.x},${position.y}) ` +
                `with style: ${styleDescription}, color: ${this.formatting.color}`,
            LogColor.INFO,
        );
    }

    getCharacter(): string {
        return this.char;
    }

    getFormatting(): CharacterFormatting {
        return this.formatting;
    }

    // This method demonstrates the memory footprint of this object
    getMemoryFootprint(): number {
        // Simulating memory usage - in bytes
        const charSize = 2; // UTF-16 character (2 bytes)
        const boolSize = 4; // Boolean typically takes 4 bytes
        const numberSize = 8; // Number typically takes 8 bytes
        const stringOverhead = 16; // Approximate overhead for string objects
        const stringContentSize = (str: string) => str.length * 2; // UTF-16 chars

        return (
            charSize + // character
            stringOverhead +
            stringContentSize(this.formatting.fontFamily) + // fontFamily
            numberSize + // fontSize
            boolSize + // isBold
            boolSize + // isItalic
            boolSize + // isUnderline
            stringOverhead +
            stringContentSize(this.formatting.color) // color
        );
    }
}

// Flyweight Factory - manages flyweight objects
export class CharacterFlyweightFactory {
    private flyweights: Map<string, CharacterFlyweight> = new Map();
    private memoryUsed = 0;
    private reusedCount = 0;
    private createdCount = 0;

    // Get or create a flyweight
    getFlyweight(char: string, formatting: CharacterFormatting): CharacterFlyweight {
        // Create a key from the intrinsic state
        const key = this.getKey(char, formatting);

        if (!this.flyweights.has(key)) {
            // Create new flyweight if it doesn't exist
            const flyweight = new CharacterFlyweightImpl(char, formatting);
            this.flyweights.set(key, flyweight);
            this.memoryUsed += flyweight.getMemoryFootprint();
            this.createdCount++;
            return flyweight;
        } else {
            // Reuse existing flyweight
            this.reusedCount++;
            return this.flyweights.get(key)!;
        }
    }

    // Generate a unique key for a combination of character and formatting
    private getKey(char: string, formatting: CharacterFormatting): string {
        return `${char}-${formatting.fontFamily}-${formatting.fontSize}-${formatting.isBold ? 1 : 0}-${
            formatting.isItalic ? 1 : 0
        }-${formatting.isUnderline ? 1 : 0}-${formatting.color}`;
    }

    // Get statistics about the factory
    getStats(): { count: number; memory: number; reused: number; created: number } {
        return {
            count: this.flyweights.size,
            memory: this.memoryUsed,
            reused: this.reusedCount,
            created: this.createdCount,
        };
    }

    // Return all available flyweights
    getAllFlyweights(): CharacterFlyweight[] {
        return Array.from(this.flyweights.values());
    }
}

// Context class that uses flyweight objects with extrinsic state
export class CharacterContext {
    constructor(
        private flyweight: CharacterFlyweight,
        private position: CharacterPosition,
    ) {}

    render(): void {
        this.flyweight.render(this.position);
    }

    movePosition(x: number, y: number): void {
        this.position = { x, y };
    }

    getPosition(): CharacterPosition {
        return this.position;
    }

    getFlyweight(): CharacterFlyweight {
        return this.flyweight;
    }
}

// TextEditor class using the Flyweight pattern
export class TextEditor {
    private characters: CharacterContext[] = [];
    private factory: CharacterFlyweightFactory;

    constructor(factory: CharacterFlyweightFactory) {
        this.factory = factory;
    }

    addCharacter(
        char: string,
        formatting: CharacterFormatting,
        positionX: number,
        positionY: number,
    ): void {
        // Get a flyweight for the character with specific formatting
        const flyweight = this.factory.getFlyweight(char, formatting);

        // Create a context with the flyweight and the extrinsic state
        const context = new CharacterContext(flyweight, { x: positionX, y: positionY });
        this.characters.push(context);
    }

    renderText(): void {
        logger.success('Rendering text with proper pattern implementation:');
        for (const charContext of this.characters) {
            charContext.render();
        }
    }

    getCharacterCount(): number {
        return this.characters.length;
    }

    getFlyweightStats(): { count: number; memory: number; reused: number; created: number } {
        return this.factory.getStats();
    }

    findCharactersAt(posX: number, posY: number): CharacterContext[] {
        return this.characters.filter(
            (char) => char.getPosition().x === posX && char.getPosition().y === posY,
        );
    }
}

// Helper function to create a sample text
export function createSampleText(): TextEditor {
    const factory = new CharacterFlyweightFactory();
    const editor = new TextEditor(factory);

    // Adding text "Hello" with the same formatting but different positions
    const basicFormatting: CharacterFormatting = {
        fontFamily: 'Arial',
        fontSize: 12,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        color: 'black',
    };

    // Each unique character-formatting combination is stored only once
    editor.addCharacter('H', basicFormatting, 0, 0);
    editor.addCharacter('e', basicFormatting, 10, 0);
    editor.addCharacter('l', basicFormatting, 20, 0);
    editor.addCharacter('l', basicFormatting, 30, 0); // Reuses the flyweight for 'l'
    editor.addCharacter('o', basicFormatting, 40, 0);

    // Adding text "World" with bold formatting
    const boldFormatting: CharacterFormatting = {
        fontFamily: 'Arial',
        fontSize: 12,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        color: 'black',
    };

    editor.addCharacter('W', boldFormatting, 0, 20);
    editor.addCharacter('o', boldFormatting, 10, 20);
    editor.addCharacter('r', boldFormatting, 20, 20);
    editor.addCharacter('l', boldFormatting, 30, 20);
    editor.addCharacter('d', boldFormatting, 40, 20);

    const stats = editor.getFlyweightStats();
    logger.success(
        `Proper pattern created ${editor.getCharacterCount()} characters using ${stats.count} flyweights ` +
            `(created ${stats.created}, reused ${stats.reused}) using ${stats.memory} bytes`,
    );

    return editor;
}
