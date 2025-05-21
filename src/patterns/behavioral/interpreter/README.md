# Interpreter Pattern

## Overview

The Interpreter pattern is a behavioral design pattern that defines a grammar for interpreting expressions and provides an interpreter to evaluate them. It allows you to define a language and create an interpreter that processes sentences in that language.

## Problem

In many applications, we need to process and evaluate expressions or commands that follow specific rules:

- Domain-specific languages need to be parsed and executed
- Complex expressions need to be evaluated based on a defined grammar
- Text processing requires interpretation of commands or queries
- Configuration files with specific syntax need to be processed
- Repetitive parsing logic is duplicated across the codebase

## Diagram

```
┌───────────────────────┐
│     <<interface>>     │
│      Expression       │
├───────────────────────┤
│ + interpret(context)  │
└─────────┬─────────────┘
          │
          │ implements
          ├───────────────────────────────┐
          │                               │
┌─────────▼───────────┐         ┌─────────▼─────────────┐
│  TerminalExpression │         │ NonTerminalExpression │
├─────────────────────┤         ├───────────────────────┤
│ + interpret(context)│         │ - expressions         │
│                     │         │ + interpret(context)  │
└─────────────────────┘         └───────┬───────────────┘
                                        │
                                        │ uses
                                        ▼
                              ┌─────────────────────┐
                              │      Context        │
                              ├─────────────────────┤
                              │ - variables         │
                              │ + lookup(name)      │
                              │ + assign(name, val) │
                              └─────────────────────┘
```

## Scenario

Imagine you're building an expression evaluator that needs to parse and evaluate different types of expressions (arithmetic, boolean, and string operations).

**The problem:**
1. You need to evaluate different types of expressions (arithmetic, boolean, string operations)
2. Each expression type has its own syntax and evaluation rules
3. Expressions can be nested and combined in complex ways
4. The solution should be extensible to support new expression types
5. The code should be maintainable and avoid duplication

## Anti-Pattern: Hard-Coded Parsers

A common anti-pattern is to create separate parsers for each expression type with hard-coded logic:

```typescript
// Anti-pattern: Separate evaluators with hard-coded parsing logic
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
        // Hard-coded parsing logic
        this.outputs = [];
        this.outputs.push(`Evaluating: ${expression}`);

        const parts = expression.split(' ');
        const left = parseFloat(parts[0]);
        const operator = parts[1];
        const right = parseFloat(parts[2]);

        let result = 0;
        switch (operator) {
            case MathOperator.ADD:
                result = left + right;
                this.outputs.push(`${left} + ${right} = ${result}`);
                break;
            case MathOperator.SUBTRACT:
                result = left - right;
                this.outputs.push(`${left} - ${right} = ${result}`);
                break;
            case MathOperator.MULTIPLY:
                result = left * right;
                this.outputs.push(`${left} * ${right} = ${result}`);
                break;
            case MathOperator.DIVIDE:
                if (right === 0) {
                    this.outputs.push('Error: Division by zero');
                    return 0;
                }
                result = left / right;
                this.outputs.push(`${left} / ${right} = ${result}`);
                break;
            default:
                this.outputs.push(`Unknown operator: ${operator}`);
        }

        return result;
    }
}

export class BooleanEvaluator {
    public outputs: string[] = [];

    public evaluate(expression: string): boolean {
        // Another hard-coded parser
        this.outputs = [];
        this.outputs.push(`Evaluating: ${expression}`);

        const parts = expression.split(' ');
        let result = false;

        if (parts[1] === BooleanOperator.NOT) {
            const value = parts[2].toLowerCase() === 'true';
            result = !value;
            this.outputs.push(`NOT ${value} = ${result}`);
        } else {
            const left = parts[0].toLowerCase() === 'true';
            const operator = parts[1];
            const right = parts[2].toLowerCase() === 'true';

            switch (operator) {
                case BooleanOperator.AND:
                    result = left && right;
                    this.outputs.push(`${left} AND ${right} = ${result}`);
                    break;
                case BooleanOperator.OR:
                    result = left || right;
                    this.outputs.push(`${left} OR ${right} = ${result}`);
                    break;
                default:
                    this.outputs.push(`Unknown operator: ${operator}`);
            }
        }

        return result;
    }
}

export class StringManipulator {
    public outputs: string[] = [];

    public evaluate(expression: string): string {
        // Yet another hard-coded parser
        this.outputs = [];
        this.outputs.push(`Evaluating: ${expression}`);

        const parts = expression.split(' ');
        const operator = parts[0];
        const text = parts.slice(1).join(' ');
        let result = '';

        switch (operator) {
            case StringOperator.UPPERCASE:
                result = text.toUpperCase();
                this.outputs.push(`UPPERCASE "${text}" = "${result}"`);
                break;
            case StringOperator.LOWERCASE:
                result = text.toLowerCase();
                this.outputs.push(`LOWERCASE "${text}" = "${result}"`);
                break;
            case StringOperator.REVERSE:
                result = text.split('').reverse().join('');
                this.outputs.push(`REVERSE "${text}" = "${result}"`);
                break;
            default:
                this.outputs.push(`Unknown operator: ${operator}`);
                result = text;
        }

        return result;
    }
}
```

