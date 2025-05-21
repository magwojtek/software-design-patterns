/**
 * Interpreter Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Defines a grammar for interpreting expressions
 * 2. Provides a common interface for all expression types
 * 3. Makes it easy to add new operations or expressions
 * 4. Separates parsing from interpretation
 * 5. Follows the Composite pattern for complex expressions
 */

import { logger } from '~/utils/logger';

// Enum for string operations
export enum StringOperation {
    UPPERCASE = 'UPPERCASE',
    LOWERCASE = 'LOWERCASE',
    REVERSE = 'REVERSE',
}

// Define the possible return types for expressions
export type ExpressionValue = number | string | boolean;

// Type guard functions
export function isNumber(value: ExpressionValue | undefined): value is number {
    return typeof value === 'number';
}

export function isString(value: ExpressionValue | undefined): value is string {
    return typeof value === 'string';
}

export function isBoolean(value: ExpressionValue | undefined): value is boolean {
    return typeof value === 'boolean';
}

// Abstract Expression interface
export interface Expression {
    interpret(context: Context): ExpressionValue;
}

// Context to store variables and other interpretation data
export class Context {
    private variables: Map<string, ExpressionValue> = new Map();
    public outputs: string[] = [];

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.variables.clear();
        this.outputs = [];
    }

    public setVariable(name: string, value: ExpressionValue): void {
        this.variables.set(name, value);
    }

    public getVariable(name: string): ExpressionValue | undefined {
        return this.variables.get(name);
    }

    public log(message: string): void {
        logger.info(message);
        this.outputs.push(message);
    }
}

// Terminal Expression for numbers
export class NumberExpression implements Expression {
    private value: number;

    constructor(value: number) {
        this.value = value;
    }

    public interpret(context: Context): number {
        context.log(`Interpreting number: ${this.value}`);
        return this.value;
    }
}

// Terminal Expression for variables
export class VariableExpression implements Expression {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public interpret(context: Context): ExpressionValue {
        const value = context.getVariable(this.name);
        context.log(`Interpreting variable ${this.name}: ${value}`);
        // Provide a default value if undefined
        return value !== undefined ? value : '';
    }
}

// Non-terminal Expression for addition
export class AddExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): number {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with numbers
        if (!isNumber(leftValue) || !isNumber(rightValue)) {
            context.log('Error: Addition requires numeric values');
            return 0;
        }

        const result = leftValue + rightValue;
        context.log(`Performing addition: ${leftValue} + ${rightValue} = ${result}`);
        return result;
    }
}

// Non-terminal Expression for subtraction
export class SubtractExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): number {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with numbers
        if (!isNumber(leftValue) || !isNumber(rightValue)) {
            context.log('Error: Subtraction requires numeric values');
            return 0;
        }

        const result = leftValue - rightValue;
        context.log(`Performing subtraction: ${leftValue} - ${rightValue} = ${result}`);
        return result;
    }
}

// Non-terminal Expression for multiplication
export class MultiplyExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): number {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with numbers
        if (!isNumber(leftValue) || !isNumber(rightValue)) {
            context.log('Error: Multiplication requires numeric values');
            return 0;
        }

        const result = leftValue * rightValue;
        context.log(`Performing multiplication: ${leftValue} * ${rightValue} = ${result}`);
        return result;
    }
}

// Non-terminal Expression for division
export class DivideExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): number {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with numbers
        if (!isNumber(leftValue) || !isNumber(rightValue)) {
            context.log('Error: Division requires numeric values');
            return 0;
        }

        if (rightValue === 0) {
            context.log('Error: Division by zero');
            return 0;
        }

        const result = leftValue / rightValue;
        context.log(`Performing division: ${leftValue} / ${rightValue} = ${result}`);
        return result;
    }
}

// Boolean expressions
export class BooleanExpression implements Expression {
    private value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    public interpret(context: Context): boolean {
        context.log(`Interpreting boolean: ${this.value}`);
        return this.value;
    }
}

export class AndExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): boolean {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with booleans
        if (!isBoolean(leftValue) || !isBoolean(rightValue)) {
            context.log('Error: AND operation requires boolean values');
            return false;
        }

        const result = leftValue && rightValue;
        context.log(`Performing AND operation: ${leftValue} AND ${rightValue} = ${result}`);
        return result;
    }
}

export class OrExpression implements Expression {
    private left: Expression;
    private right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    public interpret(context: Context): boolean {
        const leftValue = this.left.interpret(context);
        const rightValue = this.right.interpret(context);

        // Type guard to ensure we're working with booleans
        if (!isBoolean(leftValue) || !isBoolean(rightValue)) {
            context.log('Error: OR operation requires boolean values');
            return false;
        }

        const result = leftValue || rightValue;
        context.log(`Performing OR operation: ${leftValue} OR ${rightValue} = ${result}`);
        return result;
    }
}

export class NotExpression implements Expression {
    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    public interpret(context: Context): boolean {
        const value = this.expression.interpret(context);
        const result = !value;
        context.log(`Performing NOT operation: NOT ${value} = ${result}`);
        return result;
    }
}

