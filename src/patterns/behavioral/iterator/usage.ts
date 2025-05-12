/**
 * Iterator Pattern Usage Example
 *
 * This file demonstrates how to use the Iterator pattern in a real application scenario.
 * A common use case is when you need to provide a uniform way to access elements
 * in different types of collections without exposing their internal structure.
 */
import { logger, LogColor } from '~/utils/logger';

// Define the iterator interface
export interface Iterator<T> {
    hasNext(): boolean;
    next(): T;
    reset(): void;
}

// Define the collection interface that provides iterators
export interface Iterable<T> {
    createIterator(): Iterator<T>;
}

// Example of a domain model - Product in an e-commerce system
export class Product {
    constructor(
        public id: string,
        public name: string,
        public category: string,
        public price: number,
    ) {}

    toString(): string {
        return `${this.name} ($${this.price.toFixed(2)}) - ${this.category}`;
    }
}

// Different collections that store products

// Array-based product catalog
export class ProductCatalog implements Iterable<Product> {
    private products: Product[] = [];

    addProduct(product: Product): void {
        this.products.push(product);
    }

    createIterator(): Iterator<Product> {
        return new ProductIterator(this.products);
    }

    // For filtered views without changing the collection
    createFilteredIterator(category: string): Iterator<Product> {
        return new FilteredProductIterator(this.products, category);
    }
}

// Iterator for the product catalog
export class ProductIterator implements Iterator<Product> {
    private position: number = 0;

    constructor(private products: Product[]) {}

    hasNext(): boolean {
        return this.position < this.products.length;
    }

    next(): Product {
        if (!this.hasNext()) {
            throw new Error('No more products in the catalog');
        }

        return this.products[this.position++];
    }

    reset(): void {
        this.position = 0;
    }
}

// Specialized iterator that filters by category
export class FilteredProductIterator implements Iterator<Product> {
    private position: number = 0;
    private filteredProducts: Product[];

    constructor(products: Product[], category: string) {
        this.filteredProducts = products.filter((product) => product.category === category);
    }

    hasNext(): boolean {
        return this.position < this.filteredProducts.length;
    }

    next(): Product {
        if (!this.hasNext()) {
            throw new Error('No more products in this category');
        }

        return this.filteredProducts[this.position++];
    }

    reset(): void {
        this.position = 0;
    }
}

// UI for displaying products
class ProductUI {
    static displayProducts(iterator: Iterator<Product>, title: string): void {
        logger.log(`\n${title}:`, LogColor.INFO);

        if (!iterator.hasNext()) {
            logger.log('  No products found', LogColor.WARNING);
            return;
        }

        let count = 1;
        while (iterator.hasNext()) {
            const product = iterator.next();
            logger.log(`  ${count++}. ${product.toString()}`, LogColor.INFO);
        }
    }

    static displayProductsByPriceRange(
        iterator: Iterator<Product>,
        min: number,
        max: number,
    ): void {
        logger.log(`\nProducts between $${min} and $${max}:`, LogColor.INFO);

        iterator.reset(); // Ensure we start from the beginning
        let count = 1;
        let found = false;

        while (iterator.hasNext()) {
            const product = iterator.next();
            if (product.price >= min && product.price <= max) {
                logger.log(`  ${count++}. ${product.toString()}`, LogColor.INFO);
                found = true;
            }
        }

        if (!found) {
            logger.log(`  No products found in the price range $${min}-$${max}`, LogColor.WARNING);
        }
    }
}

// Shopping cart using a different collection type
export class ShoppingCart implements Iterable<{ product: Product; quantity: number }> {
    private items: Map<string, { product: Product; quantity: number }> = new Map();

    addItem(product: Product, quantity: number = 1): void {
        const existingItem = this.items.get(product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.set(product.id, { product, quantity });
        }
    }

    removeItem(productId: string): void {
        this.items.delete(productId);
    }

    createIterator(): Iterator<{ product: Product; quantity: number }> {
        return new ShoppingCartIterator(this.items);
    }