### Problems with the Anti-Pattern:

1. **No Common Interface**: Each evaluator has its own interface and implementation
2. **Hard-Coded Parsing**: Parsing logic is duplicated and hard-coded in each evaluator
3. **Limited Extensibility**: Adding new operations requires modifying existing code
4. **No Composition**: Cannot easily combine expressions (e.g., arithmetic + boolean)
5. **Tight Coupling**: Parsers and evaluators are tightly coupled
6. **No Separation of Concerns**: Parsing and interpretation are mixed together

## Proper Pattern Implementation

The proper implementation of the Interpreter pattern involves defining a grammar with a common interface for all expressions and composable structure.

```typescript
// Define a common interface for all expressions
export interface Expression {
    interpret(context: Context): any;
}

// Context to store variables and state during interpretation
export class Context {
    private variables: Map<string, any> = new Map();
    public outputs: string[] = [];
    
    public setVariable(name: string, value: any): void {
        this.variables.set(name, value);
    }
    
    public getVariable(name: string): any {
        return this.variables.get(name);
    }
    
    public log(message: string): void {
        this.outputs.push(message);
    }
}

// Terminal expressions (leaf nodes in the expression tree)
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

export class VariableExpression implements Expression {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    public interpret(context: Context): any {
        const value = context.getVariable(this.name);
        context.log(`Interpreting variable ${this.name}: ${value}`);
        return value;
    }
}

// Non-terminal expressions (composite nodes that contain other expressions)
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
        const result = leftValue + rightValue;
        context.log(`Performing addition: ${leftValue} + ${rightValue} = ${result}`);
        return result;
    }
}

// More expression classes for different operations...

// Parser to build the expression tree from a string
export class ExpressionParser {
    public parseArithmetic(expression: string): Expression {
        // Parse the expression string and build an expression tree
        // ...
    }
}

// Usage
const context = new Context();
context.setVariable('x', 10);

// Manually build expression tree: (5 + x) * 3
const expr = new MultiplyExpression(
    new AddExpression(
        new NumberExpression(5),
        new VariableExpression('x')
    ),
    new NumberExpression(3)
);

const result = expr.interpret(context); // Result: 45

### Benefits of Proper Pattern:

1. **Common Interface**: All expressions share the same interface
2. **Composability**: Expressions can be composed to form complex expressions
3. **Extensibility**: New expression types can be added without modifying existing code
4. **Separation of Concerns**: Parsing is separated from interpretation
5. **Maintainability**: Grammar rules are clearly defined in the class structure
6. **Reusability**: Expression objects can be reused in different contexts
7. **Follows Open/Closed Principle**: Open for extension, closed for modification

## Visual Comparison

```
┌──────────────────────────────────────────────────────────┐
│                     ANTI-PATTERN                         │
└──────────────────────────────────────────────────────────┘
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │ Calculator    │      │ BoolEvaluator │      │ StringManip   │
    │               │      │               │      │               │
    │ evaluate()    │      │ evaluate()    │      │ evaluate()    │
    └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
            │                      │                      │
            ▼                      ▼                      ▼
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │ parse tokens  │      │ parse tokens  │      │ parse tokens  │
    │ interpret     │      │ interpret     │      │ interpret     │
    │ return result │      │ return result │      │ return result │
    └───────────────┘      └───────────────┘      └───────────────┘
    Duplicated code with no shared structure or standardization

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
└──────────────────────────────────────────────────────────┘
                ┌───────────────────────────┐
                │ Expression (interface)    │
                │                           │
                │ + interpret(context)      │
                └───────────────┬───────────┘
                                │
                                │ implements
                                │
          ┌───────────────────┬─┴────────────────┐
          │                   │                  │
