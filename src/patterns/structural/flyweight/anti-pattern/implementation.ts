/**
 * Flyweight Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Creates a new object for each character instance, even if they are identical
 * 2. Memory inefficient - duplicate data is stored multiple times
 * 3. No reuse of shared intrinsic state
 * 4. Performance issues with large numbers of objects
 * 5. Difficult to manage and update properties that should be shared
 */
import { logger, LogColor } from '~/utils/logger';

// Text formatting options
export interface CharacterFormatting {
    fontFamily: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    color: string;
}

// Character class that stores both intrinsic (shareable) and extrinsic (non-shareable) state
export class Character {
    // Intrinsic state - these could be shared but aren't in the anti-pattern
    private readonly char: string;
    private readonly fontFamily: string;
    private readonly fontSize: number;
    private readonly isBold: boolean;
    private readonly isItalic: boolean;
    private readonly isUnderline: boolean;
    private readonly color: string;

    // Extrinsic state - these should vary by instance
    private positionX: number;
    private positionY: number;

    constructor(
        char: string,
        formatting: CharacterFormatting,
        positionX: number,
        positionY: number,
    ) {
        // In the anti-pattern, each character instance stores its own copy of all this data
        this.char = char;
        this.fontFamily = formatting.fontFamily;
        this.fontSize = formatting.fontSize;
        this.isBold = formatting.isBold;
        this.isItalic = formatting.isItalic;
        this.isUnderline = formatting.isUnderline;
        this.color = formatting.color;

        this.positionX = positionX;
        this.positionY = positionY;
    }

    render(): void {
        let styleDescription = `${this.fontFamily} ${this.fontSize}px`;
        if (this.isBold) styleDescription += ' bold';
        if (this.isItalic) styleDescription += ' italic';
        if (this.isUnderline) styleDescription += ' underline';

        logger.log(
            `Character '${this.char}' at position (${this.positionX},${this.positionY}) ` +
                `with style: ${styleDescription}, color: ${this.color}`,
            LogColor.INFO,
        );
    }

    movePosition(newX: number, newY: number): void {
        this.positionX = newX;
        this.positionY = newY;
    }

    getPositionX(): number {
        return this.positionX;
    }

    getPositionY(): number {
        return this.positionY;
    }

    getCharacter(): string {
        return this.char;
    }

    getFormattingInfo(): CharacterFormatting {
        return {
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            isBold: this.isBold,
            isItalic: this.isItalic,
            isUnderline: this.isUnderline,
            color: this.color,
        };
    }

    // This method demonstrates the memory footprint of this object
    getMemoryFootprint(): number {
        // Simulating memory usage - in bytes
        // In a real environment, this would depend on the JavaScript engine's implementation
        const charSize = 2; // UTF-16 character (2 bytes)
        const boolSize = 4; // Boolean typically takes 4 bytes
        const numberSize = 8; // Number typically takes 8 bytes
        const stringOverhead = 16; // Approximate overhead for string objects
        const stringContentSize = (str: string) => str.length * 2; // UTF-16 chars

        return (
            charSize + // character
            stringOverhead +
            stringContentSize(this.fontFamily) + // fontFamily
            numberSize + // fontSize
            boolSize + // isBold
            boolSize + // isItalic
            boolSize + // isUnderline
            stringOverhead +
            stringContentSize(this.color) + // color
            numberSize + // positionX
            numberSize // positionY
        );
    }
}

// TextEditor class using the Character objects without flyweight pattern
export class TextEditor {
    private characters: Character[] = [];
    private memoryUsed = 0;

    addCharacter(
        char: string,
        formatting: CharacterFormatting,
        positionX: number,
        positionY: number,
    ): void {
        // Always creates a new Character instance regardless of whether similar ones exist
        const newChar = new Character(char, formatting, positionX, positionY);
        this.characters.push(newChar);

        // Track the memory usage
        this.memoryUsed += newChar.getMemoryFootprint();
    }

    renderText(): void {
        logger.log('Rendering text with anti-pattern implementation:', LogColor.WARNING);
        for (const char of this.characters) {
            char.render();
        }
    }

    getCharacterCount(): number {
        return this.characters.length;
    }

    getMemoryUsage(): number {
        return this.memoryUsed;
    }

    findCharactersAt(posX: number, posY: number): Character[] {
        return this.characters.filter(
            (char) => char.getPositionX() === posX && char.getPositionY() === posY,
        );
    }
}

// Helper function to create a sample text
export function createSampleText(): TextEditor {
    const editor = new TextEditor();

    // Adding text "Hello" with the same formatting but different positions
    const basicFormatting: CharacterFormatting = {
        fontFamily: 'Arial',
        fontSize: 12,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        color: 'black',
    };

    // Each character is a separate object with duplicated formatting data
    editor.addCharacter('H', basicFormatting, 0, 0);
    editor.addCharacter('e', basicFormatting, 10, 0);
    editor.addCharacter('l', basicFormatting, 20, 0);
    editor.addCharacter('l', basicFormatting, 30, 0); // Duplicate character with same formatting
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

    logger.log(
        `Anti-pattern created ${editor.getCharacterCount()} character objects using ${editor.getMemoryUsage()} bytes`,
        LogColor.ERROR,
    );

    return editor;
}
