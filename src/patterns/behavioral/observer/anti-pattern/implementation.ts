/**
 * Observer Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Tight coupling between subject and observers
 * 2. No standard interface for observers
 * 3. Hard to extend with new observer types
 * 4. No way to dynamically add/remove observers at runtime
 * 5. Hard to test due to concrete dependencies
 */
import { logger, LogColor } from '~/utils/logger';

export class WeatherStation {
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;

    // Hard-coded references to specific observer classes
    private phoneDisplay: PhoneDisplay;
    private webDisplay: WebDisplay;
    private smartHomeSystem: SmartHomeSystem;

    constructor() {
        // Creating concrete implementations in constructor
        this.phoneDisplay = new PhoneDisplay();
        this.webDisplay = new WebDisplay();
        this.smartHomeSystem = new SmartHomeSystem();
    }

    public setMeasurements(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;

        // Manual notification of each observer
        this.notifyObservers();
    }

    private notifyObservers(): void {
        // Direct method calls to specific observer types
        this.phoneDisplay.update(this.temperature, this.humidity, this.pressure);
        this.webDisplay.update(this.temperature, this.humidity, this.pressure);
        this.smartHomeSystem.update(this.temperature, this.humidity);
    }
}

// Concrete observer implementations with no common interface
export class PhoneDisplay {
    public update(temperature: number, humidity: number, pressure: number): void {
        logger.log(
            `Phone Display: Temperature ${temperature}°C, Humidity ${humidity}%, Pressure ${pressure} hPa`,
            LogColor.PHONE_DISPLAY,
        );
    }
}

export class WebDisplay {
    public update(temperature: number, humidity: number, pressure: number): void {
        logger.log(
            `Web Display: Weather update - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure ${pressure} hPa`,
            LogColor.WEB_DISPLAY,
        );
    }
}

export class SmartHomeSystem {
    public update(temperature: number, humidity: number): void {
        // Smart home might respond to weather changes with different actions
        if (temperature > 25) {
            logger.log('Smart Home: Turning on air conditioning', LogColor.SMART_HOME);
        } else if (temperature < 15) {
            logger.log('Smart Home: Turning on heating', LogColor.SMART_HOME);
        }
        logger.log(
            `Smart Home: Updating climate settings for ${temperature}°C and ${humidity}% humidity`,
            LogColor.SMART_HOME,
        );
    }
}
