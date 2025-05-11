/**
 * Facade Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Facade pattern.
 */
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';
import * as colors from '~/utils/colors';
import { logger } from '~/utils/logger';

logger.info('=== Facade Pattern Example ===\n');

// Anti-pattern demonstration
export function demonstrateAntiPattern(): void {
    logger.warn('--- Anti-pattern Example ---');
    logger.info('Creating and configuring subsystem components directly from client code:');

    // Create system components directly
    const system = AntiPattern.createSampleUserSystem();
    logger.info(
        colors.warning(
            'Client code is responsible for knowing about and coordinating all subsystem components',
        ),
    );

    // Show client code interacting directly with components
    logger.info('\nClient code directly calling multiple subsystem APIs:');

    // Validate inputs manually
    const userId = 1;
    const username = 'johndoe';
    const password = 'password123';

    logger.info(`Validating user ID ${userId}...`);
    if (!system.validationService.validateUserId(userId)) {
        logger.error('Invalid user ID');
        return;
    }

    logger.info(`Validating username "${username}"...`);
    if (!system.validationService.validateUsername(username)) {
        logger.error('Invalid username');
        return;
    }

    // Authenticate manually
    logger.info(`Authenticating user "${username}"...`);
    if (!system.authService.login(username, password)) {
        logger.error('Authentication failed');
        return;
    }

    // Get data manually
    logger.info('Retrieving user data...');
    const userData = system.userDataService.getUserData(userId);

    if (userData) {
        logger.success(`User data: ${JSON.stringify(userData)}`);
    } else {
        logger.error('Failed to retrieve user data');
    }

    // Clean up resources manually
    logger.info('Cleaning up resources...');
    system.authService.logout();
    system.dbConnection.disconnect();

    // Demonstrate the built-in client function
    logger.info('\nUsing built-in getUserInfo function (still anti-pattern):');
    const result = AntiPattern.getUserInfo('johndoe', 'password123', 1);
    logger.info(`Result: ${colors.warning(result ? JSON.stringify(result) : 'No data retrieved')}`);

    logger.error('\nProblems with the Anti-pattern approach:');
    logger.error('1. Client code is tightly coupled to all subsystem components');
    logger.error('2. Client needs knowledge of the correct sequence of operations');
    logger.error('3. Each client must repeat the same coordination logic');
    logger.error('4. Client has to manage resources and cleanup');
    logger.error('5. Changes in subsystem would affect all client code');
}

// Proper pattern demonstration
export function demonstrateProperPattern(): void {
    logger.success('\n--- Proper Pattern Example ---');
    logger.info('Creating a Facade that encapsulates subsystem complexity:');

    // Create a facade that handles subsystem interactions
    const userFacade = ProperPattern.createSampleUserFacade();
    logger.info(colors.properPattern('Client code only needs to work with the Facade'));

    // Show simplified client code using facade
    logger.info('\nClient code using the Facade for the same operation:');

    // Retrieving user data with a single method call
    const userId = 1;
    const username = 'johndoe';
    const password = 'password123';

    logger.info(`Getting user info for ID ${userId} through the facade...`);
    const userData = userFacade.getUserInfo(username, password, userId);

    if (userData) {
        logger.success(`User data: ${JSON.stringify(userData)}`);
    } else {
        logger.error('Failed to retrieve user data');
    }

    // Show how the facade makes email validation simpler
    logger.info('\nValidating email through facade:');
    const isValid = userFacade.isEmailValid('john.doe@example.com');
    logger.info(`Email validation result: ${isValid ? 'Valid' : 'Invalid'}`);

    // Clean up resources through facade
    logger.info('\nShutting down through facade:');
    userFacade.shutdown();

    logger.success('\nBenefits of the Facade Pattern:');
    logger.success('1. Client code is decoupled from subsystem details');
    logger.success('2. Reduced complexity in client code');
    logger.success('3. Subsystem components can change without affecting clients');
    logger.success('4. Common operations are encapsulated and reusable');
    logger.success('5. Resource management is handled by the facade');

    // Advanced example: Showing how facade can still provide access to lower level functionality when needed
    logger.info('\nAdvanced example - accessing specific functionality when needed:');
    const newFacade = ProperPattern.createSampleUserFacade();
    logger.info('Executing custom query through facade:');

    const results = newFacade.executeCustomQuery(
        username,
        password,
        'SELECT * FROM advanced_stats WHERE user_id = 1',
    );
    logger.info(`Custom query results: ${JSON.stringify(results)}`);
    newFacade.shutdown();
}

// When this module is run directly
logger.info('=== FACADE PATTERN DEMONSTRATION ===');
logger.info(
    'The Facade pattern provides a simplified interface to a complex subsystem of classes, ' +
        'making it easier to use and reducing dependencies.',
);

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Exposes complex subsystem directly to clients');
logger.error('- Requires clients to understand subsystem details');
logger.error('- Creates tight coupling between clients and subsystem');
logger.error('- Forces clients to handle coordination logic');
logger.error('- Makes code maintenance difficult when subsystem changes');

logger.success('\nProper pattern approach:');
logger.success('- Provides simplified interface to complex subsystem');
logger.success('- Decouples clients from subsystem details');
logger.success('- Hides complex coordination in the facade');
logger.success('- Improves maintainability when subsystem changes');
logger.success('- Allows controlled access to subsystem when needed');

logger.info('\n=== End of Facade Pattern Example ===');
