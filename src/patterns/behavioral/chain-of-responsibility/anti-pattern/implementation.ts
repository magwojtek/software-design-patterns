/**
 * Chain of Responsibility Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Tight coupling between client and handlers
 * 2. Hard-coded approval logic in each expense processor
 * 3. No standardized handling structure
 * 4. Difficult to modify the approval chain
 * 5. Adding new handlers requires modifying existing code
 */

// Expense data structure
export interface Expense {
    id: number;
    amount: number;
    purpose: string;
}

// Monolithic expense processor with hard-coded approval logic
export class ExpenseProcessor {
    public outputs: string[] = [];

    public processExpense(expense: Expense): boolean {
        this.outputs = [];

        // Hard-coded approval chain with tight coupling
        if (expense.amount <= 1000) {
            this.outputs.push(
                `Team Lead approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        } else if (expense.amount <= 5000) {
            this.outputs.push(
                `Manager approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        } else if (expense.amount <= 20000) {
            this.outputs.push(
                `Director approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        } else if (expense.amount <= 100000) {
            this.outputs.push(
                `CEO approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        } else {
            this.outputs.push(
                `Board approval required for expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            // Simulate board approval
            if (expense.amount <= 500000) {
                this.outputs.push(
                    `Board approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
                );
                return true;
            } else {
                this.outputs.push(
                    `Expense #${expense.id} for $${expense.amount} was rejected as too high`,
                );
                return false;
            }
        }
    }
}

// Separate classes with duplicated logic and no chain structure
export class TeamLeadApprover {
    public outputs: string[] = [];

    public approve(expense: Expense): boolean {
        this.outputs = [];
        if (expense.amount <= 1000) {
            this.outputs.push(
                `Team Lead approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        }
        this.outputs.push(`Team Lead cannot approve expense #${expense.id} for $${expense.amount}`);
        return false;
    }
}

export class ManagerApprover {
    public outputs: string[] = [];

    public approve(expense: Expense): boolean {
        this.outputs = [];
        if (expense.amount <= 5000) {
            this.outputs.push(
                `Manager approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        }
        this.outputs.push(`Manager cannot approve expense #${expense.id} for $${expense.amount}`);
        return false;
    }
}

export class DirectorApprover {
    public outputs: string[] = [];

    public approve(expense: Expense): boolean {
        this.outputs = [];
        if (expense.amount <= 20000) {
            this.outputs.push(
                `Director approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
            );
            return true;
        }
        this.outputs.push(`Director cannot approve expense #${expense.id} for $${expense.amount}`);
        return false;
    }
}

// Client code with hard-coded approval logic
export class ExpenseSystem {
    public outputs: string[] = [];
    private teamLead = new TeamLeadApprover();
    private manager = new ManagerApprover();
    private director = new DirectorApprover();

    public processExpense(expense: Expense): boolean {
        this.outputs = [];

        // Hard-coded approval chain with client managing the flow
        if (this.teamLead.approve(expense)) {
            this.outputs = this.teamLead.outputs;
            return true;
        } else if (this.manager.approve(expense)) {
            this.outputs = this.manager.outputs;
            return true;
        } else if (this.director.approve(expense)) {
            this.outputs = this.director.outputs;
            return true;
        } else {
            this.outputs.push(`No one could approve expense #${expense.id} for $${expense.amount}`);
            return false;
        }
    }
}
