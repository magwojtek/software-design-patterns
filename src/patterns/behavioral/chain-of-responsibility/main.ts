/**
 * Chain of Responsibility Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Chain of Responsibility pattern.
 */
import { ExpenseProcessor, ExpenseSystem, Expense } from './anti-pattern/implementation';

import {
    TeamLeadExpenseHandler,
    ManagerExpenseHandler,
    DirectorExpenseHandler,
    CEOExpenseHandler,
    BoardExpenseHandler,
} from './proper-pattern/implementation';

import { logger } from '~/utils/logger';

logger.info('=== Chain of Responsibility Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the Chain of Responsibility pattern
 * with hard-coded approval logic and tight coupling.
 */
function demonstrateAntiPattern(): void {
    logger.info('--- Anti-pattern Example ---');
    logger.info('Creating expense processor with hard-coded approval chain:');

    const processor = new ExpenseProcessor();
    const system = new ExpenseSystem();

    // Sample expenses
    const expenses: Expense[] = [
        { id: 1, amount: 800, purpose: 'Office supplies' },
        { id: 2, amount: 3000, purpose: 'Team event' },
        { id: 3, amount: 12000, purpose: 'Training program' },
        { id: 4, amount: 50000, purpose: 'Conference sponsorship' },
        { id: 5, amount: 200000, purpose: 'New office equipment' },
    ];

    logger.info('\nProcessing expenses with monolithic processor:');
    expenses.forEach((expense) => {
        logger.info(`\nExpense #${expense.id}: $${expense.amount} for ${expense.purpose}`);
        const approved = processor.processExpense(expense);
        processor.outputs.forEach((output) => logger.info(`  ${output}`));
        logger.info(`  Result: ${approved ? 'APPROVED' : 'REJECTED'}`);
    });

    logger.info('\nProcessing expenses with separate approvers and manual chain:');
    expenses.slice(0, 3).forEach((expense) => {
        logger.info(`\nExpense #${expense.id}: $${expense.amount} for ${expense.purpose}`);
        const approved = system.processExpense(expense);
        system.outputs.forEach((output) => logger.info(`  ${output}`));
        logger.info(`  Result: ${approved ? 'APPROVED' : 'REJECTED'}`);
    });

    // Try a large expense that the system can't handle
    const largeExpense = expenses[3]; // $50,000
    logger.info(
        `\nExpense #${largeExpense.id}: $${largeExpense.amount} for ${largeExpense.purpose}`,
    );
    const approved = system.processExpense(largeExpense);
    system.outputs.forEach((output) => logger.info(`  ${output}`));
    logger.info(`  Result: ${approved ? 'APPROVED' : 'REJECTED'}`);

    logger.info('\nProblems:');
    logger.warn('1. Tight coupling between client and handlers');
    logger.warn('2. Hard-coded approval logic in each expense processor');
    logger.warn('3. No standardized handling structure');
    logger.warn('4. Difficult to modify the approval chain');
    logger.warn('5. Adding new handlers requires modifying existing code\n');
}

/**
 * Demonstrates the proper implementation of the Chain of Responsibility pattern
 * with a flexible chain structure and decoupled handlers.
 */
function demonstrateProperPattern(): void {
    logger.info('--- Proper Pattern Example ---');
    logger.info('Setting up the chain of responsibility:');

    // Create the handler objects
    const teamLead = new TeamLeadExpenseHandler();
    const manager = new ManagerExpenseHandler();
    const director = new DirectorExpenseHandler();
    const ceo = new CEOExpenseHandler();
    const board = new BoardExpenseHandler();

    // Set up the chain
    teamLead.setNext(manager);
    manager.setNext(director);
    director.setNext(ceo);
    ceo.setNext(board);

    logger.info('  Team Lead -> Manager -> Director -> CEO -> Board');

    // Sample expenses
    const expenses: Expense[] = [
        { id: 1, amount: 800, purpose: 'Office supplies' },
        { id: 2, amount: 3000, purpose: 'Team event' },
        { id: 3, amount: 12000, purpose: 'Training program' },
        { id: 4, amount: 50000, purpose: 'Conference sponsorship' },
        { id: 5, amount: 200000, purpose: 'New office equipment' },
    ];

    logger.info('\nProcessing expenses through the chain:');
    expenses.forEach((expense) => {
        logger.info(`\nExpense #${expense.id}: $${expense.amount} for ${expense.purpose}`);
        const approved = teamLead.handleExpense(expense);

        // Collect all outputs from the chain
        const allOutputs: string[] = [
            ...teamLead.outputs,
            ...manager.outputs,
            ...director.outputs,
            ...ceo.outputs,
            ...board.outputs,
        ];

        // Print unique outputs (remove duplicates)
        [...new Set(allOutputs)].forEach((output) => logger.info(`  ${output}`));
        logger.info(`  Result: ${approved ? 'APPROVED' : 'REJECTED'}`);

        // Clear outputs for next expense
        teamLead.outputs = [];
        manager.outputs = [];
        director.outputs = [];
        ceo.outputs = [];
        board.outputs = [];
    });

    logger.info('\nDemonstrating dynamic chain reconfiguration:');
    logger.info('Creating a new chain: Team Lead -> Director -> Board (skipping Manager and CEO)');

    // Create a new chain with different configuration
    const newTeamLead = new TeamLeadExpenseHandler();
    const newDirector = new DirectorExpenseHandler();
    const newBoard = new BoardExpenseHandler();

    newTeamLead.setNext(newDirector);
    newDirector.setNext(newBoard);

    const specialExpense: Expense = { id: 6, amount: 15000, purpose: 'Special project' };

    logger.info(
        `\nExpense #${specialExpense.id}: $${specialExpense.amount} for ${specialExpense.purpose}`,
    );
    const approved = newTeamLead.handleExpense(specialExpense);

    // Collect all outputs from the chain
    const allOutputs: string[] = [
        ...newTeamLead.outputs,
        ...newDirector.outputs,
        ...newBoard.outputs,
    ];

    // Print unique outputs
    [...new Set(allOutputs)].forEach((output) => logger.info(`  ${output}`));
    logger.info(`  Result: ${approved ? 'APPROVED' : 'REJECTED'}`);

    logger.info('\nBenefits:');
    logger.success('1. Decouples senders from receivers');
    logger.success('2. Allows multiple handlers to process a request');
    logger.success('3. Promotes single responsibility principle');
    logger.success('4. Provides flexibility in chain configuration');
    logger.success('5. Makes it easy to add or remove handlers');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of Chain of Responsibility Pattern Example ===');
