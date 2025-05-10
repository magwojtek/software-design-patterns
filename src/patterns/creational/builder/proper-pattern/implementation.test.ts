import { StandardComputerBuilder, ComputerDirector } from './implementation';

describe('Builder Pattern - Proper Implementation', () => {
    let builder: StandardComputerBuilder;
    let director: ComputerDirector;

    beforeEach(() => {
        builder = new StandardComputerBuilder();
        director = new ComputerDirector(builder);
    });

    test('should create an office computer with correct specifications', () => {
        const computer = director.makeOfficeComputer();
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
        const computer = director.makeGamingComputer();
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
        const computer = director.makeServerComputer();
        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Intel Xeon');
        expect(specs.ram).toBe(64);
        expect(specs.storage).toBe(2000);
        expect(specs.gpu).toBe('Server Graphics');
        expect(specs.hasWifi).toBe(false);
        expect(specs.hasBluetooth).toBe(false);
        expect(specs.monitor).toBe('');
    });

    test('should be able to build a custom computer using the builder directly', () => {
        const computer = builder
            .setCpu('Custom CPU')
            .setRam(16)
            .setStorage(512)
            .setGpu('Custom GPU')
            .setWifi(true)
            .setBluetooth(false)
            .setMonitor('Custom Monitor')
            .build();

        const specs = computer.getSpecs();

        expect(specs.cpu).toBe('Custom CPU');
        expect(specs.ram).toBe(16);
        expect(specs.storage).toBe(512);
        expect(specs.gpu).toBe('Custom GPU');
        expect(specs.hasWifi).toBe(true);
        expect(specs.hasBluetooth).toBe(false);
        expect(specs.monitor).toBe('Custom Monitor');
    });

    test('should reset builder state after building a computer', () => {
        // Build first computer
        builder.setCpu('First CPU').setRam(8).build();

        // Build second computer without setting CPU and RAM again
        const secondComputer = builder.setStorage(500).build();

        const specs = secondComputer.getSpecs();

        // Ensure previous settings were reset
        expect(specs.cpu).toBe('');
        expect(specs.ram).toBe(0);
        expect(specs.storage).toBe(500);
    });
});