┌─────────┴─────────┐  ┌──────┴──────┐ ┌─────────┴─────────┐
│ TerminalExpression│  │ NonTerminal │ │     Context       │
│                   │  │ Expression  │ │                   │
│ NumberExpression  │  │ AddExpr     │ │ - variables       │
│ VariableExpression│  │ SubtractExpr│ │ + setVariable()   │
│ BooleanExpression │  │ AndExpr     │ │ + getVariable()   │
│ StringExpression  │  │ OrExpr      │ │ + log()           │
└───────────────────┘  └─────────────┘ └───────────────────┘
│  ┌───────────┐     ┌───────────┐     ┌───────────┐       │
│  │ Calculator│     │ Boolean   │     │ String    │       │
│  │ Evaluator │     │ Evaluator │     │ Evaluator │       │
│  └─────┬─────┘     └─────┬─────┘     └─────┬─────┘       │
│        │                 │                 │             │
│        │ evaluate        │ evaluate        │ evaluate    │
│        ▼                 ▼                 ▼             │
│  ┌──────────────────────────────────────────────┐        │
│  │ Hard-coded parsing and interpretation logic  │        │
│  │ Duplicated code, no common interface         │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     PROPER PATTERN                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐     │
│  │               Expression Interface              │     │
│  └───────────────────────┬─────────────────────────┘     │
│                          │                               │
│                          │ implements                    │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐     │
│  │       Terminal and Non-Terminal Expressions     │     │
│  └───────────────────────┬─────────────────────────┘     │
│                          │                               │
│                          │ uses                          │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────┐     │
│  │                    Context                      │     │
│  └─────────────────────────────────────────────────┘     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Best Practices

1. Define a clear and consistent interface for all expression classes
2. Separate the parsing logic from the interpretation logic
3. Use the Composite pattern to build complex expressions from simpler ones
4. Keep expression classes focused on a single responsibility
5. Use a Context object to store state and variables during interpretation
6. Implement type safety with appropriate type guards and return types
7. Document the grammar rules clearly
8. Consider using the Flyweight pattern for terminal expressions that are used frequently

## When to Use

- When you need to interpret a domain-specific language
- When you need to evaluate expressions or commands that follow specific grammar rules
- When you need to process structured text input
- When you need to build a parser for a simple language
- When you want to separate grammar rules from interpretation logic
- When you have a well-defined grammar with a hierarchical structure

## When to Avoid

- For complex languages with many grammar rules (use parser generators instead)
- When performance is critical (interpreters can be slower than compiled code)
- When the language grammar changes frequently
- When the language is too complex for a hand-written parser
- When you need to support a large number of operations (can lead to class explosion)
- When the expressions are simple and don't require a formal grammar
- When there are better tools available (like parser generators or existing libraries)

## Variations

### Visitor Pattern Integration

The Interpreter pattern can be combined with the Visitor pattern to add new operations without modifying the expression classes:

```typescript
// Visitor interface
interface ExpressionVisitor {
    visitNumber(expr: NumberExpression): any;
    visitVariable(expr: VariableExpression): any;
    visitAdd(expr: AddExpression): any;
    // Other visit methods...
    // More visit methods...
}

interface Expression {
    interpret(context: Context): any;
    accept(visitor: ExpressionVisitor): any;
}

class NumberExpression implements Expression {
    // ... existing code ...
    
    accept(visitor: ExpressionVisitor): any {
        return visitor.visitNumber(this);
    }
}

// Example visitor
class EvaluationVisitor implements ExpressionVisitor {
    private context: Context;
    
    constructor(context: Context) {
        this.context = context;
    }
    
    visitNumber(expr: NumberExpression): number {
        return expr.interpret(this.context);
    }
    
    // More visit methods...
}
```

### Flyweight Pattern Optimization

For grammars with many repeated terminal symbols, the Flyweight pattern can be used to share instances:

```typescript
class ExpressionFactory {
    private static numberExpressions: Map<number, NumberExpression> = new Map();
    
    public static getNumberExpression(value: number): NumberExpression {
        if (!this.numberExpressions.has(value)) {
            this.numberExpressions.set(value, new NumberExpression(value));
        }
        return this.numberExpressions.get(value)!;
    }
}
```

## Real-World Examples

