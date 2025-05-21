import {
    ExpenseProcessor,
    TeamLeadApprover,
    ManagerApprover,
    DirectorApprover,
    ExpenseSystem,
    Expense,
} from './implementation';

describe('Chain of Responsibility Anti-Pattern Tests', () => {
    test('ExpenseProcessor approves expenses based on amount', () => {
        const processor = new ExpenseProcessor();

        // Test team lead approval
        const smallExpense: Expense = { id: 1, amount: 800, purpose: 'Office supplies' };
        let result = processor.processExpense(smallExpense);
        expect(result).toBe(true);
        expect(processor.outputs).toContain(
            'Team Lead approved expense #1 for $800 (Office supplies)',
        );

        // Test manager approval
        const mediumExpense: Expense = { id: 2, amount: 3000, purpose: 'Team event' };
        result = processor.processExpense(mediumExpense);
        expect(result).toBe(true);
        expect(processor.outputs).toContain('Manager approved expense #2 for $3000 (Team event)');

        // Test director approval
        const largeExpense: Expense = { id: 3, amount: 15000, purpose: 'Training program' };
        result = processor.processExpense(largeExpense);
        expect(result).toBe(true);
        expect(processor.outputs).toContain(
            'Director approved expense #3 for $15000 (Training program)',
        );

        // Test CEO approval
        const veryLargeExpense: Expense = {
            id: 4,
            amount: 80000,
            purpose: 'Conference sponsorship',
        };
        result = processor.processExpense(veryLargeExpense);
        expect(result).toBe(true);
        expect(processor.outputs).toContain(
            'CEO approved expense #4 for $80000 (Conference sponsorship)',
        );

        // Test board approval
        const hugeExpense: Expense = { id: 5, amount: 300000, purpose: 'New office equipment' };
        result = processor.processExpense(hugeExpense);
        expect(result).toBe(true);
        expect(processor.outputs).toContain(
            'Board approval required for expense #5 for $300000 (New office equipment)',
        );
        expect(processor.outputs).toContain(
            'Board approved expense #5 for $300000 (New office equipment)',
        );

        // Test rejection
        const extremeExpense: Expense = { id: 6, amount: 600000, purpose: 'Company jet' };
        result = processor.processExpense(extremeExpense);
        expect(result).toBe(false);
        expect(processor.outputs).toContain('Expense #6 for $600000 was rejected as too high');
    });

    test('Individual approvers can only approve within their limits', () => {
        const teamLead = new TeamLeadApprover();
        const manager = new ManagerApprover();
        const director = new DirectorApprover();

        // Team lead can approve small expenses
        const smallExpense: Expense = { id: 1, amount: 800, purpose: 'Office supplies' };
        expect(teamLead.approve(smallExpense)).toBe(true);
        expect(teamLead.outputs).toContain(
            'Team Lead approved expense #1 for $800 (Office supplies)',
        );

        // Team lead cannot approve medium expenses
        const mediumExpense: Expense = { id: 2, amount: 3000, purpose: 'Team event' };
        expect(teamLead.approve(mediumExpense)).toBe(false);
        expect(teamLead.outputs).toContain('Team Lead cannot approve expense #2 for $3000');

        // Manager can approve medium expenses
        expect(manager.approve(mediumExpense)).toBe(true);
        expect(manager.outputs).toContain('Manager approved expense #2 for $3000 (Team event)');

        // Manager cannot approve large expenses
        const largeExpense: Expense = { id: 3, amount: 15000, purpose: 'Training program' };
        expect(manager.approve(largeExpense)).toBe(false);
        expect(manager.outputs).toContain('Manager cannot approve expense #3 for $15000');

        // Director can approve large expenses
        expect(director.approve(largeExpense)).toBe(true);
        expect(director.outputs).toContain(
            'Director approved expense #3 for $15000 (Training program)',
        );
    });

    test('ExpenseSystem manually chains approvers', () => {
        const system = new ExpenseSystem();

        // Small expense goes to team lead
        const smallExpense: Expense = { id: 1, amount: 800, purpose: 'Office supplies' };
        let result = system.processExpense(smallExpense);
        expect(result).toBe(true);
        expect(system.outputs).toContain(
            'Team Lead approved expense #1 for $800 (Office supplies)',
        );

        // Medium expense goes to manager
        const mediumExpense: Expense = { id: 2, amount: 3000, purpose: 'Team event' };
        result = system.processExpense(mediumExpense);
        expect(result).toBe(true);
        expect(system.outputs).toContain('Manager approved expense #2 for $3000 (Team event)');

        // Large expense goes to director
        const largeExpense: Expense = { id: 3, amount: 15000, purpose: 'Training program' };
        result = system.processExpense(largeExpense);
        expect(result).toBe(true);
        expect(system.outputs).toContain(
            'Director approved expense #3 for $15000 (Training program)',
        );

        // Very large expense cannot be approved
        const veryLargeExpense: Expense = {
            id: 4,
            amount: 50000,
            purpose: 'Conference sponsorship',
        };
        result = system.processExpense(veryLargeExpense);
        expect(result).toBe(false);
        expect(system.outputs).toContain('No one could approve expense #4 for $50000');
    });

    test('demonstrates problems with the anti-pattern', () => {
        const system = new ExpenseSystem();

        // Problem 1: Hard to add new approver types without modifying existing code
        // Problem 2: Client code manages the chain flow
        // Problem 3: No standardized way to pass requests through the chain
        // Problem 4: Tight coupling between client and handlers

        // This test would require modifying the ExpenseSystem class to add a new approver
        const expense: Expense = { id: 5, amount: 25000, purpose: 'New equipment' };
        const result = system.processExpense(expense);

        // The system can't handle this expense because we'd need to modify the code
        expect(result).toBe(false);
        expect(system.outputs).toContain('No one could approve expense #5 for $25000');
    });
});
