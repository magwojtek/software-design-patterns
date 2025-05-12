import {
    NavigationApp,
    RoutingStrategy,
    CarRoutingStrategy,
    PublicTransportRoutingStrategy,
    WalkingRoutingStrategy,
    RoutingStrategyFactory,
    RoutingStrategyType,
} from './implementation';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Mock the logger to prevent console output during tests
setupLoggerMock();

describe('Strategy Proper Pattern', () => {
    describe('Concrete Strategy Classes', () => {
        let carStrategy: RoutingStrategy;
        let publicTransportStrategy: RoutingStrategy;
        let walkingStrategy: RoutingStrategy;

        beforeEach(() => {
            carStrategy = new CarRoutingStrategy();
            publicTransportStrategy = new PublicTransportRoutingStrategy();
            walkingStrategy = new WalkingRoutingStrategy();
        });

        it('should calculate correct routes for each strategy', () => {
            const start = 'Home';
            const end = 'Work';

            const carRoute = carStrategy.calculateRoute(start, end);
            expect(carRoute).toContain('Car route');
            expect(carRoute).toContain('Highway');

            const ptRoute = publicTransportStrategy.calculateRoute(start, end);
            expect(ptRoute).toContain('Public transport route');
            expect(ptRoute).toContain('Bus');
            expect(ptRoute).toContain('Metro');

            const walkRoute = walkingStrategy.calculateRoute(start, end);
            expect(walkRoute).toContain('Walking route');
            expect(walkRoute).toContain('Park Path');
        });

        it('should estimate correct travel times', () => {
            // Test with dummy route strings since implementation doesn't use them
            expect(carStrategy.estimateTravelTime('dummy')).toBe(30);
            expect(publicTransportStrategy.estimateTravelTime('dummy')).toBe(45);
            expect(walkingStrategy.estimateTravelTime('dummy')).toBe(90);
        });

        it('should return correct strategy names', () => {
            expect(carStrategy.getStrategyName()).toBe('Car');
            expect(publicTransportStrategy.getStrategyName()).toBe('Public Transport');
            expect(walkingStrategy.getStrategyName()).toBe('Walking');
        });
    });

    describe('Navigation App Context', () => {
        let navigation: NavigationApp;
        let carStrategy: RoutingStrategy;
        let publicTransportStrategy: RoutingStrategy;

        beforeEach(() => {
            carStrategy = new CarRoutingStrategy();
            publicTransportStrategy = new PublicTransportRoutingStrategy();
            navigation = new NavigationApp(carStrategy);
        });

        it('should use car strategy by default', () => {
            const route = navigation.calculateRoute('Home', 'Work');
            expect(route).toContain('Car route');
            expect(route).toContain('Highway');
        });

        it('should allow changing strategy at runtime', () => {
            // First use car strategy
            let route = navigation.calculateRoute('Home', 'Work');
            expect(route).toContain('Car route');

            // Change to public transport
            navigation.setRoutingStrategy(publicTransportStrategy);
            route = navigation.calculateRoute('Home', 'Work');
            expect(route).toContain('Public transport route');
            expect(route).toContain('Bus');

            // Change to walking
            navigation.setRoutingStrategy(new WalkingRoutingStrategy());
            route = navigation.calculateRoute('Home', 'Work');
            expect(route).toContain('Walking route');
            expect(route).toContain('Park Path');
        });
    });

    describe('Strategy Factory', () => {
        it('should create correct strategy instances based on type', () => {
            const carStrategy = RoutingStrategyFactory.createStrategy(RoutingStrategyType.CAR);
            expect(carStrategy).toBeInstanceOf(CarRoutingStrategy);
            expect(carStrategy.getStrategyName()).toBe('Car');

            const ptStrategy = RoutingStrategyFactory.createStrategy(
                RoutingStrategyType.PUBLIC_TRANSPORT,
            );
            expect(ptStrategy).toBeInstanceOf(PublicTransportRoutingStrategy);
            expect(ptStrategy.getStrategyName()).toBe('Public Transport');

            const walkingStrategy = RoutingStrategyFactory.createStrategy(
                RoutingStrategyType.WALKING,
            );
            expect(walkingStrategy).toBeInstanceOf(WalkingRoutingStrategy);
            expect(walkingStrategy.getStrategyName()).toBe('Walking');
        });

        it('should throw error for invalid strategy types', () => {
            expect(() => {
                // @ts-expect-error - Passing invalid value for testing
                RoutingStrategyFactory.createStrategy('invalid');
            }).toThrow();
        });
    });

    describe('End-to-End Navigation Flow', () => {
        it('should work correctly with different strategies', () => {
            const navigation = new NavigationApp();
            const startPoint = 'Home';
            const endPoint = 'Work';

            // Car navigation
            let route = navigation.calculateRoute(startPoint, endPoint);
            expect(route).toContain('Car route');

            // Change to public transport
            navigation.setRoutingStrategy(
                RoutingStrategyFactory.createStrategy(RoutingStrategyType.PUBLIC_TRANSPORT),
            );
            route = navigation.calculateRoute(startPoint, endPoint);
            expect(route).toContain('Public transport route');

            // Change to walking
            navigation.setRoutingStrategy(
                RoutingStrategyFactory.createStrategy(RoutingStrategyType.WALKING),
            );
            route = navigation.calculateRoute(startPoint, endPoint);
            expect(route).toContain('Walking route');
        });
    });
});
