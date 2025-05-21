import { Character, CharacterFormatting, TextEditor, createSampleText } from './implementation';

describe('Flyweight Anti-Pattern Implementation', () => {
    let basicFormatting: CharacterFormatting;

    beforeEach(() => {
        basicFormatting = {
            fontFamily: 'Arial',
            fontSize: 12,
            isBold: false,
            isItalic: false,
            isUnderline: false,
            color: 'black',
        };
    });

    // Tests for Character class
    describe('Character', () => {
        it('should create character with correct properties', () => {
            const char = new Character('A', basicFormatting, 10, 20);

            expect(char.getCharacter()).toBe('A');
            expect(char.getPositionX()).toBe(10);
            expect(char.getPositionY()).toBe(20);
            expect(char.getFormattingInfo()).toEqual(basicFormatting);
        });

        it('should move character to new position', () => {
            const char = new Character('A', basicFormatting, 10, 20);
            char.movePosition(30, 40);

            expect(char.getPositionX()).toBe(30);
            expect(char.getPositionY()).toBe(40);
        });

        it('should calculate memory footprint', () => {
            const char = new Character('A', basicFormatting, 10, 20);
            const footprint = char.getMemoryFootprint();

            // Ensure it returns a number (exact value will depend on the implementation)
            expect(typeof footprint).toBe('number');
            expect(footprint).toBeGreaterThan(0);
        });
    });

    // Tests for TextEditor class
    describe('TextEditor', () => {
        let editor: TextEditor;

        beforeEach(() => {
            editor = new TextEditor();
        });

        it('should add characters correctly', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('B', basicFormatting, 20, 20);

            expect(editor.getCharacterCount()).toBe(2);
        });

        it('should find characters at specific position', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('B', basicFormatting, 20, 20);

            const charsAtPosition = editor.findCharactersAt(10, 20);
            expect(charsAtPosition.length).toBe(1);
            expect(charsAtPosition[0].getCharacter()).toBe('A');
        });

        it('should track memory usage', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('B', basicFormatting, 20, 20);

            expect(editor.getMemoryUsage()).toBeGreaterThan(0);
        });
    });

    // Test for the sample text creator function
    describe('createSampleText', () => {
        it('should create a text editor with multiple characters', () => {
            const editor = createSampleText();

            // Should have "Hello" + "World" = 10 characters
            expect(editor.getCharacterCount()).toBe(10);
        });

        it('should track memory usage for sample text', () => {
            const editor = createSampleText();

            expect(editor.getMemoryUsage()).toBeGreaterThan(0);
        });
    });

    // Anti-pattern specific tests
    describe('Anti-pattern specific behavior', () => {
        it('should create separate objects for identical characters', () => {
            const editor = new TextEditor();

            // Create two 'A' characters with the same formatting
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('A', basicFormatting, 30, 40);

            // In anti-pattern, each character is a separate object with duplicate formatting data
            const chars1 = editor.findCharactersAt(10, 20);
            const chars2 = editor.findCharactersAt(30, 40);

            expect(chars1[0]).not.toBe(chars2[0]); // Should be different objects
            expect(chars1[0].getFormattingInfo()).toEqual(chars2[0].getFormattingInfo()); // But with same formatting
        });
    });
});
