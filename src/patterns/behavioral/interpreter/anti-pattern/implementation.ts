/**
 * Interpreter Anti-Pattern
 *
 * Problems with this implementation:
 * 1. No common interface for expressions
 * 2. Hard-coded parsing logic in each evaluator
 * 3. Difficult to add new operations or expressions
 * 4. No separation between parsing and interpreting
 * 5. Tightly coupled components with poor extensibility
 */

import { logger } from '~/utils/logger';

// Even in the anti-pattern, we can use enums for operations
// But they're not used consistently across the different evaluators
export enum MathOperator {
    ADD = '+',
    SUBTRACT = '-',
    MULTIPLY = '*',
    DIVIDE = '/',
}

export enum BooleanOperator {
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
}

export enum StringOperator {
    UPPERCASE = 'UPPERCASE',
    LOWERCASE = 'LOWERCASE',
    REVERSE = 'REVERSE',
}

export class SimpleCalculator {
    public outputs: string[] = [];

    public evaluate(expression: string): number {
        this.outputs = [];
        logger.info(`Evaluating expression: ${expression}`);
        this.outputs.push(`Evaluating expression: ${expression}`);

        // Simple parsing with no proper grammar or structure
        const tokens = expression.split(' ');

        if (tokens.length !== 3) {
            logger.error('Error: Expression must be in format "number operator number"');
            return 0;
        }

        const left = parseFloat(tokens[0]);
        const operator = tokens[1];
        const right = parseFloat(tokens[2]);

        if (isNaN(left) || isNaN(right)) {
            logger.error('Error: Invalid numbers in expression');
            return 0;
        }

        let result = 0;
        switch (operator) {
            case MathOperator.ADD:
                logger.info(`Performing addition: ${left} + ${right}`);
                result = left + right;
                break;
            case MathOperator.SUBTRACT:
                logger.info(`Performing subtraction: ${left} - ${right}`);
                result = left - right;
                break;
            case MathOperator.MULTIPLY:
                logger.info(`Performing multiplication: ${left} * ${right}`);
                result = left * right;
                break;
            case MathOperator.DIVIDE:
                if (right === 0) {
                    logger.error('Error: Division by zero');
                    return 0;
                }
                logger.info(`Performing division: ${left} / ${right}`);
                result = left / right;
                break;
            default:
                logger.error(`Error: Unknown operator ${operator}`);
                return 0;
        }

        this.outputs.push(`Result: ${result}`);
        return result;
    }
}

export class BooleanEvaluator {
    public outputs: string[] = [];

    public evaluate(expression: string): boolean {
        this.outputs = [];
        logger.info(`Evaluating boolean expression: ${expression}`);
        this.outputs.push(`Evaluating boolean expression: ${expression}`);

        // Another hard-coded parser with no proper grammar
        const tokens = expression.split(' ');

        if (tokens.length !== 3) {
            logger.error('Error: Expression must be in format "value operator value"');
            return false;
        }

        const left = tokens[0];
        const operator = tokens[1];
        const right = tokens[2];

        let result = false;
        switch (operator) {
            case BooleanOperator.AND:
                logger.info(`Performing AND operation: ${left} AND ${right}`);
                result = left === 'true' && right === 'true';
                break;
            case BooleanOperator.OR:
                logger.info(`Performing OR operation: ${left} OR ${right}`);
                result = left === 'true' || right === 'true';
                break;
            case BooleanOperator.NOT:
                if (right !== 'unused') {
                    logger.error('Error: NOT operation should be in format "value NOT unused"');
                    return false;
                }
                logger.info(`Performing NOT operation: NOT ${left}`);
                result = left !== 'true';
                break;
            default:
                logger.error(`Error: Unknown operator ${operator}`);
                return false;
        }

        this.outputs.push(`Result: ${result}`);
        return result;
    }
}

export class StringManipulator {
    public outputs: string[] = [];

    public evaluate(expression: string): string {
        this.outputs = [];
        logger.info(`Evaluating string expression: ${expression}`);
        this.outputs.push(`Evaluating string expression: ${expression}`);

        // Yet another hard-coded parser
        const tokens = expression.split(' ');

        if (tokens.length < 2) {
            logger.error('Error: Invalid expression format');
            return '';
        }

        const operation = tokens[0];
        const value = tokens.slice(1).join(' ');

        let result = '';
        switch (operation) {
            case StringOperator.UPPERCASE:
                logger.info(`Converting to uppercase: ${value}`);
                result = value.toUpperCase();
                break;
            case StringOperator.LOWERCASE:
                logger.info(`Converting to lowercase: ${value}`);
                result = value.toLowerCase();
                break;
            case StringOperator.REVERSE:
                logger.info(`Reversing string: ${value}`);
                result = value.split('').reverse().join('');
                break;
            default:
                logger.error(`Error: Unknown operation ${operation}`);
                return '';
        }

        this.outputs.push(`Result: ${result}`);
        return result;
    }
}
