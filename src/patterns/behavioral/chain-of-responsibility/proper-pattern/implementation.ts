/**
 * Chain of Responsibility Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Decouples senders from receivers
 * 2. Allows multiple handlers to process a request
 * 3. Promotes single responsibility principle
 * 4. Provides flexibility in chain configuration
 * 5. Makes it easy to add or remove handlers
 */

// Abstract handler class that defines the chain structure
export abstract class ExpenseHandler {
    private nextHandler: ExpenseHandler | null = null;
    public outputs: string[] = [];

    // Set the next handler in the chain
    public setNext(handler: ExpenseHandler): ExpenseHandler {
        this.nextHandler = handler;
        return handler;
    }

    // The template method that defines the handling algorithm
    public handleExpense(expense: Expense): boolean {
        // If this handler can process the request, do it
        if (this.canHandle(expense)) {
            this.processExpense(expense);
            return true;
        }

        // Otherwise, pass to the next handler if available
        if (this.nextHandler) {
            this.outputs.push(`Passing expense request to ${this.nextHandler.getName()}`);
            return this.nextHandler.handleExpense(expense);
        }

        // If no handler can process the request
        this.outputs.push(`No handler could approve expense of $${expense.amount}`);
        return false;
    }

    // These methods must be implemented by concrete handlers
    protected abstract canHandle(expense: Expense): boolean;
    protected abstract processExpense(expense: Expense): void;
    protected abstract getName(): string;
}

// Expense data structure
export interface Expense {
    id: number;
    amount: number;
    purpose: string;
}

// Concrete handler for team lead approval
export class TeamLeadExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 1000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        this.outputs.push(
            `Team Lead approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
        );
    }

    protected getName(): string {
        return 'Team Lead';
    }
}

// Concrete handler for manager approval
export class ManagerExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 5000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        this.outputs.push(
            `Manager approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
        );
    }

    protected getName(): string {
        return 'Manager';
    }
}

// Concrete handler for director approval
export class DirectorExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 20000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        this.outputs.push(
            `Director approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
        );
    }

    protected getName(): string {
        return 'Director';
    }
}

// Concrete handler for CEO approval
export class CEOExpenseHandler extends ExpenseHandler {
    private readonly APPROVAL_LIMIT = 100000;

    protected canHandle(expense: Expense): boolean {
        return expense.amount <= this.APPROVAL_LIMIT;
    }

    protected processExpense(expense: Expense): void {
        this.outputs.push(
            `CEO approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
        );
    }

    protected getName(): string {
        return 'CEO';
    }
}

// Concrete handler for board approval
export class BoardExpenseHandler extends ExpenseHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected canHandle(_expense: Expense): boolean {
        // Board can approve any amount
        return true;
    }

    protected processExpense(expense: Expense): void {
        this.outputs.push(
            `Board approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
        );
    }

    protected getName(): string {
        return 'Board';
    }
}
