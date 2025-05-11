import {
    CharacterFormatting,
    CharacterFlyweightFactory,
    CharacterFlyweightImpl,
    CharacterContext,
    TextEditor,
    createSampleText,
} from './implementation';

// Mock the logger to avoid polluting test output
jest.mock('../../../../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        success: jest.fn(),
    },
    LogColor: {
        INFO: '',
        WARNING: '',
        ERROR: '',
        SUCCESS: '',
    },
}));

describe('Flyweight Proper Pattern Implementation', () => {
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

    // Tests for CharacterFlyweightImpl class
    describe('CharacterFlyweightImpl', () => {
        it('should create flyweight with correct properties', () => {
            const flyweight = new CharacterFlyweightImpl('A', basicFormatting);

            expect(flyweight.getCharacter()).toBe('A');
            expect(flyweight.getFormatting()).toEqual(basicFormatting);
        });

        it('should calculate memory footprint', () => {
            const flyweight = new CharacterFlyweightImpl('A', basicFormatting);
            const footprint = flyweight.getMemoryFootprint();

            expect(typeof footprint).toBe('number');
            expect(footprint).toBeGreaterThan(0);
        });
    });

    // Tests for CharacterFlyweightFactory class
    describe('CharacterFlyweightFactory', () => {
        let factory: CharacterFlyweightFactory;

        beforeEach(() => {
            factory = new CharacterFlyweightFactory();
        });

        it('should create new flyweight if it does not exist', () => {
            const flyweight1 = factory.getFlyweight('A', basicFormatting);

            expect(flyweight1).toBeDefined();
            expect(flyweight1.getCharacter()).toBe('A');

            const stats = factory.getStats();
            expect(stats.count).toBe(1);
            expect(stats.created).toBe(1);
            expect(stats.reused).toBe(0);
        });

        it('should reuse existing flyweight if it exists', () => {
            const flyweight1 = factory.getFlyweight('A', basicFormatting);
            const flyweight2 = factory.getFlyweight('A', basicFormatting);

            expect(flyweight1).toBe(flyweight2); // Should be the same instance

            const stats = factory.getStats();
            expect(stats.count).toBe(1); // Only one unique flyweight
            expect(stats.created).toBe(1);
            expect(stats.reused).toBe(1); // Reused once
        });

        it('should create different flyweights for different characters', () => {
            const flyweight1 = factory.getFlyweight('A', basicFormatting);
            const flyweight2 = factory.getFlyweight('B', basicFormatting);

            expect(flyweight1).not.toBe(flyweight2);

            const stats = factory.getStats();
            expect(stats.count).toBe(2);
            expect(stats.created).toBe(2);
            expect(stats.reused).toBe(0);
        });

        it('should create different flyweights for different formatting', () => {
            const boldFormatting = { ...basicFormatting, isBold: true };

            const flyweight1 = factory.getFlyweight('A', basicFormatting);
            const flyweight2 = factory.getFlyweight('A', boldFormatting);

            expect(flyweight1).not.toBe(flyweight2);

            const stats = factory.getStats();
            expect(stats.count).toBe(2);
            expect(stats.created).toBe(2);
            expect(stats.reused).toBe(0);
        });
    });

    // Tests for CharacterContext class
    describe('CharacterContext', () => {
        let factory: CharacterFlyweightFactory;

        beforeEach(() => {
            factory = new CharacterFlyweightFactory();
        });

        it('should create context with correct properties', () => {
            const flyweight = factory.getFlyweight('A', basicFormatting);
            const context = new CharacterContext(flyweight, { x: 10, y: 20 });

            expect(context.getFlyweight()).toBe(flyweight);
            expect(context.getPosition()).toEqual({ x: 10, y: 20 });
        });

        it('should move to new position', () => {
            const flyweight = factory.getFlyweight('A', basicFormatting);
            const context = new CharacterContext(flyweight, { x: 10, y: 20 });

            context.movePosition(30, 40);
            expect(context.getPosition()).toEqual({ x: 30, y: 40 });
        });
    });

    // Tests for TextEditor class
    describe('TextEditor', () => {
        let factory: CharacterFlyweightFactory;
        let editor: TextEditor;

        beforeEach(() => {
            factory = new CharacterFlyweightFactory();
            editor = new TextEditor(factory);
        });

        it('should add characters correctly', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('B', basicFormatting, 30, 40);

            expect(editor.getCharacterCount()).toBe(2);

            const stats = editor.getFlyweightStats();
            expect(stats.count).toBe(2); // Two unique flyweights
        });

        it('should reuse flyweights for identical character-formatting combinations', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('A', basicFormatting, 30, 40); // Should reuse flyweight

            expect(editor.getCharacterCount()).toBe(2); // Two character contexts

            const stats = editor.getFlyweightStats();
            expect(stats.count).toBe(1); // Only one unique flyweight
            expect(stats.created).toBe(1);
            expect(stats.reused).toBe(1);
        });

        it('should find characters at specific position', () => {
            editor.addCharacter('A', basicFormatting, 10, 20);
            editor.addCharacter('B', basicFormatting, 30, 40);

            const charsAtPosition = editor.findCharactersAt(10, 20);
            expect(charsAtPosition.length).toBe(1);
            expect(charsAtPosition[0].getFlyweight().getCharacter()).toBe('A');
        });
    });

    // Test for the sample text creator function
    describe('createSampleText', () => {
        it('should create a text editor with multiple characters', () => {
            const editor = createSampleText();

            // Should have "Hello" + "World" = 10 characters
            expect(editor.getCharacterCount()).toBe(10);
        });

        it('should reuse flyweights for identical character-formatting combinations', () => {
            const editor = createSampleText();
            const stats = editor.getFlyweightStats();

            // There should be less flyweights than characters due to reuse
            expect(stats.count).toBeLessThan(editor.getCharacterCount());
            expect(stats.reused).toBeGreaterThan(0);
        });
    });
});
