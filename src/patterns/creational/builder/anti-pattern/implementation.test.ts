import {
    Computer,
    createOfficeComputer,
    createGamingComputer,
    createServerComputer,
    createCustomComputer,
} from './implementation';

describe('Builder Pattern - Anti-Pattern', () => {
    test('should create an office computer with correct specifications', () => {
        const computer = createOfficeComputer();
        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Intel i3');
        expect(specs.ram).toBe(8);
        expect(specs.storage).toBe(256);
        expect(specs.gpu).toBe('Integrated Graphics');
        expect(specs.hasWifi).toBe(true);
        expect(specs.hasBluetooth).toBe(true);
        expect(specs.monitor).toBe('');
    });

    test('should create a gaming computer with correct specifications', () => {
        const computer = createGamingComputer();
        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('AMD Ryzen 9');
        expect(specs.ram).toBe(32);
        expect(specs.storage).toBe(1000);
        expect(specs.gpu).toBe('NVIDIA RTX 3080');
        expect(specs.hasWifi).toBe(true);
        expect(specs.hasBluetooth).toBe(true);
        expect(specs.monitor).toBe('27" 4K Gaming Monitor');
    });

    test('should create a server computer with correct specifications', () => {
        const computer = createServerComputer();
        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Intel Xeon');
        expect(specs.ram).toBe(64);
        expect(specs.storage).toBe(2000);
        expect(specs.gpu).toBe('Server Graphics');
        expect(specs.hasWifi).toBe(false);
        expect(specs.hasBluetooth).toBe(false);
        expect(specs.monitor).toBe('');
    });

    test('should create a custom computer with provided parameters', () => {
        const computer = createCustomComputer(
            'Custom CPU',
            16,
            512,
            'Custom GPU',
            true,
            false,
            'Custom Monitor',
        );

        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Custom CPU');
        expect(specs.ram).toBe(16);
        expect(specs.storage).toBe(512);
        expect(specs.gpu).toBe('Custom GPU');
        expect(specs.hasWifi).toBe(true);
        expect(specs.hasBluetooth).toBe(false);
        expect(specs.monitor).toBe('Custom Monitor');
    });

    test('should create a computer directly with constructor', () => {
        // Direct construction requires knowing all parameters in correct order
        const computer = new Computer('Direct CPU', 4, 128, 'Basic GPU', false, false, '');
        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Direct CPU');
        expect(specs.ram).toBe(4);
        expect(specs.storage).toBe(128);
        expect(specs.gpu).toBe('Basic GPU');
        expect(specs.hasWifi).toBe(false);
        expect(specs.hasBluetooth).toBe(false);
        expect(specs.monitor).toBe('');
    });
});
