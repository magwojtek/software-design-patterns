import {
    Context,
    Expression,
    NumberExpression,
    VariableExpression,
    isNumber,
    AddExpression,
    SubtractExpression,
    MultiplyExpression,
    DivideExpression,
    BooleanExpression,
    AndExpression,
    OrExpression,
    NotExpression,
    StringExpression,
    UppercaseExpression,
    LowercaseExpression,
    ReverseExpression,
    ExpressionParser,
    StringOperation,
} from './implementation';

describe('Interpreter Proper Pattern Tests', () => {
    let context: Context;

    beforeEach(() => {
        context = new Context();
    });

    test('NumberExpression interprets a number correctly', () => {
        const expression = new NumberExpression(42);
        const result = expression.interpret(context);

        expect(result).toBe(42);
        expect(context.outputs).toContain('Interpreting number: 42');
    });

    test('VariableExpression retrieves variable value from context', () => {
        context.setVariable('x', 10);
        const expression = new VariableExpression('x');
        const result = expression.interpret(context);

        expect(result).toBe(10);
        expect(context.outputs).toContain('Interpreting variable x: 10');
    });

    test('AddExpression adds two expressions', () => {
        const left = new NumberExpression(5);
        const right = new NumberExpression(3);
        const expression = new AddExpression(left, right);
        const result = expression.interpret(context);

        expect(result).toBe(8);
        expect(context.outputs).toContain('Performing addition: 5 + 3 = 8');
    });

    test('SubtractExpression subtracts two expressions', () => {
        const left = new NumberExpression(10);
        const right = new NumberExpression(4);
        const expression = new SubtractExpression(left, right);
        const result = expression.interpret(context);

        expect(result).toBe(6);
        expect(context.outputs).toContain('Performing subtraction: 10 - 4 = 6');
    });

    test('MultiplyExpression multiplies two expressions', () => {
        const left = new NumberExpression(6);
        const right = new NumberExpression(7);
        const expression = new MultiplyExpression(left, right);
        const result = expression.interpret(context);

        expect(result).toBe(42);
        expect(context.outputs).toContain('Performing multiplication: 6 * 7 = 42');
    });

    test('DivideExpression divides two expressions', () => {
        const left = new NumberExpression(20);
        const right = new NumberExpression(5);
        const expression = new DivideExpression(left, right);
        const result = expression.interpret(context);

        expect(result).toBe(4);
        expect(context.outputs).toContain('Performing division: 20 / 5 = 4');
    });

    test('DivideExpression handles division by zero', () => {
        const left = new NumberExpression(10);
        const right = new NumberExpression(0);
        const expression = new DivideExpression(left, right);
        const result = expression.interpret(context);

        expect(result).toBe(0);
        expect(context.outputs).toContain('Error: Division by zero');
    });

    test('Complex arithmetic expression is interpreted correctly', () => {
        // (5 + 3) * 2
        const addExpr = new AddExpression(new NumberExpression(5), new NumberExpression(3));
        const expression = new MultiplyExpression(addExpr, new NumberExpression(2));
        const result = expression.interpret(context);

        expect(result).toBe(16);
    });

    test('BooleanExpression interprets a boolean correctly', () => {
        const trueExpr = new BooleanExpression(true);
        const falseExpr = new BooleanExpression(false);

        expect(trueExpr.interpret(context)).toBe(true);
        expect(falseExpr.interpret(context)).toBe(false);
    });

    test('AndExpression performs logical AND correctly', () => {
        const trueExpr = new BooleanExpression(true);
        const falseExpr = new BooleanExpression(false);

        const trueAndTrue = new AndExpression(trueExpr, trueExpr);
        const trueAndFalse = new AndExpression(trueExpr, falseExpr);

        expect(trueAndTrue.interpret(context)).toBe(true);
        expect(trueAndFalse.interpret(context)).toBe(false);
        expect(context.outputs).toContain('Performing AND operation: true AND true = true');
    });

    test('OrExpression performs logical OR correctly', () => {
        const trueExpr = new BooleanExpression(true);
        const falseExpr = new BooleanExpression(false);

        const trueOrFalse = new OrExpression(trueExpr, falseExpr);
        const falseOrFalse = new OrExpression(falseExpr, falseExpr);

        expect(trueOrFalse.interpret(context)).toBe(true);
        expect(falseOrFalse.interpret(context)).toBe(false);
        expect(context.outputs).toContain('Performing OR operation: true OR false = true');
    });

    test('NotExpression performs logical NOT correctly', () => {
        const trueExpr = new BooleanExpression(true);
        const falseExpr = new BooleanExpression(false);

        const notTrue = new NotExpression(trueExpr);
        const notFalse = new NotExpression(falseExpr);

        expect(notTrue.interpret(context)).toBe(false);
        expect(notFalse.interpret(context)).toBe(true);
        expect(context.outputs).toContain('Performing NOT operation: NOT true = false');
    });

    test('StringExpression interprets a string correctly', () => {
        const expression = new StringExpression('Hello World');
        const result = expression.interpret(context);

        expect(result).toBe('Hello World');
        expect(context.outputs).toContain('Interpreting string: "Hello World"');
    });

    test('UppercaseExpression converts string to uppercase', () => {
        const stringExpr = new StringExpression('Hello World');
        const expression = new UppercaseExpression(stringExpr);
        const result = expression.interpret(context);

        expect(result).toBe('HELLO WORLD');
        expect(context.outputs).toContain(
            'Converting to uppercase: "Hello World" -> "HELLO WORLD"',
        );
    });

    test('LowercaseExpression converts string to lowercase', () => {
        const stringExpr = new StringExpression('Hello World');
        const expression = new LowercaseExpression(stringExpr);
        const result = expression.interpret(context);

        expect(result).toBe('hello world');
        expect(context.outputs).toContain(
            'Converting to lowercase: "Hello World" -> "hello world"',
        );
    });

    test('ReverseExpression reverses a string', () => {
        const stringExpr = new StringExpression('Hello');
        const expression = new ReverseExpression(stringExpr);
        const result = expression.interpret(context);

        expect(result).toBe('olleH');
        expect(context.outputs).toContain('Reversing string: "Hello" -> "olleH"');
    });

    test('ExpressionParser parses and interprets arithmetic expressions', () => {
        const parser = new ExpressionParser();

        // Simple expression
        const expr1 = parser.parseArithmetic('5 + 3');
        expect(expr1.interpret(context)).toBe(8);

        context.reset();

        // Expression with precedence
        const expr2 = parser.parseArithmetic('5 + 3 * 2');
        expect(expr2.interpret(context)).toBe(11);
    });

    test('ExpressionParser parses and interprets boolean expressions', () => {
        const parser = new ExpressionParser();

        // Simple boolean expression
        const expr1 = parser.parseBoolean('true AND false');
        expect(expr1.interpret(context)).toBe(false);

        context.reset();

        // NOT expression
        const expr2 = parser.parseBoolean('NOT false');
        expect(expr2.interpret(context)).toBe(true);
    });

    test('ExpressionParser parses and interprets string expressions', () => {
        const parser = new ExpressionParser();

        // Uppercase expression
        const expr1 = parser.parseString(`${StringOperation.UPPERCASE} hello world`);
        expect(expr1.interpret(context)).toBe('HELLO WORLD');

        context.reset();

        // Reverse expression
        const expr2 = parser.parseString(`${StringOperation.REVERSE} hello`);
        expect(expr2.interpret(context)).toBe('olleh');
    });

    test('demonstrates extending the pattern with a new expression type', () => {
        // Create a new expression type
        class PowerExpression implements Expression {
            private base: Expression;
            private exponent: Expression;

            constructor(base: Expression, exponent: Expression) {
                this.base = base;
                this.exponent = exponent;
            }

            public interpret(context: Context): number {
                const baseValue = this.base.interpret(context);
                const exponentValue = this.exponent.interpret(context);

                // Type guard to ensure we're working with numbers
                if (!isNumber(baseValue) || !isNumber(exponentValue)) {
                    context.log('Error: Power operation requires numeric values');
                    return 0;
                }

                const result = Math.pow(baseValue, exponentValue);
                context.log(
                    `Performing power operation: ${baseValue} ^ ${exponentValue} = ${result}`,
                );
                return result;
            }
        }

        // Use the new expression type
        const powerExpr = new PowerExpression(new NumberExpression(2), new NumberExpression(3));

        const result = powerExpr.interpret(context);
        expect(result).toBe(8);
        expect(context.outputs).toContain('Performing power operation: 2 ^ 3 = 8');
    });
});
