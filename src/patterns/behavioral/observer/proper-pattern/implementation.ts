/**
 * Observer Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Loose coupling between subject and observers
 * 2. Standard interfaces for both subject and observers
 * 3. Easy to add new observer types
 * 4. Dynamic registration and removal of observers at runtime
 * 5. Better testability with interfaces and dependency injection
 */
import { logger, LogColor } from '~/utils/logger';

// Observer interface that all concrete observers will implement
export interface Observer {
    update(temperature: number, humidity: number, pressure: number): void;
}

// Subject interface that defines operations for managing observers
export interface Subject {
    registerObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
}

// Concrete subject implementation
export class WeatherStation implements Subject {
    private observers: Observer[] = [];
    private temperature: number = 0;
    private humidity: number = 0;
    private pressure: number = 0;

    public registerObserver(observer: Observer): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.temperature, this.humidity, this.pressure);
        }
    }

    // Method to update measurements and notify observers
    public setMeasurements(temperature: number, humidity: number, pressure: number): void {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        this.notifyObservers();
    }

    // Getter methods for testing and accessing current weather state
    public getTemperature(): number {
        return this.temperature;
    }

    public getHumidity(): number {
        return this.humidity;
    }

    public getPressure(): number {
        return this.pressure;
    }
}

// Concrete observer implementations
export class PhoneDisplay implements Observer {
    private weatherStation: WeatherStation;

    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        this.weatherStation.registerObserver(this);
    }

    public update(temperature: number, humidity: number, pressure: number): void {
        logger.log(
            `Phone Display: Temperature ${temperature}°C, Humidity ${humidity}%, Pressure ${pressure} hPa`,
            LogColor.PHONE_DISPLAY,
        );
    }

    // Method to unsubscribe from updates
    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}

export class WebDisplay implements Observer {
    private weatherStation: WeatherStation;

    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        this.weatherStation.registerObserver(this);
    }

    public update(temperature: number, humidity: number, pressure: number): void {
        logger.log(
            `Web Display: Weather update - Temp: ${temperature}°C, Humidity: ${humidity}%, Pressure ${pressure} hPa`,
            LogColor.WEB_DISPLAY,
        );
    }

    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}

export class SmartHomeSystem implements Observer {
    private weatherStation: WeatherStation;

    constructor(weatherStation: WeatherStation) {
        this.weatherStation = weatherStation;
        this.weatherStation.registerObserver(this);
    }

    public update(temperature: number, humidity: number): void {
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

    public unsubscribe(): void {
        this.weatherStation.removeObserver(this);
    }
}
