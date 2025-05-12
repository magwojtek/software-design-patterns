/**
 * Decorator Pattern - Proper Implementation
 *
 * This implementation demonstrates the Decorator pattern, where functionality
 * is added to an object dynamically through composition rather than inheritance.
 * It allows combining behaviors without class explosion.
 */
import { logger, LogColor } from '~/utils/logger';

// ==========================================
// CORE IMPLEMENTATION - Component interfaces
// ==========================================

// Component interface - defines operations that can be altered by decorators
export interface TextComponent {
    getText(): string;
    format(): string;
    print(): void;
    toString(): string; // For testing
}

// Concrete Component - implements the base behavior
export class SimpleText implements TextComponent {
    constructor(private text: string) {}

    getText(): string {
        return this.text;
    }

    format(): string {
        return this.text;
    }

    print(): void {
        const formatted = this.format();
        logger.log(formatted, LogColor.INFO);
    }

    toString(): string {
        return this.format();
    }
}

// Base Decorator - maintains a reference to a TextComponent object and implements the interface
export abstract class TextDecorator implements TextComponent {
    protected component: TextComponent;

    constructor(component: TextComponent) {
        this.component = component;
    }

    // Delegates to the wrapped component
    getText(): string {
        return this.component.getText();
    }

    // The format operation can be overridden by concrete decorators
    format(): string {
        return this.component.format();
    }

    print(): void {
        const formatted = this.format();
        logger.log(formatted, LogColor.INFO);
    }

    toString(): string {
        return this.format();
    }
}

// ==========================================
// CONCRETE DECORATORS - Individual decorators
// ==========================================

// Concrete Decorator - adds bold formatting
export class BoldDecorator extends TextDecorator {
    format(): string {
        return `<b>${this.component.format()}</b>`;
    }
}

// Concrete Decorator - adds italic formatting
export class ItalicDecorator extends TextDecorator {
    format(): string {
        return `<i>${this.component.format()}</i>`;
    }
}

// Concrete Decorator - adds underline formatting
export class UnderlineDecorator extends TextDecorator {
    format(): string {
        return `<u>${this.component.format()}</u>`;
    }
}

// Concrete Decorator - adds color formatting
export class ColorDecorator extends TextDecorator {
    constructor(
        component: TextComponent,
        private color: string,
    ) {
        super(component);
    }

    format(): string {
        return `<span style="color: ${this.color}">${this.component.format()}</span>`;
    }
}

// Concrete Decorator - adds background color
export class BackgroundDecorator extends TextDecorator {
    constructor(
        component: TextComponent,
        private bgColor: string,
    ) {
        super(component);
    }

    format(): string {
        return `<span style="background-color: ${this.bgColor}">${this.component.format()}</span>`;
    }
}

// ==========================================
// UTILITY CLASS - Client interface
// ==========================================

// Client code that works with decorated objects
export class TextFormatterManager {
    private static lastOperationResult: string | null = null;

    // Method to get the last operation result for testing
    static getLastOperationResult(): string | null {
        return this.lastOperationResult;
    }

    // Method to reset the last operation result
    static resetLastOperationResult(): void {
        this.lastOperationResult = null;
    }

    static formatText(component: TextComponent): string {
        const result = component.format();
        logger.success(`Formatted text: ${result}`);
        this.lastOperationResult = result;
        return result;
    }

    // Helper methods to create decorated text
    static createBoldText(text: string): TextComponent {
        return new BoldDecorator(new SimpleText(text));
    }

    static createItalicText(text: string): TextComponent {
        return new ItalicDecorator(new SimpleText(text));
    }

    static createUnderlineText(text: string): TextComponent {
        return new UnderlineDecorator(new SimpleText(text));
    }

    static createColoredText(text: string, color: string): TextComponent {
        return new ColorDecorator(new SimpleText(text), color);
    }

    // Helper methods for common combinations
    static createBoldItalicText(text: string): TextComponent {
        return new BoldDecorator(new ItalicDecorator(new SimpleText(text)));
    }

    // Extension - easily add new formatting options without modifying existing code
    static addFormatting(component: TextComponent, format: string, value?: string): TextComponent {
        switch (format) {
            case 'bold':
                return new BoldDecorator(component);
            case 'italic':
                return new ItalicDecorator(component);
            case 'underline':
                return new UnderlineDecorator(component);
            case 'color':
                if (!value) throw new Error('Color value is required');
                return new ColorDecorator(component, value);
            case 'background':
                if (!value) throw new Error('Background color value is required');
                return new BackgroundDecorator(component, value);
            default:
                throw new Error(`Unknown format: ${format}`);
        }
    }
}

// ==========================================
// DEMONSTRATION FUNCTIONS
// ==========================================

/**
 * Creates sample formatted text to demonstrate the proper pattern
 */
export function createSampleFormattedText(): {
    plainText: string;
    formattedComponents: Record<string, TextComponent>;
} {
    const text = 'Hello, Decorator Pattern!';
    const simpleText = new SimpleText(text);

    // Create various decorated components
    const components: Record<string, TextComponent> = {
        Plain: simpleText,
        Bold: new BoldDecorator(new SimpleText(text)),
        Italic: new ItalicDecorator(new SimpleText(text)),
        Underline: new UnderlineDecorator(new SimpleText(text)),
        'Bold+Italic': new BoldDecorator(new ItalicDecorator(new SimpleText(text))),
        'Bold+Underline': new BoldDecorator(new UnderlineDecorator(new SimpleText(text))),
        'Italic+Underline': new ItalicDecorator(new UnderlineDecorator(new SimpleText(text))),
        All: new BoldDecorator(new ItalicDecorator(new UnderlineDecorator(new SimpleText(text)))),
        Red: new ColorDecorator(new SimpleText(text), 'red'),
        'Bold+Red': new BoldDecorator(new ColorDecorator(new SimpleText(text), 'red')),
        'Red+Background': new ColorDecorator(
            new BackgroundDecorator(new SimpleText(text), 'yellow'),
            'red',
        ),
        Complex: new BoldDecorator(
            new ColorDecorator(
                new ItalicDecorator(new UnderlineDecorator(new SimpleText(text))),
                'blue',
            ),
        ),
    };

    return {
        plainText: text,
        formattedComponents: components,
    };
}
