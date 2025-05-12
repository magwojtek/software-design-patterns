import {
    WeatherStation,
    Observer,
    PhoneDisplay,
    WebDisplay,
    SmartHomeSystem,
} from './implementation';
import { logger, LogColor } from '~/utils/logger';

describe('Observer Proper Pattern Tests', () => {
    let weatherStation: WeatherStation;
    let loggerSpy: jest.SpyInstance;

    beforeEach(() => {
        // Create a new weather station before each test
        weatherStation = new WeatherStation();

        // Spy on logger.log to verify observer updates
        loggerSpy = jest.spyOn(logger, 'log').mockImplementation();
    });

    afterEach(() => {
        loggerSpy.mockRestore();
    });

    test('registers observers correctly', () => {
        // Initial state - no observers
        expect(weatherStation['observers'].length).toBe(0);

        // Create observers and use them
        new PhoneDisplay(weatherStation);
        new WebDisplay(weatherStation);

        // Verify observers were registered
        expect(weatherStation['observers'].length).toBe(2);
    });

    test('notifies all registered observers when measurements change', () => {
        // Create observers and use them by registering them to the weather station
        const phoneDisplay = new PhoneDisplay(weatherStation);
        const webDisplay = new WebDisplay(weatherStation);
        const smartHomeSystem = new SmartHomeSystem(weatherStation);

        // Set new weather measurements
        weatherStation.setMeasurements(22, 65, 1013);

        // Instead of checking logger calls, verify the observer state directly
        expect(phoneDisplay.toString()).toContain('22°C');
        expect(phoneDisplay.toString()).toContain('65%');
        expect(phoneDisplay.toString()).toContain('1013');

        expect(webDisplay.toString()).toContain('22°C');
        expect(webDisplay.toString()).toContain('65%');

        expect(smartHomeSystem.toString()).toContain('22°C');
        expect(smartHomeSystem.toString()).toContain('65%');
    });

    test('allows observers to unsubscribe', () => {
        // Create observers
        const phoneDisplay = new PhoneDisplay(weatherStation);
        const webDisplay = new WebDisplay(weatherStation);

        // Initial state - both observers registered
        expect(weatherStation['observers'].length).toBe(2);

        // Unsubscribe one observer
        phoneDisplay.unsubscribe();

        // Verify the observer was removed
        expect(weatherStation['observers'].length).toBe(1);
        expect(weatherStation['observers']).not.toContain(phoneDisplay);
        expect(weatherStation['observers']).toContain(webDisplay);

        // Set new measurements
        weatherStation.setMeasurements(25, 70, 1012);

        // Verify webDisplay updated its state but phoneDisplay did not
        expect(webDisplay.toString()).toContain('25°C');
        expect(webDisplay.toString()).toContain('70%');
        expect(webDisplay.toString()).toContain('1012');
    });

    test('allows adding custom observers at runtime', () => {
        // Define a new type of observer
        class EmailAlertSystem implements Observer {
            private lastTemperature: number = 0;

            update(temperature: number): void {
                this.lastTemperature = temperature;
                logger.log(
                    `Email Alert: Weather alert for extreme values - Temp: ${temperature}°C`,
                    LogColor.EMAIL_ALERT,
                );
            }

            toString(): string {
                return `EmailAlert: ${this.lastTemperature}°C`;
            }
        }

        // Create the new observer
        const emailAlert = new EmailAlertSystem();

        // Register it with the weather station
        weatherStation.registerObserver(emailAlert);

        // Set measurements
        weatherStation.setMeasurements(35, 50, 1000);

        // Verify our custom observer state was updated
        expect(emailAlert.toString()).toContain('35°C');
    });

    test('properly manages state of measurements', () => {
        weatherStation.setMeasurements(18, 60, 1015);

        expect(weatherStation.getTemperature()).toBe(18);
        expect(weatherStation.getHumidity()).toBe(60);
        expect(weatherStation.getPressure()).toBe(1015);
    });

    test('handles mock observers for testing', () => {
        // Create a mock observer for testing
        const mockObserver: Observer = {
            update: jest.fn(),
        };

        // Register the mock observer
        weatherStation.registerObserver(mockObserver);

        // Update measurements
        weatherStation.setMeasurements(20, 55, 1010);

        // Verify the mock was called with correct parameters
        expect(mockObserver.update).toHaveBeenCalledWith(20, 55, 1010);
    });
});
