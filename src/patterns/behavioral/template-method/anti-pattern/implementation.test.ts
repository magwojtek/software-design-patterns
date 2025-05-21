import { BasicCoffeeMaker, EspressoMaker, TeaMaker } from './implementation';

describe('Template Method Anti-Pattern Tests', () => {
    test('BasicCoffeeMaker prepares coffee with all steps', () => {
        const coffeeMaker = new BasicCoffeeMaker();
        coffeeMaker.makeCoffee();

        // Verify all steps were executed
        expect(coffeeMaker.outputs).toContain('Boiling water');
        expect(coffeeMaker.outputs).toContain('Brewing coffee grounds in boiling water');
        expect(coffeeMaker.outputs).toContain('Pouring coffee into cup');
        expect(coffeeMaker.outputs).toContain('Adding sugar and milk');
        expect(coffeeMaker.outputs).toContain('Basic coffee ready!');
    });

    test('EspressoMaker prepares espresso with all steps', () => {
        const espressoMaker = new EspressoMaker();
        espressoMaker.makeEspresso();

        // Verify all steps were executed
        expect(espressoMaker.outputs).toContain('Boiling water');
        expect(espressoMaker.outputs).toContain('Grinding coffee beans very finely');
        expect(espressoMaker.outputs).toContain('Brewing coffee grounds under high pressure');
        expect(espressoMaker.outputs).toContain('Pouring espresso into small cup');
        expect(espressoMaker.outputs).toContain('Espresso ready!');
    });

    test('TeaMaker prepares tea with all steps', () => {
        const teaMaker = new TeaMaker();
        teaMaker.makeTea();

        // Verify all steps were executed
        expect(teaMaker.outputs).toContain('Boiling water');
        expect(teaMaker.outputs).toContain('Steeping tea in boiling water');
        expect(teaMaker.outputs).toContain('Pouring tea into cup');
        expect(teaMaker.outputs).toContain('Adding lemon');
        expect(teaMaker.outputs).toContain('Tea ready!');
    });

    test('demonstrates problems with anti-pattern implementation', () => {
        // Problem 1: Code duplication across concrete classes
        // All three classes have similar boiling water and pouring steps

        // Problem 2: No standardized algorithm structure
        // Each class has its own method name and implementation

        // Problem 3: Hard to maintain consistent behavior
        // If we want to add a "heat cup" step to all beverages, we need to modify all classes

        // Let's try to create a new type of beverage
        class HotChocolateMaker {
            public outputs: string[] = [];

            public makeHotChocolate(): void {
                this.outputs = [];
                this.outputs.push('Starting to make hot chocolate...');

                // Boil water
                this.outputs.push('Boiling water');

                // Add chocolate powder
                this.outputs.push('Adding chocolate powder');

                // Pour in cup
                this.outputs.push('Pouring hot chocolate into cup');

                // Add whipped cream
                this.outputs.push('Adding whipped cream');

                this.outputs.push('Hot chocolate ready!');
            }
        }

        // Just creating the class for demonstration, no need to use it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hotChocolateMaker = new HotChocolateMaker();

        // Problem 4: Changes to algorithm require modifying multiple classes
        // If we want to add a "check water quality" step before boiling,
        // we would need to modify all beverage maker classes

        // Problem 5: No way to override specific steps while keeping the overall algorithm
        // Each class implements the entire algorithm from scratch
    });
});
