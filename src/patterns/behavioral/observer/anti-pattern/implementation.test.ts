import { logger, LogColor } from '~/utils/logger';

import { WeatherStation } from './implementation';

describe('Observer Anti-Pattern Tests', () => {
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

    test('notifies all hardcoded observers when measurements change', () => {
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

    test('smart home responds to high temperature', () => {
        // Set high temperature
        weatherStation.setMeasurements(30, 60, 1010);

        // Verify AC is turned on
        expect(loggerSpy).toHaveBeenCalledWith(
            'Smart Home: Turning on air conditioning',
            LogColor.SMART_HOME,
        );
    });

    test('smart home responds to low temperature', () => {
        // Set low temperature
        weatherStation.setMeasurements(10, 60, 1010);

        // Verify heating is turned on
        expect(loggerSpy).toHaveBeenCalledWith(
            'Smart Home: Turning on heating',
            LogColor.SMART_HOME,
        );
    });

    test('demonstrates problems with anti-pattern implementation', () => {
        // Problem 1: Cannot add new observers at runtime
        // Let's try to create a new type of observer
        class EmailAlertSystem {
            public update(temperature: number): void {
                logger.log(
                    `Email Alert: Weather alert for extreme values - Temp: ${temperature}°C`,
                    LogColor.EMAIL_ALERT,
                );
            }
        }

        // Just creating the class for demonstration, no need to use it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const emailAlert = new EmailAlertSystem();

        // But there's no way to add it to the existing weather station!
        // We would need to modify the WeatherStation class itself

        // Problem 2: Cannot remove existing observers
        // No way to remove phone display for example

        // Problem 3: Hard to test due to tight coupling
        // Cannot inject mock observers for testing
    });
});