    getTotal(): number {
        let total = 0;
        const iterator = this.createIterator();

        while (iterator.hasNext()) {
            const { product, quantity } = iterator.next();
            total += product.price * quantity;
        }

        return total;
    }
}

// Iterator for shopping cart
export class ShoppingCartIterator implements Iterator<{ product: Product; quantity: number }> {
    private keys: string[];
    private position: number = 0;

    constructor(private items: Map<string, { product: Product; quantity: number }>) {
        this.keys = Array.from(items.keys());
    }

    hasNext(): boolean {
        return this.position < this.keys.length;
    }

    next(): { product: Product; quantity: number } {
        if (!this.hasNext()) {
            throw new Error('No more items in the cart');
        }

        const key = this.keys[this.position++];
        return this.items.get(key)!;
    }

    reset(): void {
        this.position = 0;
    }
}

// Checkout process
export class CheckoutProcess {
    static processCart(cart: ShoppingCart): void {
        logger.log('\nShopping Cart Contents:', LogColor.INFO);

        const iterator = cart.createIterator();
        let itemNumber = 1;

        if (!iterator.hasNext()) {
            logger.log('  Cart is empty', LogColor.WARNING);
            return;
        }

        while (iterator.hasNext()) {
            const { product, quantity } = iterator.next();
            logger.log(
                `  ${itemNumber++}. ${product.toString()} x ${quantity} = $${(product.price * quantity).toFixed(2)}`,
                LogColor.INFO,
            );
        }

        logger.log(`\nTotal: $${cart.getTotal().toFixed(2)}`, LogColor.SUCCESS);
    }
}

// Usage demonstration
export function runIteratorUsageExample(): void {
    logger.info('=== Iterator Pattern Usage Example ===\n');

    // Create product catalog
    const catalog = new ProductCatalog();

    // Add sample products
    catalog.addProduct(new Product('p1', 'Laptop', 'Electronics', 999.99));
    catalog.addProduct(new Product('p2', 'Smartphone', 'Electronics', 699.99));
    catalog.addProduct(new Product('p3', 'Headphones', 'Electronics', 149.99));
    catalog.addProduct(new Product('p4', 'T-shirt', 'Clothing', 29.99));
    catalog.addProduct(new Product('p5', 'Jeans', 'Clothing', 59.99));
    catalog.addProduct(new Product('p6', 'Coffee Maker', 'Home', 89.99));
    catalog.addProduct(new Product('p7', 'Blender', 'Home', 49.99));

    // Display all products using an iterator
    const allProductsIterator = catalog.createIterator();
    ProductUI.displayProducts(allProductsIterator, 'All Products');

    // Display filtered products by category using a specialized iterator
    const electronicsIterator = catalog.createFilteredIterator('Electronics');
    ProductUI.displayProducts(electronicsIterator, 'Electronics Products');

    const clothingIterator = catalog.createFilteredIterator('Clothing');
    ProductUI.displayProducts(clothingIterator, 'Clothing Products');

    // Filter products by price range using the same iterator
    const allProductsIterator2 = catalog.createIterator();
    ProductUI.displayProductsByPriceRange(allProductsIterator2, 50, 200);

    // Create a shopping cart
    const cart = new ShoppingCart();

    // Add products to cart
    const allProductsIterator3 = catalog.createIterator();

    // Add the laptop and headphones to cart
    while (allProductsIterator3.hasNext()) {
        const product = allProductsIterator3.next();
        if (product.id === 'p1' || product.id === 'p3') {
            cart.addItem(product);
            logger.log(`Added ${product.name} to cart`, LogColor.SUCCESS);
        }
    }

    // Add another headphone
    const allProductsIterator4 = catalog.createIterator();
    while (allProductsIterator4.hasNext()) {
        const product = allProductsIterator4.next();
        if (product.id === 'p3') {
            cart.addItem(product);
            logger.log(`Added another ${product.name} to cart`, LogColor.SUCCESS);
            break;
        }
    }

    // Process checkout
    CheckoutProcess.processCart(cart);

    logger.info('\n=== End of Iterator Pattern Usage Example ===');
}
