/**
 * Decorator Pattern - Anti-pattern Implementation
 *
 * This implementation shows a problematic approach to adding functionality to objects,
 * where each decoration requires a new class that inherits from the base class,
 * leading to class explosion and tight coupling.
 */
import { logger } from '~/utils/logger';

// Base TextFormatter class
export class TextFormatter {
    constructor(private text: string) {}

    getText(): string {
        return this.text;
    }

    format(): string {
        return this.text;
    }

    print(): void {
        logger.info(this.format());
    }
}

// BoldTextFormatter - adds bold formatting
export class BoldTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<b>${super.format()}</b>`;
    }
}

// ItalicTextFormatter - adds italic formatting
export class ItalicTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<i>${super.format()}</i>`;
    }
}

// UnderlineTextFormatter - adds underline formatting
export class UnderlineTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<u>${super.format()}</u>`;
    }
}

// Attempting to combine these creates a class explosion
// BoldItalicTextFormatter - adds both bold and italic formatting
export class BoldItalicTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<b><i>${super.format()}</i></b>`;
    }
}

// BoldUnderlineTextFormatter - adds both bold and underline formatting
export class BoldUnderlineTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<b><u>${super.format()}</u></b>`;
    }
}

// ItalicUnderlineTextFormatter - adds both italic and underline formatting
export class ItalicUnderlineTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<i><u>${super.format()}</u></i>`;
    }
}

// BoldItalicUnderlineTextFormatter - adds all three formattings
export class BoldItalicUnderlineTextFormatter extends TextFormatter {
    constructor(text: string) {
        super(text);
    }

    format(): string {
        return `<b><i><u>${super.format()}</u></i></b>`;
    }
}

// TextFormattingManager - client code that works with these formatters
export class TextFormattingManager {
    static getBoldText(text: string): string {
        return new BoldTextFormatter(text).format();
    }

    static getItalicText(text: string): string {
        return new ItalicTextFormatter(text).format();
    }

    static getUnderlineText(text: string): string {
        return new UnderlineTextFormatter(text).format();
    }

    static getBoldItalicText(text: string): string {
        return new BoldItalicTextFormatter(text).format();
    }

    static getBoldUnderlineText(text: string): string {
        return new BoldUnderlineTextFormatter(text).format();
    }

    static getItalicUnderlineText(text: string): string {
        return new ItalicUnderlineTextFormatter(text).format();
    }

    static getBoldItalicUnderlineText(text: string): string {
        return new BoldItalicUnderlineTextFormatter(text).format();
    }

    // Method to add a custom color - demonstrates the problem of extension
    static getColoredText(text: string, color: string): string {
        // Need to create a completely new class or add a lot of conditional logic
        return `<span style="color: ${color}">${text}</span>`;
    }

    // Imagine adding even more formatting options (background, font-size, etc.)
    // Each new option would require multiple new classes for all combinations!
}

// Helper function to demonstrate usage
export function createSampleFormattedText(): {
    plainText: string;
    formattedExamples: Record<string, string>;
} {
    const text = 'Hello, Decorator Pattern!';

    const examples: Record<string, string> = {
        Bold: TextFormattingManager.getBoldText(text),
        Italic: TextFormattingManager.getItalicText(text),
        Underline: TextFormattingManager.getUnderlineText(text),
        'Bold+Italic': TextFormattingManager.getBoldItalicText(text),
        'Bold+Underline': TextFormattingManager.getBoldUnderlineText(text),
        'Italic+Underline': TextFormattingManager.getItalicUnderlineText(text),
        All: TextFormattingManager.getBoldItalicUnderlineText(text),
        Red: TextFormattingManager.getColoredText(text, 'red'),
    };

    return {
        plainText: text,
        formattedExamples: examples,
    };
}
