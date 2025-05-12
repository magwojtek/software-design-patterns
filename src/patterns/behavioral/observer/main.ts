/**
 * Observer Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Observer pattern.
 */
import { WeatherStation as AntiPatternStation } from './anti-pattern/implementation';
import {
    WeatherStation as ProperPatternStation,
    PhoneDisplay,
    WebDisplay,
    SmartHomeSystem,
    Observer,
} from './proper-pattern/implementation';
import { logger, LogColor } from '~/utils/logger';

logger.info('=== Observer Pattern Example ===\n');

// Anti-pattern demonstration
logger.warn('--- Anti-pattern Example ---');
logger.info('Creating weather station with hardcoded observers:');
const antiPatternStation = new AntiPatternStation();
logger.info('Setting measurements to trigger updates:');
antiPatternStation.setMeasurements(28, 65, 1013);

logger.warn('\nProblem: Cannot add or remove observers at runtime');
logger.warn('Problem: Cannot use different types of observers without modifying WeatherStation');
logger.warn('Problem: Hard to test due to tight coupling between subject and observers\n');

// Proper pattern demonstration
logger.success('--- Proper Pattern Example ---');
logger.info('Creating weather station:');
const properPatternStation = new ProperPatternStation();

logger.info('\nDynamically adding observers:');
logger.log('- Adding phone display', LogColor.PHONE_DISPLAY);
const phoneDisplay = new PhoneDisplay(properPatternStation);

logger.log('- Adding web display', LogColor.WEB_DISPLAY);
const webDisplay = new WebDisplay(properPatternStation);
logger.log(`Web display registered: ${webDisplay instanceof WebDisplay}`, LogColor.WEB_DISPLAY);

logger.log('- Adding smart home system', LogColor.SMART_HOME);
const smartHome = new SmartHomeSystem(properPatternStation);
logger.log(`Smart home registered: ${smartHome instanceof SmartHomeSystem}`, LogColor.SMART_HOME);

logger.info('\nSetting measurements to trigger updates:');
properPatternStation.setMeasurements(28, 65, 1013);

logger.info('\nDynamically removing an observer:');
logger.log('- Removing phone display', LogColor.PHONE_DISPLAY);
phoneDisplay.unsubscribe();

logger.info('\nSetting new measurements (phone display should not receive update):');
properPatternStation.setMeasurements(15, 70, 1010);

logger.info('\nAdding a custom observer at runtime:');
// Create a custom observer using the Observer interface
class EmailAlertSystem implements Observer {
    update(temperature: number): void {
        if (temperature > 30 || temperature < 0) {
            logger.log(
                `Email Alert: EXTREME TEMPERATURE WARNING: ${temperature}°C`,
                LogColor.EMAIL_ALERT,
            );
        } else {
            logger.log(`Email Alert: Normal temperature: ${temperature}°C`, LogColor.EMAIL_ALERT);
        }
    }
}

const emailAlert = new EmailAlertSystem();
properPatternStation.registerObserver(emailAlert);

logger.info('\nSetting extreme temperature to trigger email alert:');
properPatternStation.setMeasurements(32, 45, 1005);

logger.success('\nBenefits:');
logger.success('1. Loose coupling between subject and observers');
logger.success('2. Add/remove observers at runtime');
logger.success('3. Easy to add new types of observers');
logger.success('4. Better testability with interfaces');

logger.info('\n=== End of Observer Pattern Example ===');
