/**
 * Tests for iterator pattern usage example
 */
import { runIteratorUsageExample } from './usage';
import { setupLoggerMock } from '~/__tests__/fixtures';

// Mock the logger to prevent console output during tests
setupLoggerMock();

describe('Iterator Pattern Usage Example', () => {
    // Extract classes from usage.ts for testing
    const usageModule = jest.requireActual('./usage');
    const Product = usageModule.Product;
    const ProductCatalog = usageModule.ProductCatalog;
    const ProductIterator = usageModule.ProductIterator;
    const FilteredProductIterator = usageModule.FilteredProductIterator;
    const ShoppingCart = usageModule.ShoppingCart;

    // Test Product class
    describe('Product class', () => {
        test('should create a product with correct properties', () => {
            const product = new Product('p1', 'Laptop', 'Electronics', 999.99);
            expect(product.id).toBe('p1');
            expect(product.name).toBe('Laptop');
            expect(product.category).toBe('Electronics');
            expect(product.price).toBe(999.99);
        });

        test('toString should return formatted product information', () => {
            const product = new Product('p1', 'Laptop', 'Electronics', 999.99);
            expect(product.toString()).toBe('Laptop ($999.99) - Electronics');
        });
    });

    // Test ProductCatalog
    describe('ProductCatalog', () => {
        let catalog: typeof ProductCatalog.prototype;
        let laptop: typeof Product.prototype;
        let phone: typeof Product.prototype;

        beforeEach(() => {
            catalog = new ProductCatalog();
            laptop = new Product('p1', 'Laptop', 'Electronics', 999.99);
            phone = new Product('p2', 'Smartphone', 'Electronics', 699.99);
            catalog.addProduct(laptop);
            catalog.addProduct(phone);
        });

        test('should add products to the catalog', () => {
            // We test this by using an iterator to count products
            const iterator = catalog.createIterator();
            let count = 0;
            while (iterator.hasNext()) {
                iterator.next();
                count++;
            }
            expect(count).toBe(2);
        });

        test('createIterator should return a ProductIterator', () => {
            const iterator = catalog.createIterator();
            expect(iterator).toBeInstanceOf(ProductIterator);
        });

        test('createFilteredIterator should return a FilteredProductIterator', () => {
            const iterator = catalog.createFilteredIterator('Electronics');
            expect(iterator).toBeInstanceOf(FilteredProductIterator);
        });
    });

    // Test ProductIterator
    describe('ProductIterator', () => {
        let products: (typeof Product.prototype)[];
        let iterator: typeof ProductIterator.prototype;

        beforeEach(() => {
            products = [
                new Product('p1', 'Laptop', 'Electronics', 999.99),
                new Product('p2', 'Smartphone', 'Electronics', 699.99),
            ];
            iterator = new ProductIterator(products);
        });

        test('hasNext should return true when there are more products', () => {
            expect(iterator.hasNext()).toBe(true);
        });

        test('next should return products in sequence', () => {
            expect(iterator.next()).toBe(products[0]);
            expect(iterator.next()).toBe(products[1]);
            expect(iterator.hasNext()).toBe(false);
        });

        test('reset should restart the iterator', () => {
            iterator.next();
            iterator.reset();
            expect(iterator.next()).toBe(products[0]);
        });
    });

    // Test FilteredProductIterator
    describe('FilteredProductIterator', () => {
        let products: (typeof Product.prototype)[];
        let electronicsIterator: typeof FilteredProductIterator.prototype;
        let clothingIterator: typeof FilteredProductIterator.prototype;

        beforeEach(() => {
            products = [
                new Product('p1', 'Laptop', 'Electronics', 999.99),
                new Product('p2', 'T-shirt', 'Clothing', 29.99),
                new Product('p3', 'Smartphone', 'Electronics', 699.99),
            ];
            electronicsIterator = new FilteredProductIterator(products, 'Electronics');
            clothingIterator = new FilteredProductIterator(products, 'Clothing');
        });

        test('should filter products by category', () => {
            // Check electronics
            const electronicsProducts: (typeof Product.prototype)[] = [];
            while (electronicsIterator.hasNext()) {
                electronicsProducts.push(electronicsIterator.next());
            }
            expect(electronicsProducts.length).toBe(2);
            expect(electronicsProducts[0].name).toBe('Laptop');
            expect(electronicsProducts[1].name).toBe('Smartphone');

            // Check clothing
            const clothingProducts: (typeof Product.prototype)[] = [];
            while (clothingIterator.hasNext()) {
                clothingProducts.push(clothingIterator.next());
            }
            expect(clothingProducts.length).toBe(1);
            expect(clothingProducts[0].name).toBe('T-shirt');
        });
    });

    // Test ShoppingCart
    describe('ShoppingCart', () => {
        let cart: typeof ShoppingCart.prototype;
        let laptop: typeof Product.prototype;
        let phone: typeof Product.prototype;

        beforeEach(() => {
            cart = new ShoppingCart();
            laptop = new Product('p1', 'Laptop', 'Electronics', 999.99);
            phone = new Product('p2', 'Smartphone', 'Electronics', 699.99);
        });

        test('should add items to cart', () => {
            cart.addItem(laptop);
            cart.addItem(phone, 2);

            const iterator = cart.createIterator();
            const items = [];
            while (iterator.hasNext()) {
                items.push(iterator.next());
            }

            expect(items.length).toBe(2);
            expect(items[0].product).toBe(laptop);
            expect(items[0].quantity).toBe(1);
            expect(items[1].product).toBe(phone);
            expect(items[1].quantity).toBe(2);
        });

        test('should update quantity when adding same item', () => {
            cart.addItem(laptop);
            cart.addItem(laptop);

            const iterator = cart.createIterator();
            const item = iterator.next();
            expect(item.quantity).toBe(2);
        });

        test('should remove item from cart', () => {
            cart.addItem(laptop);
            cart.addItem(phone);
            cart.removeItem(laptop.id);

            const iterator = cart.createIterator();
            const items = [];
            while (iterator.hasNext()) {
                items.push(iterator.next());
            }

            expect(items.length).toBe(1);
            expect(items[0].product).toBe(phone);
        });

        test('should calculate total correctly', () => {
            cart.addItem(laptop);
            cart.addItem(phone, 2);

            // 999.99 + (699.99 * 2) = 2399.97
            expect(cart.getTotal()).toBeCloseTo(2399.97);
        });
    });

    // Test the runIteratorUsageExample function
    test('runIteratorUsageExample should execute without errors', () => {
        expect(() => runIteratorUsageExample()).not.toThrow();
    });
});