// String expressions
export class StringExpression implements Expression {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public interpret(context: Context): string {
        context.log(`Interpreting string: "${this.value}"`);
        return this.value;
    }
}

export class UppercaseExpression implements Expression {
    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    public interpret(context: Context): string {
        const value = this.expression.interpret(context);

        // Type guard to ensure we're working with strings
        if (!isString(value)) {
            context.log('Error: Uppercase operation requires string value');
            return '';
        }

        const result = value.toUpperCase();
        context.log(`Converting to uppercase: "${value}" -> "${result}"`);
        return result;
    }
}

export class LowercaseExpression implements Expression {
    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    public interpret(context: Context): string {
        const value = this.expression.interpret(context);

        // Type guard to ensure we're working with strings
        if (!isString(value)) {
            context.log('Error: Lowercase operation requires string value');
            return '';
        }

        const result = value.toLowerCase();
        context.log(`Converting to lowercase: "${value}" -> "${result}"`);
        return result;
    }
}

export class ReverseExpression implements Expression {
    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    public interpret(context: Context): string {
        const value = this.expression.interpret(context);

        // Type guard to ensure we're working with strings
        if (!isString(value)) {
            context.log('Error: Reverse operation requires string value');
            return '';
        }

        const result = value.split('').reverse().join('');
        context.log(`Reversing string: "${value}" -> "${result}"`);
        return result;
    }
}

// Parser to build the expression tree
export class ExpressionParser {
    // Parse a simple arithmetic expression like "3 + 4 * 2"
    public parseArithmetic(expression: string): Expression {
        logger.info(`Parsing arithmetic expression: ${expression}`);

        // This is a simplified parser for demonstration
        // In a real implementation, you would use a proper parsing algorithm

        // For this example, we'll handle only simple expressions like "5 + 3 * 2"
        const tokens = expression.split(' ');

        if (tokens.length === 1) {
            return new NumberExpression(parseFloat(tokens[0]));
        }

        if (tokens.length === 3) {
            const left = new NumberExpression(parseFloat(tokens[0]));
            const right = new NumberExpression(parseFloat(tokens[2]));

            switch (tokens[1]) {
                case '+':
                    return new AddExpression(left, right);
                case '-':
                    return new SubtractExpression(left, right);
                case '*':
                    return new MultiplyExpression(left, right);
                case '/':
                    return new DivideExpression(left, right);
                default:
                    throw new Error(`Unknown operator: ${tokens[1]}`);
            }
        }

        // Handle expressions with precedence
        if (tokens.length === 5) {
            // Example: "5 + 3 * 2"
            const firstNum = parseFloat(tokens[0]);
            const secondNum = parseFloat(tokens[2]);
            const thirdNum = parseFloat(tokens[4]);

            if (tokens[1] === '+' && tokens[3] === '*') {
                // Apply multiplication first
                const multiplyExpr = new MultiplyExpression(
                    new NumberExpression(secondNum),
                    new NumberExpression(thirdNum),
                );
                return new AddExpression(new NumberExpression(firstNum), multiplyExpr);
            }

            if (tokens[1] === '*' && tokens[3] === '+') {
                // Apply multiplication first
                const multiplyExpr = new MultiplyExpression(
                    new NumberExpression(firstNum),
                    new NumberExpression(secondNum),
                );
                return new AddExpression(multiplyExpr, new NumberExpression(thirdNum));
            }
        }

        throw new Error(`Unsupported expression format: ${expression}`);
    }

    // Parse a boolean expression like "true AND false"
    public parseBoolean(expression: string): Expression {
        logger.info(`Parsing boolean expression: ${expression}`);

        const tokens = expression.split(' ');

        if (tokens.length === 1) {
            return new BooleanExpression(tokens[0] === 'true');
        }

        if (tokens.length === 2 && tokens[0] === 'NOT') {
            return new NotExpression(new BooleanExpression(tokens[1] === 'true'));
        }

        if (tokens.length === 3) {
            const left = new BooleanExpression(tokens[0] === 'true');
            const right = new BooleanExpression(tokens[2] === 'true');

            switch (tokens[1]) {
                case 'AND':
                    return new AndExpression(left, right);
                case 'OR':
                    return new OrExpression(left, right);
                default:
                    throw new Error(`Unknown operator: ${tokens[1]}`);
            }
        }

        throw new Error(`Unsupported expression format: ${expression}`);
    }

    // Parse a string expression like "UPPERCASE Hello World"
    public parseString(expression: string): Expression {
        logger.info(`Parsing string expression: ${expression}`);

        const tokens = expression.split(' ');

        if (tokens.length < 2) {
            throw new Error('Invalid string expression format');
        }

        const operation = tokens[0];
        const value = tokens.slice(1).join(' ');
        const stringExpr = new StringExpression(value);

        switch (operation) {
            case StringOperation.UPPERCASE:
                return new UppercaseExpression(stringExpr);
            case StringOperation.LOWERCASE:
                return new LowercaseExpression(stringExpr);
            case StringOperation.REVERSE:
                return new ReverseExpression(stringExpr);
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }
}
