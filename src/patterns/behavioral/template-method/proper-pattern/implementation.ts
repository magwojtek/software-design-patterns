/**
 * Template Method Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Eliminates code duplication by centralizing common algorithm steps
 * 2. Standardizes the algorithm structure across all implementations
 * 3. Allows subclasses to override only the steps they need to customize
 * 4. Changes to the algorithm structure only need to be made in one place
 * 5. Enforces consistency while allowing for variations
 */

// Abstract class defining the template method and algorithm skeleton
export abstract class BeverageMaker {
    public outputs: string[] = [];

    // The template method defines the algorithm skeleton
    public prepareBeverage(): void {
        this.outputs = [];
        this.outputs.push(`Starting to make ${this.getBeverageName()}...`);

        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();

        this.outputs.push(`${this.getBeverageName()} ready!`);
    }

    // These methods are implemented in the abstract class (common steps)
    protected boilWater(): void {
        this.outputs.push('Boiling water');
    }

    protected pourInCup(): void {
        this.outputs.push(`Pouring ${this.getBeverageName().toLowerCase()} into cup`);
    }

    // These methods must be implemented by subclasses (customized steps)
    protected abstract brew(): void;
    protected abstract addCondiments(): void;
    protected abstract getBeverageName(): string;
}

// Concrete implementation for coffee
export class CoffeeMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Brewing coffee grounds in boiling water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding sugar and milk');
    }

    protected getBeverageName(): string {
        return 'Coffee';
    }
}

// Concrete implementation for espresso
export class EspressoMaker extends BeverageMaker {
    // Override a common step to customize it
    protected boilWater(): void {
        this.outputs.push('Boiling water to exact temperature for espresso');
    }

    protected brew(): void {
        this.outputs.push('Grinding coffee beans very finely');
        this.outputs.push('Brewing coffee grounds under high pressure');
    }

    protected addCondiments(): void {
        // Espresso typically doesn't have condiments
        // This is an example of a "hook" - an empty implementation that subclasses can override
    }

    protected getBeverageName(): string {
        return 'Espresso';
    }
}

// Concrete implementation for tea
export class TeaMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Steeping tea in boiling water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding lemon');
    }

    protected getBeverageName(): string {
        return 'Tea';
    }
}

// Concrete implementation for hot chocolate
export class HotChocolateMaker extends BeverageMaker {
    protected brew(): void {
        this.outputs.push('Dissolving chocolate powder in hot water');
    }

    protected addCondiments(): void {
        this.outputs.push('Adding whipped cream and marshmallows');
    }

    protected getBeverageName(): string {
        return 'Hot Chocolate';
    }
}