1. **SQL Parsers**: Database systems use interpreters to parse and execute SQL queries
2. **Regular Expression Engines**: Interpret and match patterns against strings
3. **Formula Evaluators**: Spreadsheet applications that evaluate cell formulas
4. **Script Engines**: JavaScript engines that interpret and execute code
5. **XML/JSON Parsers**: Parse structured data formats

## Related Patterns

- **Composite Pattern**: Used to build the expression tree structure
- **Visitor Pattern**: Can be used to add operations to the expression classes
- **Factory Pattern**: Often used to create expression objects
- **Flyweight Pattern**: Can be used to share terminal expression instances

## Example in TypeScript

```typescript
// The Expression interface
interface Expression {
    interpret(context: Context): number;
}

// Context class
class Context {
    private variables: Map<string, number> = new Map<string, number>();
    
    public setVariable(name: string, value: number): void {
        this.variables.set(name, value);
    }
    
    public getVariable(name: string): number {
        return this.variables.get(name) || 0;
    }
}

// Terminal expressions
class NumberExpression implements Expression {
    private value: number;
    
    constructor(value: number) {
        this.value = value;
    }
    
    public interpret(context: Context): number {
        return this.value;
    }
}

class VariableExpression implements Expression {
    private name: string;
    
    constructor(name: string) {
        this.name = name;
    }
    
    public interpret(context: Context): number {
        return context.getVariable(this.name);
    }
}

// Non-terminal expressions
class AddExpression implements Expression {
    private left: Expression;
    private right: Expression;
    
    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }
    
    public interpret(context: Context): number {
        return this.left.interpret(context) + this.right.interpret(context);
    }
}

class SubtractExpression implements Expression {
    private left: Expression;
    private right: Expression;
    
    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }
    
    public interpret(context: Context): number {
        return this.left.interpret(context) - this.right.interpret(context);
    }
}

// Client code
function interpreterExample(): void {
    // Calculate (a + b) - c
    const context = new Context();
    context.setVariable('a', 10);
    context.setVariable('b', 5);
    context.setVariable('c', 7);
    
    const expression = new SubtractExpression(
        new AddExpression(
            new VariableExpression('a'),
            new VariableExpression('b')
        ),
        new VariableExpression('c')
    );
    
    const result = expression.interpret(context);
    console.log(`Result: ${result}`); // Output: 8
}

interpreterExample();
```

## Further Considerations

### 1. Performance vs. Flexibility

The Interpreter pattern involves a trade-off between performance and flexibility:

- **Performance**: Interpreters are generally slower than compiled code. For performance-critical applications, consider generating code or using parser generators.
- **Memory usage**: Complex expression trees can consume significant memory. Consider using the Flyweight pattern for terminal expressions.
- **Flexibility**: The pattern provides great flexibility for changing and extending the language, but at the cost of performance.

### 2. Error Handling and Validation

Proper error handling is crucial in interpreters:

- Implement robust error detection and reporting in both the parser and interpreter
- Use the Context object to track error information and provide meaningful error messages
- Consider implementing a validation phase before interpretation to catch errors early
- Add type checking to ensure operations are performed on compatible types

### 3. Parsing Strategies

There are different approaches to parsing expressions:

- **Recursive Descent Parsing**: Simple to implement but limited to certain grammar types
- **Parser Combinators**: Functional approach to building parsers from smaller parsers
- **Parser Generators**: Tools like ANTLR or Yacc for complex grammars
- **Hand-written Parsers**: Most flexible but require more effort to implement and maintain

### 4. Combining with Other Patterns

The Interpreter pattern works well with several other patterns:

- **Composite**: Forms the foundation of the expression tree structure
- **Visitor**: Allows adding new operations without modifying expression classes
- **Iterator**: Can be used to traverse the expression tree
- **Memento**: Can be used to save and restore interpreter state
- **Command**: Can encapsulate interpreted actions as commands

## Conclusion

The Interpreter pattern is a powerful tool for creating domain-specific languages and processing structured expressions. It provides a clean separation between grammar rules and interpretation logic, making it easier to extend and maintain language processing systems.

By implementing a common interface for all expressions and using the Composite pattern to build complex expressions from simpler ones, the Interpreter pattern enables you to create flexible and extensible language processors. However, it's important to consider the performance implications and complexity of the pattern, especially for large or complex grammars.

For simple languages with well-defined grammar rules, the Interpreter pattern offers an elegant solution that is both maintainable and extensible. For more complex languages, consider using parser generators or other specialized tools to handle the parsing phase while still leveraging the benefits of the Interpreter pattern for the interpretation phase.
