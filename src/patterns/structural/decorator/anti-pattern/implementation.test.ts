import {
    TextFormatter,
    BoldTextFormatter,
    ItalicTextFormatter,
    UnderlineTextFormatter,
    BoldItalicTextFormatter,
    BoldUnderlineTextFormatter,
    ItalicUnderlineTextFormatter,
    BoldItalicUnderlineTextFormatter,
    TextFormattingManager,
    createSampleFormattedText,
} from './implementation';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Spy on logger to check formatting output
setupLoggerMock();

describe('Decorator Pattern - Anti-pattern Implementation', () => {
    const testText = 'Test Text';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Individual Formatters', () => {
        it('should create a plain text formatter', () => {
            const formatter = new TextFormatter(testText);
            expect(formatter.getText()).toBe(testText);
            expect(formatter.format()).toBe(testText);
        });

        it('should create a bold text formatter', () => {
            const formatter = new BoldTextFormatter(testText);
            expect(formatter.format()).toBe(`<b>${testText}</b>`);
        });

        it('should create an italic text formatter', () => {
            const formatter = new ItalicTextFormatter(testText);
            expect(formatter.format()).toBe(`<i>${testText}</i>`);
        });

        it('should create an underline text formatter', () => {
            const formatter = new UnderlineTextFormatter(testText);
            expect(formatter.format()).toBe(`<u>${testText}</u>`);
        });
    });

    describe('Combined Formatters', () => {
        it('should create a bold italic formatter', () => {
            const formatter = new BoldItalicTextFormatter(testText);
            expect(formatter.format()).toBe(`<b><i>${testText}</i></b>`);
        });

        it('should create a bold underline formatter', () => {
            const formatter = new BoldUnderlineTextFormatter(testText);
            expect(formatter.format()).toBe(`<b><u>${testText}</u></b>`);
        });

        it('should create an italic underline formatter', () => {
            const formatter = new ItalicUnderlineTextFormatter(testText);
            expect(formatter.format()).toBe(`<i><u>${testText}</u></i>`);
        });

        it('should create a bold italic underline formatter', () => {
            const formatter = new BoldItalicUnderlineTextFormatter(testText);
            expect(formatter.format()).toBe(`<b><i><u>${testText}</u></i></b>`);
        });
    });

    describe('Formatter Manager', () => {
        it('should format text as bold using the manager', () => {
            const result = TextFormattingManager.getBoldText(testText);
            expect(result).toBe(`<b>${testText}</b>`);
        });

        it('should format text as italic using the manager', () => {
            const result = TextFormattingManager.getItalicText(testText);
            expect(result).toBe(`<i>${testText}</i>`);
        });

        it('should format text as underline using the manager', () => {
            const result = TextFormattingManager.getUnderlineText(testText);
            expect(result).toBe(`<u>${testText}</u>`);
        });

        it('should format text with combined styles using the manager', () => {
            const boldItalic = TextFormattingManager.getBoldItalicText(testText);
            expect(boldItalic).toBe(`<b><i>${testText}</i></b>`);

            const boldUnderline = TextFormattingManager.getBoldUnderlineText(testText);
            expect(boldUnderline).toBe(`<b><u>${testText}</u></b>`);

            const italicUnderline = TextFormattingManager.getItalicUnderlineText(testText);
            expect(italicUnderline).toBe(`<i><u>${testText}</u></i>`);

            const all = TextFormattingManager.getBoldItalicUnderlineText(testText);
            expect(all).toBe(`<b><i><u>${testText}</u></i></b>`);
        });

        it('should apply color formatting separately', () => {
            const result = TextFormattingManager.getColoredText(testText, 'red');
            expect(result).toBe(`<span style="color: red">${testText}</span>`);
        });

        // This test demonstrates the limitation of the anti-pattern approach
        it('shows the limitation of combining color with other formats', () => {
            // There's no built-in way to combine color with other formats
            // You'd need to manually combine them or create even more classes

            // One workaround would be:
            const boldText = TextFormattingManager.getBoldText(testText);
            const coloredBoldText = TextFormattingManager.getColoredText(boldText, 'blue');

            // But this produces invalid HTML with nested tags in the wrong order
            expect(coloredBoldText).toBe(`<span style="color: blue"><b>${testText}</b></span>`);
        });
    });

    describe('Sample Formatted Text', () => {
        it('should create sample formatted text examples', () => {
            const sample = createSampleFormattedText();

            expect(sample.plainText).toBe('Hello, Decorator Pattern!');
            expect(Object.keys(sample.formattedExamples).length).toBe(8);
            expect(sample.formattedExamples['Bold']).toBe('<b>Hello, Decorator Pattern!</b>');
            expect(sample.formattedExamples['All']).toBe(
                '<b><i><u>Hello, Decorator Pattern!</u></i></b>',
            );
            expect(sample.formattedExamples['Red']).toBe(
                '<span style="color: red">Hello, Decorator Pattern!</span>',
            );
        });
    });

    describe('Extensibility Problems', () => {
        it('demonstrates the class explosion problem', () => {
            // Just demonstrating - with 3 formats, we needed 7 classes:
            // Bold, Italic, Underline, BoldItalic, BoldUnderline, ItalicUnderline, BoldItalicUnderline

            // If we wanted to add just one more format (e.g., strikethrough), we would need 8 more classes:
            // Strikethrough, BoldStrikethrough, ItalicStrikethrough, UnderlineStrikethrough,
            // BoldItalicStrikethrough, BoldUnderlineStrikethrough, ItalicUnderlineStrikethrough,
            // BoldItalicUnderlineStrikethrough

            // This test just verifies the existing classes to demonstrate the issue
            expect(new BoldTextFormatter(testText)).toBeInstanceOf(TextFormatter);
            expect(new BoldItalicTextFormatter(testText)).toBeInstanceOf(TextFormatter);
            expect(new BoldItalicUnderlineTextFormatter(testText)).toBeInstanceOf(TextFormatter);
        });
    });
});
