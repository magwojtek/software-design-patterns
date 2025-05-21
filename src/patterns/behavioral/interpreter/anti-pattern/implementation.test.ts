import {
    SimpleCalculator,
    BooleanEvaluator,
    StringManipulator,
    MathOperator,
    BooleanOperator,
    StringOperator,
} from './implementation';

describe('Interpreter Anti-Pattern Tests', () => {
    let calculator: SimpleCalculator;
    let booleanEvaluator: BooleanEvaluator;
    let stringManipulator: StringManipulator;

    beforeEach(() => {
        calculator = new SimpleCalculator();
        booleanEvaluator = new BooleanEvaluator();
        stringManipulator = new StringManipulator();
    });

    describe('SimpleCalculator', () => {
        test('evaluates addition correctly', () => {
            const result = calculator.evaluate(`5 ${MathOperator.ADD} 3`);
            expect(result).toBe(8);
        });

        test('evaluates subtraction correctly', () => {
            const result = calculator.evaluate(`10 ${MathOperator.SUBTRACT} 4`);
            expect(result).toBe(6);
        });

        test('evaluates multiplication correctly', () => {
            const result = calculator.evaluate(`6 ${MathOperator.MULTIPLY} 7`);
            expect(result).toBe(42);
        });

        test('evaluates division correctly', () => {
            const result = calculator.evaluate(`20 ${MathOperator.DIVIDE} 5`);
            expect(result).toBe(4);
        });

        test('handles division by zero', () => {
            const result = calculator.evaluate(`10 ${MathOperator.DIVIDE} 0`);
            expect(result).toBe(0);
        });

        test('handles invalid expression format', () => {
            const result = calculator.evaluate('5 + 3 + 2');
            expect(result).toBe(0);
        });

        test('handles invalid numbers', () => {
            const result = calculator.evaluate('abc + 3');
            expect(result).toBe(0);
        });

        test('handles unknown operators', () => {
            const result = calculator.evaluate('5 ? 3');
            expect(result).toBe(0);
        });
    });

    describe('BooleanEvaluator', () => {
        test('evaluates AND operation correctly', () => {
            expect(booleanEvaluator.evaluate(`true ${BooleanOperator.AND} true`)).toBe(true);
            expect(booleanEvaluator.evaluate(`true ${BooleanOperator.AND} false`)).toBe(false);
            expect(booleanEvaluator.evaluate(`false ${BooleanOperator.AND} true`)).toBe(false);
            expect(booleanEvaluator.evaluate(`false ${BooleanOperator.AND} false`)).toBe(false);
        });

        test('evaluates OR operation correctly', () => {
            expect(booleanEvaluator.evaluate(`true ${BooleanOperator.OR} true`)).toBe(true);
            expect(booleanEvaluator.evaluate(`true ${BooleanOperator.OR} false`)).toBe(true);
            expect(booleanEvaluator.evaluate(`false ${BooleanOperator.OR} true`)).toBe(true);
            expect(booleanEvaluator.evaluate(`false ${BooleanOperator.OR} false`)).toBe(false);
        });

        test('evaluates NOT operation correctly', () => {
            expect(booleanEvaluator.evaluate(`true ${BooleanOperator.NOT} unused`)).toBe(false);
            expect(booleanEvaluator.evaluate(`false ${BooleanOperator.NOT} unused`)).toBe(true);
        });

        test('handles invalid NOT operation format', () => {
            const result = booleanEvaluator.evaluate(`true ${BooleanOperator.NOT} something`);
            expect(result).toBe(false);
        });

        test('handles invalid expression format', () => {
            const result = booleanEvaluator.evaluate('true AND false OR true');
            expect(result).toBe(false);
        });

        test('handles unknown operators', () => {
            const result = booleanEvaluator.evaluate('true XOR false');
            expect(result).toBe(false);
        });
    });

    describe('StringManipulator', () => {
        test('converts string to uppercase', () => {
            const result = stringManipulator.evaluate(`${StringOperator.UPPERCASE} hello world`);
            expect(result).toBe('HELLO WORLD');
        });

        test('converts string to lowercase', () => {
            const result = stringManipulator.evaluate(`${StringOperator.LOWERCASE} HELLO WORLD`);
            expect(result).toBe('hello world');
        });

        test('reverses a string', () => {
            const result = stringManipulator.evaluate(`${StringOperator.REVERSE} hello`);
            expect(result).toBe('olleh');
        });

        test('handles invalid expression format', () => {
            const result = stringManipulator.evaluate('UPPERCASE');
            expect(result).toBe('');
        });

        test('handles unknown operations', () => {
            const result = stringManipulator.evaluate('CAPITALIZE hello');
            expect(result).toBe('');
        });
    });

    describe('Anti-pattern issues demonstration', () => {
        test('demonstrates code duplication across evaluators', () => {
            // Each evaluator has its own parsing logic
            calculator.evaluate(`5 ${MathOperator.ADD} 3`);
            booleanEvaluator.evaluate(`true ${BooleanOperator.AND} false`);
            stringManipulator.evaluate(`${StringOperator.UPPERCASE} hello`);

            // No common interface or shared code
            expect(typeof calculator.evaluate).toBe('function');
            expect(typeof booleanEvaluator.evaluate).toBe('function');
            expect(typeof stringManipulator.evaluate).toBe('function');
        });

        test('demonstrates difficulty in adding new operations', () => {
            // To add a new operation like "power", we would need to modify the SimpleCalculator class
            // There's no way to add operations without modifying existing code

            // This test is conceptual and demonstrates the limitation of the anti-pattern
            expect(() => {
                // This would require modifying the SimpleCalculator class
                calculator.evaluate('2 ^ 3');
            }).not.toThrow();
        });

        test('demonstrates lack of composability', () => {
            // Cannot create complex expressions like (5 + 3) * 2
            // Each evaluator can only handle simple expressions

            // This test is conceptual and demonstrates the limitation of the anti-pattern
            expect(() => {
                // This would require a more sophisticated parser
                calculator.evaluate('(5 + 3) * 2');
            }).not.toThrow();
        });
    });
});
