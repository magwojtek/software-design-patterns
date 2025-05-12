import {
    TextComponent,
    SimpleText,
    TextDecorator,
    BoldDecorator,
    ItalicDecorator,
    UnderlineDecorator,
    ColorDecorator,
    BackgroundDecorator,
    TextFormatterManager,
    createSampleFormattedText,
} from './implementation';

describe('Decorator Pattern - Proper Implementation', () => {
    const testText = 'Test Text';

    beforeEach(() => {
        jest.clearAllMocks();
        TextFormatterManager.resetLastOperationResult();
    });

    describe('Base Component', () => {
        it('should create a simple text component', () => {
            const component = new SimpleText(testText);
            expect(component.getText()).toBe(testText);
            expect(component.format()).toBe(testText);
            expect(component.toString()).toBe(testText);
        });

        it('should have a print method that does not throw errors', () => {
            const component = new SimpleText(testText);
            // Test behavior without relying on logger spy
            expect(() => component.print()).not.toThrow();
        });
    });

    describe('Individual Decorators', () => {
        it('should apply bold formatting', () => {
            const base = new SimpleText(testText);
            const decorated = new BoldDecorator(base);

            expect(decorated.format()).toBe(`<b>${testText}</b>`);
            expect(decorated.getText()).toBe(testText); // Original text unchanged
        });

        it('should apply italic formatting', () => {
            const base = new SimpleText(testText);
            const decorated = new ItalicDecorator(base);

            expect(decorated.format()).toBe(`<i>${testText}</i>`);
        });

        it('should apply underline formatting', () => {
            const base = new SimpleText(testText);
            const decorated = new UnderlineDecorator(base);

            expect(decorated.format()).toBe(`<u>${testText}</u>`);
        });

        it('should apply color formatting with custom color', () => {
            const base = new SimpleText(testText);
            const decorated = new ColorDecorator(base, 'red');

            expect(decorated.format()).toBe(`<span style="color: red">${testText}</span>`);
        });

        it('should apply background formatting with custom color', () => {
            const base = new SimpleText(testText);
            const decorated = new BackgroundDecorator(base, 'yellow');

            expect(decorated.format()).toBe(
                `<span style="background-color: yellow">${testText}</span>`,
            );
        });
    });

    describe('Combined Decorators', () => {
        it('should combine multiple decorators', () => {
            const base = new SimpleText(testText);
            const bold = new BoldDecorator(base);
            const boldItalic = new ItalicDecorator(bold);

            // Decorators are applied in reverse order of construction
            expect(boldItalic.format()).toBe(`<i><b>${testText}</b></i>`);
        });

        it('should combine all types of decorators', () => {
            const base = new SimpleText(testText);
            const bold = new BoldDecorator(base);
            const boldItalic = new ItalicDecorator(bold);
            const boldItalicUnderline = new UnderlineDecorator(boldItalic);
            const complex = new ColorDecorator(boldItalicUnderline, 'blue');

            expect(complex.format()).toBe(
                `<span style="color: blue"><u><i><b>${testText}</b></i></u></span>`,
            );
        });

        it('should build the decoration in a specific order for better HTML output', () => {
            // For proper HTML, it's often better to apply decorators in a specific order
            const base = new SimpleText(testText);
            const underline = new UnderlineDecorator(base);
            const italic = new ItalicDecorator(underline);
            const bold = new BoldDecorator(italic);
            const color = new ColorDecorator(bold, 'blue');

            // Tags will be nested in the correct order for HTML
            expect(color.format()).toBe(
                `<span style="color: blue"><b><i><u>${testText}</u></i></b></span>`,
            );
        });
    });

    describe('TextFormatterManager', () => {
        it('should format text and track the operation', () => {
            const component = new BoldDecorator(new SimpleText(testText));

            const result = TextFormatterManager.formatText(component);

            // Verify behavior by checking the result directly
            expect(result).toBe(`<b>${testText}</b>`);
            expect(TextFormatterManager.getLastOperationResult()).toBe(`<b>${testText}</b>`);
        });

        it('should create formatted text using helper methods', () => {
            const boldComponent = TextFormatterManager.createBoldText(testText);
            expect(boldComponent.format()).toBe(`<b>${testText}</b>`);

            const italicComponent = TextFormatterManager.createItalicText(testText);
            expect(italicComponent.format()).toBe(`<i>${testText}</i>`);

            const underlineComponent = TextFormatterManager.createUnderlineText(testText);
            expect(underlineComponent.format()).toBe(`<u>${testText}</u>`);

            const coloredComponent = TextFormatterManager.createColoredText(testText, 'red');
            expect(coloredComponent.format()).toBe(`<span style="color: red">${testText}</span>`);

            const boldItalicComponent = TextFormatterManager.createBoldItalicText(testText);
            expect(boldItalicComponent.format()).toBe(`<b><i>${testText}</i></b>`);
        });

        it('should add formatting to existing components using addFormatting method', () => {
            const baseComponent = new SimpleText(testText);

            let decoratedComponent = TextFormatterManager.addFormatting(baseComponent, 'bold');
            expect(decoratedComponent.format()).toBe(`<b>${testText}</b>`);

            // Apply multiple formats incrementally
            decoratedComponent = TextFormatterManager.addFormatting(decoratedComponent, 'italic');
            expect(decoratedComponent.format()).toBe(`<i><b>${testText}</b></i>`);

            decoratedComponent = TextFormatterManager.addFormatting(
                decoratedComponent,
                'color',
                'red',
            );
            expect(decoratedComponent.format()).toBe(
                `<span style="color: red"><i><b>${testText}</b></i></span>`,
            );
        });

        it('should throw an error for missing color values', () => {
            const baseComponent = new SimpleText(testText);

            expect(() => {
                TextFormatterManager.addFormatting(baseComponent, 'color');
            }).toThrow('Color value is required');

            expect(() => {
                TextFormatterManager.addFormatting(baseComponent, 'background');
            }).toThrow('Background color value is required');
        });
    });

    describe('Sample Formatted Text', () => {
        it('should create sample formatted components', () => {
            const sample = createSampleFormattedText();

            expect(sample.plainText).toBe('Hello, Decorator Pattern!');
            expect(Object.keys(sample.formattedComponents).length).toBe(12);

            // Test a few of the samples
            expect(sample.formattedComponents['Plain'].format()).toBe('Hello, Decorator Pattern!');
            expect(sample.formattedComponents['Bold'].format()).toBe(
                '<b>Hello, Decorator Pattern!</b>',
            );
            expect(sample.formattedComponents['Red'].format()).toBe(
                '<span style="color: red">Hello, Decorator Pattern!</span>',
            );
            expect(sample.formattedComponents['Complex'].format()).toBe(
                '<b><span style="color: blue"><i><u>Hello, Decorator Pattern!</u></i></span></b>',
            );
        });
    });

    describe('Extensibility Benefits', () => {
        it('should allow creating new decorators without modifying existing ones', () => {
            // Create a new custom decorator extending the base TextDecorator
            class StrikethroughDecorator extends TextDecorator {
                format(): string {
                    return `<s>${this.component.format()}</s>`;
                }
            }

            // Use it with existing decorators
            const base = new SimpleText(testText);
            const withStrikethrough = new StrikethroughDecorator(base);
            expect(withStrikethrough.format()).toBe(`<s>${testText}</s>`);

            // Combine with existing decorators
            const complex = new BoldDecorator(new StrikethroughDecorator(base));
            expect(complex.format()).toBe(`<b><s>${testText}</s></b>`);
        });

        it('should support runtime configuration of decorators', () => {
            // Create a base component
            const base = new SimpleText(testText);

            // Define a type union for our concrete decorator classes instead of
            // trying to create a generic constructor type
            type ConcreteDecorator =
                | typeof BoldDecorator
                | typeof ItalicDecorator
                | typeof UnderlineDecorator
                | typeof ColorDecorator
                | typeof BackgroundDecorator;

            // Simplified info type that works with our specific decorators
            type DecoratorInfo = {
                DecoratorClass: ConcreteDecorator;
                args?: unknown[];
            };

            const decorationsToApply: DecoratorInfo[] = [];

            // At runtime, decide which decorations to apply based on conditions
            const isBold = true;
            const isItalic = true;
            const useColor = 'red';

            if (isBold) {
                decorationsToApply.push({
                    DecoratorClass: BoldDecorator,
                });
            }
            if (isItalic) {
                decorationsToApply.push({
                    DecoratorClass: ItalicDecorator,
                });
            }
            if (useColor) {
                decorationsToApply.push({
                    DecoratorClass: ColorDecorator,
                    args: [useColor],
                });
            }

            // Apply all decorations dynamically
            let result: TextComponent = base;
            // Use type assertion to handle the constructor parameters
            decorationsToApply.forEach(({ DecoratorClass, args = [] }) => {
                // This cast is necessary because TypeScript cannot infer the proper constructor signature
                // from our union type, but we know it's correct from our implementation
                const Constructor = DecoratorClass as new (
                    component: TextComponent,
                    ...args: unknown[]
                ) => TextComponent;
                result = new Constructor(result, ...args);
            });

            // Should have all three decorations applied
            expect(result.format()).toBe(
                `<span style="color: red"><i><b>${testText}</b></i></span>`,
            );
        });
    });
});
