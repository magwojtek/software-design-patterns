/**
 * Interpreter Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Interpreter pattern.
 */
import {
    SimpleCalculator,
    BooleanEvaluator,
    StringManipulator,
    MathOperator,
    BooleanOperator,
    StringOperator,
} from './anti-pattern/implementation';
import {
    Context,
    Expression,
    NumberExpression,
    AddExpression,
    SubtractExpression,
    MultiplyExpression,
    BooleanExpression,
    AndExpression,
    OrExpression,
    NotExpression,
    StringExpression,
    UppercaseExpression,
    ExpressionParser,
    StringOperation,
} from './proper-pattern/implementation';
import { logger } from '~/utils/logger';

logger.info('=== Interpreter Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the Interpreter pattern
 * with hard-coded parsing and no common interface.
 */
function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating different evaluators:');

    const calculator = new SimpleCalculator();
    const booleanEvaluator = new BooleanEvaluator();
    const stringManipulator = new StringManipulator();

    logger.info('\nEvaluating arithmetic expression:');
    calculator.evaluate(`5 ${MathOperator.ADD} 3`);

    logger.info('\nEvaluating another arithmetic expression:');
    calculator.evaluate(`10 ${MathOperator.MULTIPLY} 2`);

    logger.info('\nEvaluating boolean expression:');
    booleanEvaluator.evaluate(`true ${BooleanOperator.AND} false`);

    logger.info('\nEvaluating string expression:');
    stringManipulator.evaluate(`${StringOperator.UPPERCASE} hello world`);

    logger.error('\nProblems:');
    logger.error('1. No common interface for expressions');
    logger.error('2. Hard-coded parsing logic in each evaluator');
    logger.error('3. Difficult to add new operations or expressions');
    logger.error('4. No separation between parsing and interpreting');
    logger.error('5. Tightly coupled components with poor extensibility\n');
}

/**
 * Demonstrates the proper implementation of the Interpreter pattern
 * with a common interface and composable expressions.
 */
function demonstrateProperPattern(): void {
    logger.success('--- Proper Pattern Example ---');
    logger.info('Creating a context and expressions:');

    const context = new Context();

    logger.info('\nEvaluating arithmetic expressions:');

    // Manually building expression tree: 5 + 3
    const addExpr = new AddExpression(new NumberExpression(5), new NumberExpression(3));
    logger.info(`Result of 5 + 3: ${addExpr.interpret(context)}`);

    context.reset();

    // Manually building expression tree: (10 - 2) * 3
    const complexExpr = new MultiplyExpression(
        new SubtractExpression(new NumberExpression(10), new NumberExpression(2)),
        new NumberExpression(3),
    );
    logger.info(`\nResult of (10 - 2) * 3: ${complexExpr.interpret(context)}`);

    context.reset();

    logger.info('\nEvaluating boolean expressions:');

    // Manually building boolean expression: (true AND false) OR NOT false
    const boolExpr = new OrExpression(
        new AndExpression(new BooleanExpression(true), new BooleanExpression(false)),
        new NotExpression(new BooleanExpression(false)),
    );
    logger.info(`Result of (true AND false) OR NOT false: ${boolExpr.interpret(context)}`);

    context.reset();

    logger.info('\nEvaluating string expressions:');

    // Manually building string expression: UPPERCASE "hello"
    const stringExpr = new UppercaseExpression(new StringExpression('hello'));
    logger.info(`Result of UPPERCASE "hello": ${stringExpr.interpret(context)}`);

    context.reset();

    logger.info('\nUsing the ExpressionParser:');
    const parser = new ExpressionParser();

    // Parse and interpret arithmetic expression
    const parsedArithmeticExpr = parser.parseArithmetic('7 * 3');
    logger.info(`Result of 7 * 3: ${parsedArithmeticExpr.interpret(context)}`);

    context.reset();

    // Parse and interpret boolean expression
    const parsedBooleanExpr = parser.parseBoolean('true OR false');
    logger.info(`\nResult of true OR false: ${parsedBooleanExpr.interpret(context)}`);

    context.reset();

    // Parse and interpret string expression
    const parsedStringExpr = parser.parseString(`${StringOperation.REVERSE} Hello`);
    logger.info(`\nResult of REVERSE Hello: ${parsedStringExpr.interpret(context)}`);

    logger.info('\nExtending with a custom expression:');

    // Define a new expression type
    class RepeatExpression implements Expression {
        private expression: Expression;
        private times: number;

        constructor(expression: Expression, times: number) {
            this.expression = expression;
            this.times = times;
        }

        public interpret(context: Context): string {
            const value = this.expression.interpret(context);

            // Add type guard to ensure we're working with strings
            if (typeof value !== 'string') {
                context.log('Error: Repeat operation requires string value');
                return '';
            }

            const result = value.repeat(this.times);
            context.log(`Repeating "${value}" ${this.times} times: "${result}"`);
            return result;
        }
    }

    // Use the new expression type
    context.reset();
    const repeatExpr = new RepeatExpression(new StringExpression('Ha'), 3);
    logger.info(`Result of repeating "Ha" 3 times: ${repeatExpr.interpret(context)}`);

    logger.success('\nBenefits:');
    logger.success('1. Common interface for all expression types');
    logger.success('2. Easy to add new operations by creating new expression classes');
    logger.success('3. Expressions can be composed to form complex expressions');
    logger.success('4. Separation between parsing and interpretation');
    logger.success('5. Follows the Composite pattern for complex expressions');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of Interpreter Pattern Example ===');
