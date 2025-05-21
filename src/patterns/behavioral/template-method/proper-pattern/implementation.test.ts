import {
    BeverageMaker,
    CoffeeMaker,
    EspressoMaker,
    TeaMaker,
    HotChocolateMaker,
} from './implementation';

describe('Template Method Proper Pattern Tests', () => {
    test('CoffeeMaker follows the template method algorithm', () => {
        const coffeeMaker = new CoffeeMaker();
        coffeeMaker.prepareBeverage();

        // Verify all steps were executed in the correct order
        const outputs = coffeeMaker.outputs;

        expect(outputs).toContain('Starting to make Coffee...');
        expect(outputs.indexOf('Boiling water')).toBeLessThan(
            outputs.indexOf('Brewing coffee grounds in boiling water'),
        );
        expect(outputs.indexOf('Brewing coffee grounds in boiling water')).toBeLessThan(
            outputs.indexOf('Pouring coffee into cup'),
        );
        expect(outputs.indexOf('Pouring coffee into cup')).toBeLessThan(
            outputs.indexOf('Adding sugar and milk'),
        );
        expect(outputs.indexOf('Adding sugar and milk')).toBeLessThan(
            outputs.indexOf('Coffee ready!'),
        );
    });

    test('EspressoMaker customizes the boiling step', () => {
        const espressoMaker = new EspressoMaker();
        espressoMaker.prepareBeverage();

        // Verify the customized boiling step
        expect(espressoMaker.outputs).toContain('Boiling water to exact temperature for espresso');

        // Verify espresso-specific brewing steps
        expect(espressoMaker.outputs).toContain('Grinding coffee beans very finely');
        expect(espressoMaker.outputs).toContain('Brewing coffee grounds under high pressure');

        // Verify the standard steps
        expect(espressoMaker.outputs).toContain('Pouring espresso into cup');
        expect(espressoMaker.outputs).toContain('Espresso ready!');
    });

    test('TeaMaker follows the template method algorithm', () => {
        const teaMaker = new TeaMaker();
        teaMaker.prepareBeverage();

        // Verify all steps were executed
        expect(teaMaker.outputs).toContain('Starting to make Tea...');
        expect(teaMaker.outputs).toContain('Boiling water');
        expect(teaMaker.outputs).toContain('Steeping tea in boiling water');
        expect(teaMaker.outputs).toContain('Pouring tea into cup');
        expect(teaMaker.outputs).toContain('Adding lemon');
        expect(teaMaker.outputs).toContain('Tea ready!');
    });

    test('HotChocolateMaker follows the template method algorithm', () => {
        const hotChocolateMaker = new HotChocolateMaker();
        hotChocolateMaker.prepareBeverage();

        // Verify all steps were executed
        expect(hotChocolateMaker.outputs).toContain('Starting to make Hot Chocolate...');
        expect(hotChocolateMaker.outputs).toContain('Boiling water');
        expect(hotChocolateMaker.outputs).toContain('Dissolving chocolate powder in hot water');
        expect(hotChocolateMaker.outputs).toContain('Pouring hot chocolate into cup');
        expect(hotChocolateMaker.outputs).toContain('Adding whipped cream and marshmallows');
        expect(hotChocolateMaker.outputs).toContain('Hot Chocolate ready!');
    });

    test('demonstrates extending the pattern with a new beverage type', () => {
        // Create a new beverage type by extending the abstract class
        class GreenTeaMaker extends BeverageMaker {
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
        greenTeaMaker.prepareBeverage();

        // Verify the custom implementation
        expect(greenTeaMaker.outputs).toContain('Heating water to 80°C (not boiling)');
        expect(greenTeaMaker.outputs).toContain('Steeping green tea leaves at 80°C (not boiling)');
        expect(greenTeaMaker.outputs).toContain('Adding honey');
    });

    test('demonstrates benefits of the template method pattern', () => {
        // Benefit 1: Code reuse - common steps are defined once in the abstract class
        // Benefit 2: Customization points - subclasses only override what they need to
        // Benefit 3: Consistent algorithm structure across all implementations

        // Create a mock to demonstrate hooks and customization
        abstract class MockBeverageMaker extends BeverageMaker {
            public hookCalled = false;

            // Override a hook method to track if it was called
            protected addCondiments(): void {
                this.hookCalled = true;
            }

            protected abstract brew(): void;
            protected abstract getBeverageName(): string;
        }

        class MockConcreteBeverage extends MockBeverageMaker {
            protected brew(): void {
                // Simple implementation for testing
            }

            protected getBeverageName(): string {
                return 'Mock';
            }
        }

        const mockBeverage = new MockConcreteBeverage();
        mockBeverage.prepareBeverage();

        // Verify the hook method was called as part of the template method
        expect(mockBeverage.hookCalled).toBe(true);
    });
});
