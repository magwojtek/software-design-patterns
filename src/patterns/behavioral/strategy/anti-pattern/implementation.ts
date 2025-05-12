/**
 * Strategy Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Tight coupling between navigation app and routing algorithms
 * 2. Conditional logic spread throughout the code
 * 3. Hard to extend with new routing types
 * 4. Violates Open/Closed principle (need to modify code to add new strategies)
 * 5. Difficult to test individual routing algorithms
 */
import { logger, LogColor } from '~/utils/logger';

export enum NavigationMode {
    CAR = 'car',
    PUBLIC_TRANSPORT = 'public_transport',
    WALKING = 'walking',
}

// Navigation App with all routing logic embedded
export class NavigationApp {
    private currentMode: NavigationMode = NavigationMode.CAR;

    public setNavigationMode(mode: NavigationMode): void {
        logger.info(`Setting navigation mode to: ${mode}`);
        this.currentMode = mode;
    }

    public calculateRoute(startPoint: string, endPoint: string): string {
        logger.info(
            `Calculating route from ${startPoint} to ${endPoint} using ${this.currentMode} mode`,
        );

        // Complex conditional logic to handle different routing strategies
        if (this.currentMode === NavigationMode.CAR) {
            return this.calculateCarRoute(startPoint, endPoint);
        } else if (this.currentMode === NavigationMode.PUBLIC_TRANSPORT) {
            return this.calculatePublicTransportRoute(startPoint, endPoint);
        } else if (this.currentMode === NavigationMode.WALKING) {
            return this.calculateWalkingRoute(startPoint, endPoint);
        }

        // Default fallback
        throw new Error(`Unsupported navigation mode: ${this.currentMode}`);
    }

    public displayETA(startPoint: string, endPoint: string): void {
        // More conditional logic duplicated here
        const route = this.calculateRoute(startPoint, endPoint);

        if (this.currentMode === NavigationMode.CAR) {
            const eta = this.estimateCarTravelTime(route);
            logger.log(`Car ETA: ${eta} minutes`, LogColor.PHONE_DISPLAY);
        } else if (this.currentMode === NavigationMode.PUBLIC_TRANSPORT) {
            const eta = this.estimatePublicTransportTime(route);
            logger.log(`Public Transport ETA: ${eta} minutes`, LogColor.WEB_DISPLAY);
        } else if (this.currentMode === NavigationMode.WALKING) {
            const eta = this.estimateWalkingTime(route);
            logger.log(`Walking ETA: ${eta} minutes`, LogColor.SMART_HOME);
        }
    }

    // Car-specific routing logic
    private calculateCarRoute(startPoint: string, endPoint: string): string {
        logger.log(`Car Navigation: Finding fastest road route...`, LogColor.PHONE_DISPLAY);
        // Simulate complex car routing algorithm
        return `Car route: ${startPoint} → Highway A1 → Highway A9 → ${endPoint}`;
    }

    // Public transport-specific routing logic
    private calculatePublicTransportRoute(startPoint: string, endPoint: string): string {
        logger.log(
            `Public Transport: Finding route with available transit options...`,
            LogColor.WEB_DISPLAY,
        );
        // Simulate complex public transport routing algorithm
        return `Public transport route: ${startPoint} → Bus 100 → Metro Line 4 → ${endPoint}`;
    }

    // Walking-specific routing logic
    private calculateWalkingRoute(startPoint: string, endPoint: string): string {
        logger.log(`Walking Navigation: Finding pedestrian-friendly path...`, LogColor.SMART_HOME);
        // Simulate complex walking routing algorithm
        return `Walking route: ${startPoint} → Main St → Park Path → Oak Ave → ${endPoint}`;
    }

    // More duplicated conditional code for travel time estimation
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private estimateCarTravelTime(route: string): number {
        // Simulate car travel time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const distance = extractDistanceFromRoute(route);
        return 30; // minutes
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private estimatePublicTransportTime(route: string): number {
        // Simulate public transport travel time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const stops = countStopsInRoute(route);
        return 45; // minutes
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    private estimateWalkingTime(route: string): number {
        // Simulate walking time calculation
        // Using route parameter in a comment to show it would be used in a real implementation
        // const walkingDistance = calculateWalkingDistance(route);
        return 90; // minutes
    }

    // Adding a new routing mode would require modifying this class
    // Violating the Open/Closed Principle
}

// Client code demonstration
export function demonstrateAntiPatternUsage(): void {
    const navigation = new NavigationApp();

    // Default car navigation
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');

    // Switch to public transport
    navigation.setNavigationMode(NavigationMode.PUBLIC_TRANSPORT);
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');

    // Switch to walking
    navigation.setNavigationMode(NavigationMode.WALKING);
    navigation.calculateRoute('Home', 'Office');
    navigation.displayETA('Home', 'Office');
}
