import {
    ExpenseHandler,
    TeamLeadExpenseHandler,
    ManagerExpenseHandler,
    DirectorExpenseHandler,
    CEOExpenseHandler,
    BoardExpenseHandler,
    Expense,
} from './implementation';

describe('Chain of Responsibility Proper Pattern Tests', () => {
    let teamLead: TeamLeadExpenseHandler;
    let manager: ManagerExpenseHandler;
    let director: DirectorExpenseHandler;
    let ceo: CEOExpenseHandler;
    let board: BoardExpenseHandler;

    beforeEach(() => {
        // Set up the chain of responsibility
        teamLead = new TeamLeadExpenseHandler();
        manager = new ManagerExpenseHandler();
        director = new DirectorExpenseHandler();
        ceo = new CEOExpenseHandler();
        board = new BoardExpenseHandler();

        // Link the handlers in a chain
        teamLead.setNext(manager);
        manager.setNext(director);
        director.setNext(ceo);
        ceo.setNext(board);
    });

    test('TeamLead approves expense within limit', () => {
        const expense: Expense = { id: 1, amount: 800, purpose: 'Office supplies' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain(
            'Team Lead approved expense #1 for $800 (Office supplies)',
        );
    });

    test('Manager approves expense within limit', () => {
        const expense: Expense = { id: 2, amount: 3000, purpose: 'Team event' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain('Passing expense request to Manager');
        expect(manager.outputs).toContain('Manager approved expense #2 for $3000 (Team event)');
    });

    test('Director approves expense within limit', () => {
        const expense: Expense = { id: 3, amount: 12000, purpose: 'Training program' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain('Passing expense request to Manager');
        expect(manager.outputs).toContain('Passing expense request to Director');
        expect(director.outputs).toContain(
            'Director approved expense #3 for $12000 (Training program)',
        );
    });

    test('CEO approves expense within limit', () => {
        const expense: Expense = { id: 4, amount: 50000, purpose: 'Conference sponsorship' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain('Passing expense request to Manager');
        expect(manager.outputs).toContain('Passing expense request to Director');
        expect(director.outputs).toContain('Passing expense request to CEO');
        expect(ceo.outputs).toContain(
            'CEO approved expense #4 for $50000 (Conference sponsorship)',
        );
    });

    test('Board approves expense above all other limits', () => {
        const expense: Expense = { id: 5, amount: 200000, purpose: 'New office equipment' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain('Passing expense request to Manager');
        expect(manager.outputs).toContain('Passing expense request to Director');
        expect(director.outputs).toContain('Passing expense request to CEO');
        expect(ceo.outputs).toContain('Passing expense request to Board');
        expect(board.outputs).toContain(
            'Board approved expense #5 for $200000 (New office equipment)',
        );
    });

    test('demonstrates ability to reconfigure the chain', () => {
        // Create a new chain without the Manager
        const newTeamLead = new TeamLeadExpenseHandler();
        const newDirector = new DirectorExpenseHandler();

        // Link directly from TeamLead to Director
        newTeamLead.setNext(newDirector);

        const expense: Expense = { id: 6, amount: 3000, purpose: 'Marketing materials' };
        const result = newTeamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(newTeamLead.outputs).toContain('Passing expense request to Director');
        expect(newDirector.outputs).toContain(
            'Director approved expense #6 for $3000 (Marketing materials)',
        );
    });

    test('demonstrates adding a custom handler to the chain', () => {
        // Create a custom handler for special project expenses
        class ProjectManagerExpenseHandler extends ExpenseHandler {
            private readonly APPROVAL_LIMIT = 8000;

            protected canHandle(expense: Expense): boolean {
                return expense.amount <= this.APPROVAL_LIMIT && expense.purpose.includes('Project');
            }

            protected processExpense(expense: Expense): void {
                this.outputs.push(
                    `Project Manager approved expense #${expense.id} for $${expense.amount} (${expense.purpose})`,
                );
            }

            protected getName(): string {
                return 'Project Manager';
            }
        }

        // Insert the new handler between TeamLead and Manager
        const projectManager = new ProjectManagerExpenseHandler();
        teamLead.setNext(projectManager);
        projectManager.setNext(manager);

        const expense: Expense = { id: 7, amount: 7500, purpose: 'Project materials' };
        const result = teamLead.handleExpense(expense);

        expect(result).toBe(true);
        expect(teamLead.outputs).toContain('Passing expense request to Project Manager');
        expect(projectManager.outputs).toContain(
            'Project Manager approved expense #7 for $7500 (Project materials)',
        );
    });
});
