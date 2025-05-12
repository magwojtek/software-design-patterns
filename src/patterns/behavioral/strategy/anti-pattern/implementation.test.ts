import { NavigationApp, NavigationMode } from './implementation';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Mock the logger to prevent console output during tests
setupLoggerMock();

describe('Strategy Anti-pattern', () => {
    let navigation: NavigationApp;

    beforeEach(() => {
        navigation = new NavigationApp();
    });

    it('should default to car navigation mode', () => {
        const route = navigation.calculateRoute('Home', 'Work');
        expect(route).toContain('Car route');
        expect(route).toContain('Highway');
    });

    it('should calculate public transport route when mode is set to public transport', () => {
        navigation.setNavigationMode(NavigationMode.PUBLIC_TRANSPORT);
        const route = navigation.calculateRoute('Home', 'Work');
        expect(route).toContain('Public transport route');
        expect(route).toContain('Bus');
        expect(route).toContain('Metro');
    });

    it('should calculate walking route when mode is set to walking', () => {
        navigation.setNavigationMode(NavigationMode.WALKING);
        const route = navigation.calculateRoute('Home', 'Work');
        expect(route).toContain('Walking route');
        expect(route).toContain('Park Path');
    });

    // Test ETA calculations by implementing a custom method to extract ETA values
    it('should use correct ETA calculation for each mode', () => {
        // Create a spy method on navigation to capture ETA values
        const getETAValue = (mode: NavigationMode): number => {
            // Set the navigation mode
            navigation.setNavigationMode(mode);

            // Use a spy to capture the return value
            // Since displayETA doesn't return the value, we'll test the underlying methods
            let etaValue = 0;

            // Based on the mode, we know which internal method would be used
            if (mode === NavigationMode.CAR) {
                etaValue = navigation['estimateCarTravelTime']('');
                expect(etaValue).toBe(30);
            } else if (mode === NavigationMode.PUBLIC_TRANSPORT) {
                etaValue = navigation['estimatePublicTransportTime']('');
                expect(etaValue).toBe(45);
            } else if (mode === NavigationMode.WALKING) {
                etaValue = navigation['estimateWalkingTime']('');
                expect(etaValue).toBe(90);
            }

            return etaValue;
        };

        // Test each mode's ETA calculation
        expect(getETAValue(NavigationMode.CAR)).toBe(30);
        expect(getETAValue(NavigationMode.PUBLIC_TRANSPORT)).toBe(45);
        expect(getETAValue(NavigationMode.WALKING)).toBe(90);
    });

    it('should correctly handle routing for each navigation mode', () => {
        // Test car route details
        const carRoute = navigation.calculateRoute('Home', 'Work');
        expect(carRoute).toContain('Car route');
        expect(carRoute).toContain('Highway');

        // Test public transport route details
        navigation.setNavigationMode(NavigationMode.PUBLIC_TRANSPORT);
        const ptRoute = navigation.calculateRoute('Home', 'Work');
        expect(ptRoute).toContain('Public transport route');
        expect(ptRoute).toContain('Bus');
        expect(ptRoute).toContain('Metro');

        // Test walking route details
        navigation.setNavigationMode(NavigationMode.WALKING);
        const walkingRoute = navigation.calculateRoute('Home', 'Work');
        expect(walkingRoute).toContain('Walking route');
        expect(walkingRoute).toContain('Park Path');
    });

    it('should throw an error for unsupported navigation modes', () => {
        // @ts-expect-error - Explicitly setting an invalid mode for testing
        navigation['currentMode'] = 'bicycle';

        expect(() => {
            navigation.calculateRoute('Home', 'Work');
        }).toThrow('Unsupported navigation mode');
    });
});
