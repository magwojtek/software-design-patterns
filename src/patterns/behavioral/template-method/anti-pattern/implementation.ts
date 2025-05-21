/**
 * Template Method Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Code duplication across concrete classes
 * 2. No standardized algorithm structure
 * 3. Hard to maintain consistent behavior across implementations
 * 4. Changes to algorithm steps require modifying multiple classes
 * 5. No way to override specific steps while keeping the overall algorithm structure
 */

export class BasicCoffeeMaker {
    public outputs: string[] = [];
    public makeCoffee(): void {
        this.outputs = [];
        this.outputs.push('Starting to make basic coffee...');

        // Boil water
        this.outputs.push('Boiling water');

        // Brew coffee grounds
        this.outputs.push('Brewing coffee grounds in boiling water');

        // Pour in cup
        this.outputs.push('Pouring coffee into cup');

        // Add sugar and milk
        this.outputs.push('Adding sugar and milk');

        this.outputs.push('Basic coffee ready!');
    }
}

export class EspressoMaker {
    public outputs: string[] = [];
    public makeEspresso(): void {
        this.outputs = [];
        this.outputs.push('Starting to make espresso...');

        // Boil water
        this.outputs.push('Boiling water');

        // Grind beans finely
        this.outputs.push('Grinding coffee beans very finely');

        // Brew coffee grounds under pressure
        this.outputs.push('Brewing coffee grounds under high pressure');

        // Pour in small cup
        this.outputs.push('Pouring espresso into small cup');

        this.outputs.push('Espresso ready!');
    }
}

export class TeaMaker {
    public outputs: string[] = [];
    public makeTea(): void {
        this.outputs = [];
        this.outputs.push('Starting to make tea...');

        // Boil water
        this.outputs.push('Boiling water');

        // Steep tea
        this.outputs.push('Steeping tea in boiling water');

        // Pour in cup
        this.outputs.push('Pouring tea into cup');

        // Add lemon
        this.outputs.push('Adding lemon');

        this.outputs.push('Tea ready!');
    }
}
