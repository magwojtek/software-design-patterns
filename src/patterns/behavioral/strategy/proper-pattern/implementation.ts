/**
 * Strategy Proper Pattern
 *
 * Benefits of this implementation:
 * 1. Clear separation of concerns (each strategy has a single responsibility)
 * 2. Easy to add new strategies without modifying existing code
 * 3. Runtime flexibility to switch between different strategies
 * 4. Better testability through proper abstraction
 * 5. Follows Open/Closed principle
 */
import { logger, LogColor } from '~/utils/logger';

// Strategy type enum for better type safety
export enum RoutingStrategyType {
    CAR = 'car',
    PUBLIC_TRANSPORT = 'public_transport',
    WALKING = 'walking',
}

// Strategy interface
export interface RoutingStrategy {
    calculateRoute(startPoint: string, endPoint: string): string;
    estimateTravelTime(route: string): number;
    getStrategyName(): string;
    getDisplayColor(): LogColor;
}

// Concrete strategy implementations
export class CarRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        logger.log(`Car Navigation: Finding fastest road route...`, LogColor.PHONE_DISPLAY);
        // Simulate complex car routing algorithm
        return `Car route: ${startPoint} → Highway A1 → Highway A9 → ${endPoint}`;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public estimateTravelTime(route: string): number {
        // Simulate car travel time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const distance = extractDistanceFromRoute(route);
        return 30; // minutes
    }

    public getStrategyName(): string {
        return 'Car';
    }

    public getDisplayColor(): LogColor {
        return LogColor.PHONE_DISPLAY;
    }
}

export class PublicTransportRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        logger.log(
            `Public Transport: Finding route with available transit options...`,
            LogColor.WEB_DISPLAY,
        );
        // Simulate complex public transport routing algorithm
        return `Public transport route: ${startPoint} → Bus 100 → Metro Line 4 → ${endPoint}`;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public estimateTravelTime(route: string): number {
        // Simulate public transport travel time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const stops = countStopsInRoute(route);
        return 45; // minutes
    }

    public getStrategyName(): string {
        return 'Public Transport';
    }

    public getDisplayColor(): LogColor {
        return LogColor.WEB_DISPLAY;
    }
}

export class WalkingRoutingStrategy implements RoutingStrategy {
    public calculateRoute(startPoint: string, endPoint: string): string {
        logger.log(`Walking Navigation: Finding pedestrian-friendly path...`, LogColor.SMART_HOME);
        // Simulate complex walking routing algorithm
        return `Walking route: ${startPoint} → Main St → Park Path → Oak Ave → ${endPoint}`;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public estimateTravelTime(route: string): number {
        // Simulate walking time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const walkingDistance = calculateWalkingDistance(route);
        return 90; // minutes
    }

    public getStrategyName(): string {
        return 'Walking';
    }

    public getDisplayColor(): LogColor {
        return LogColor.SMART_HOME;
    }
}

// Context class that uses the strategy
export class NavigationApp {
    private routingStrategy: RoutingStrategy;

    constructor(strategy: RoutingStrategy = new CarRoutingStrategy()) {
        this.routingStrategy = strategy;
    }

    public setRoutingStrategy(strategy: RoutingStrategy): void {
        logger.info(`Setting navigation mode to: ${strategy.getStrategyName()}`);
        this.routingStrategy = strategy;
    }

    public calculateRoute(startPoint: string, endPoint: string): string {
        logger.info(
            `Calculating route from ${startPoint} to ${endPoint} using ${this.routingStrategy.getStrategyName()} mode`,
        );
        return this.routingStrategy.calculateRoute(startPoint, endPoint);
    }

    public displayETA(startPoint: string, endPoint: string): void {
        const route = this.calculateRoute(startPoint, endPoint);
        const eta = this.routingStrategy.estimateTravelTime(route);
        const strategyName = this.routingStrategy.getStrategyName();
        const displayColor = this.routingStrategy.getDisplayColor();

        logger.log(`${strategyName} ETA: ${eta} minutes`, displayColor);
    }
}

export class RoutingStrategyFactory {
    public static createStrategy(type: RoutingStrategyType): RoutingStrategy {
        switch (type) {
            case RoutingStrategyType.CAR:
                return new CarRoutingStrategy();
            case RoutingStrategyType.PUBLIC_TRANSPORT:
                return new PublicTransportRoutingStrategy();
            case RoutingStrategyType.WALKING:
                return new WalkingRoutingStrategy();
            default:
                // Exhaustiveness check to ensure all enum cases are handled
                const _exhaustiveCheck: never = type;
                throw new Error(`Unsupported routing strategy type: ${_exhaustiveCheck}`);
        }
    }
}

// Client code demonstration
export function demonstrateProperPatternUsage(): void {
    // Create default navigation with car strategy
    const navigation = new NavigationApp();

    // Default car navigation
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');

    // Switch to public transport strategy
    navigation.setRoutingStrategy(new PublicTransportRoutingStrategy());
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');

    // Switch to walking strategy
    navigation.setRoutingStrategy(new WalkingRoutingStrategy());
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');

    // Using the factory to create strategies - alternative approach with enum
    logger.info('\nDemonstrating strategy creation using factory with enum:');
    navigation.setRoutingStrategy(RoutingStrategyFactory.createStrategy(RoutingStrategyType.CAR));
    navigation.displayETA('Home', 'Office');
    navigation.setRoutingStrategy(
        RoutingStrategyFactory.createStrategy(RoutingStrategyType.PUBLIC_TRANSPORT),
    );
    navigation.displayETA('Home', 'Office');

    // Easy to extend with new strategies without modifying NavigationApp
    // Example comment for how a new strategy would be added:
    logger.info('\nComment showing how easy it is to add a new strategy:');
    logger.info('// 1. Add new strategy type to the enum');
    logger.info('enum RoutingStrategyType { CAR, PUBLIC_TRANSPORT, WALKING, BICYCLE }');
    logger.info('// 2. Create new strategy implementing RoutingStrategy interface');
    logger.info('class BicycleRoutingStrategy implements RoutingStrategy { ... }');
    logger.info('// 3. Update the factory to handle the new enum case');
    logger.info('// 4. Use it with existing NavigationApp without further modifications');
    logger.info(
        'navigation.setRoutingStrategy(RoutingStrategyFactory.createStrategy(RoutingStrategyType.BICYCLE));',
    );
}
