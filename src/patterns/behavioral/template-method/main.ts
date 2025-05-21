/**
 * Template Method Pattern Example Runner
 *
 * This script demonstrates the difference between the anti-pattern and
 * proper implementation of the Template Method pattern.
 */
import { BasicCoffeeMaker, EspressoMaker, TeaMaker } from './anti-pattern/implementation';
import {
    CoffeeMaker,
    EspressoMaker as ProperEspressoMaker,
    TeaMaker as ProperTeaMaker,
    HotChocolateMaker,
} from './proper-pattern/implementation';

import { logger } from '~/utils/logger';

logger.info('=== Template Method Pattern Example ===\n');

/**
 * Demonstrates the anti-pattern implementation of the Template Method pattern
 * with duplicated code and no standardized algorithm structure.
 */
function demonstrateAntiPattern(): void {
    logger.info('--- Anti-pattern Example ---');
    logger.info('Creating different beverage makers');

    const coffeeMaker = new BasicCoffeeMaker();
    const espressoMaker = new EspressoMaker();
    const teaMaker = new TeaMaker();

    logger.info('\nMaking basic coffee:');
    coffeeMaker.makeCoffee();

    logger.info('\nMaking espresso:');
    espressoMaker.makeEspresso();

    logger.info('\nMaking tea:');
    teaMaker.makeTea();

    logger.info('\nProblems:');
    logger.warn('1. Code duplication across concrete classes');
    logger.warn('2. No standardized algorithm structure');
    logger.warn('3. Hard to maintain consistent behavior across implementations');
    logger.warn('4. Changes to algorithm steps require modifying multiple classes');
    logger.warn('5. No way to override specific steps while keeping the overall algorithm\n');
}

/**
 * Demonstrates the proper implementation of the Template Method pattern
 * with a standardized algorithm structure and customization points.
 */
function demonstrateProperPattern(): void {
    logger.info('--- Proper Pattern Example ---');
    logger.info('Creating different beverage makers:');

    const coffeeMaker = new CoffeeMaker();
    const espressoMaker = new ProperEspressoMaker();
    const teaMaker = new ProperTeaMaker();
    const hotChocolateMaker = new HotChocolateMaker();

    logger.info('\nMaking coffee using template method:');
    coffeeMaker.prepareBeverage();

    logger.info('\nMaking espresso using template method:');
    espressoMaker.prepareBeverage();

    logger.info('\nMaking tea using template method:');
    teaMaker.prepareBeverage();

    logger.info('\nMaking hot chocolate using template method:');
    hotChocolateMaker.prepareBeverage();

    logger.info('\nCreating a new beverage type at runtime:');

    // Define a new beverage type by extending the abstract class
    class GreenTeaMaker extends ProperTeaMaker {
        protected brew(): void {
            this.outputs.push('Steeping green tea leaves at 80°C (not boiling)');
        }

        // Override the boiling method to use lower temperature
        protected boilWater(): void {
            this.outputs.push('Heating water to 80°C (not boiling)');
        }

        protected addCondiments(): void {
            this.outputs.push('Adding honey');
        }

        protected getBeverageName(): string {
            return 'Green Tea';
        }
    }

    const greenTeaMaker = new GreenTeaMaker();
    logger.info('\nMaking green tea using template method:');
    greenTeaMaker.prepareBeverage();

    logger.info('\nBenefits:');
    logger.success('1. Eliminates code duplication by centralizing common algorithm steps');
    logger.success('2. Standardizes the algorithm structure across all implementations');
    logger.success('3. Allows subclasses to override only the steps they need to customize');
    logger.success('4. Changes to the algorithm structure only need to be made in one place');
    logger.success('5. Enforces consistency while allowing for variations');
}

// Run the demonstrations
demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== End of Template Method Pattern Example ===');
