import { logger } from '~/utils/logger';
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';

export function demonstrateAntiPattern(): void {
    logger.info('\n--- PROXY PATTERN - ANTI-PATTERN DEMO ---');
    logger.info(
        'In the anti-pattern, clients directly access and manage the resource-intensive object.',
    );
    logger.info('Each client has to handle authentication, caching, and lazy loading itself.');

    // Demonstrate the anti-pattern usage
    AntiPattern.demonstrateImageClientUsage();

    logger.info('\nIssues with the anti-pattern approach:');
    logger.error('- Client code is responsible for multiple concerns (SRP violation)');
    logger.error('- Tight coupling between clients and the database implementation');
    logger.error('- Code duplication between different clients (web and mobile)');
    logger.error('- Difficult to maintain and extend as requirements change');
    logger.error('- No separation between business logic and infrastructure concerns');
}

export function demonstrateProperPattern(): void {
    logger.info('\n--- PROXY PATTERN - PROPER PATTERN DEMO ---');
    logger.info('In the proper pattern, a proxy sits between clients and the real service.');
    logger.info(
        'The proxy controls access to the real service and handles cross-cutting concerns.',
    );

    // Demonstrate the proper pattern usage
    ProperPattern.demonstrateProperProxyUsage();

    logger.info('\nBenefits of the proxy pattern:');
    logger.success('- Separation of concerns (SRP adherence)');
    logger.success("- Clients work with a simple interface, unaware of the proxy's existence");
    logger.success('- Cross-cutting concerns are centralized in the proxy');
    logger.success(
        '- Easy to add new proxy capabilities without changing clients or the real service',
    );
    logger.success(
        '- Different clients can use the same proxy with specialized methods (e.g., mobile optimization)',
    );
    logger.success('- Resource optimization through lazy initialization and caching');
}

// When this module is run directly
logger.info('=== PROXY PATTERN DEMONSTRATION ===');
logger.info(
    'The Proxy pattern provides a surrogate or placeholder for another object to control access to it.',
);
logger.info('It is used for lazy loading, access control, logging, caching, and more.');

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Clients directly access and manage resource-intensive objects');
logger.error(
    '- Cross-cutting concerns (caching, access control, logging) are mixed with business logic',
);
logger.error('- Code duplication across multiple clients');
logger.error('- High maintenance cost when requirements change');

logger.success('\nProper pattern approach:');
logger.success('- Proxy controls access to the real object and adds additional behaviors');
logger.success('- Clear separation of concerns between business logic and infrastructure');
logger.success('- Centralized management of cross-cutting concerns');
logger.success('- Both clients and real service remain simple and focused');
logger.success('- Easy to extend with new capabilities without modifying existing code');
