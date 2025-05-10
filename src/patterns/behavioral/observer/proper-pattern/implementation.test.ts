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
        new PhoneDisplay(weatherStation);
        new WebDisplay(weatherStation);
        new SmartHomeSystem(weatherStation);

        // Clear logger calls from registration
        loggerSpy.mockClear();

        // Set new weather measurements
        weatherStation.setMeasurements(22, 65, 1013);

        // Verify that all observers were notified (3 observers)
        expect(loggerSpy).toHaveBeenCalledTimes(3);
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Phone Display: Temperature 22°C'),
            LogColor.PHONE_DISPLAY,
        );
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Web Display: Weather update - Temp: 22°C'),
            LogColor.WEB_DISPLAY,
        );
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Smart Home: Updating climate settings for 22°C'),
            LogColor.SMART_HOME,
        );
    });

    test('allows observers to unsubscribe', () => {
        // Create observers
        const phoneDisplay = new PhoneDisplay(weatherStation);
        // Adding a use of webDisplay to fix the unused variable warning
        const webDisplay = new WebDisplay(weatherStation);
        expect(webDisplay).toBeInstanceOf(WebDisplay);

        // Unsubscribe one observer
        phoneDisplay.unsubscribe();

        // Clear logger calls from registration
        loggerSpy.mockClear();

        // Set new measurements
        weatherStation.setMeasurements(25, 70, 1012);

        // Verify only webDisplay was notified
        expect(loggerSpy).toHaveBeenCalledTimes(1);
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Web Display'),
            LogColor.WEB_DISPLAY,
        );
        expect(loggerSpy).not.toHaveBeenCalledWith(
            expect.stringContaining('Phone Display'),
            expect.any(Number),
        );
    });

    test('allows adding custom observers at runtime', () => {
        // Define a new type of observer
        class EmailAlertSystem implements Observer {
            update(temperature: number): void {
                logger.log(
                    `Email Alert: Weather alert for extreme values - Temp: ${temperature}°C`,
                    LogColor.EMAIL_ALERT,
                );
            }
        }

        // Create the new observer
        const emailAlert = new EmailAlertSystem();

        // Register it with the weather station
        weatherStation.registerObserver(emailAlert);

        // Set measurements
        weatherStation.setMeasurements(35, 50, 1000);

        // Verify our custom observer was notified
        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Email Alert'),
            LogColor.EMAIL_ALERT,
        );
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
