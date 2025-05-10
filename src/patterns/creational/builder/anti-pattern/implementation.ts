/**
 * Builder Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Complex object construction mixed with business logic
 * 2. No clear separation between construction steps
 * 3. Hard to create different representations of the object
 * 4. Difficult to extend with new construction variations
 */

// Computer class with complex construction logic built into it
export class Computer {
    private cpu: string;
    private ram: number;
    private storage: number;
    private gpu: string;
    private hasWifi: boolean;
    private hasBluetooth: boolean;
    private monitor: string;

    constructor(
        cpu: string = '',
        ram: number = 0,
        storage: number = 0,
        gpu: string = '',
        hasWifi: boolean = false,
        hasBluetooth: boolean = false,
        monitor: string = '',
    ) {
        this.cpu = cpu;
        this.ram = ram;
        this.storage = storage;
        this.gpu = gpu;
        this.hasWifi = hasWifi;
        this.hasBluetooth = hasBluetooth;
        this.monitor = monitor;
    }

    public toString(): string {
        return (
            `Computer with:\n` +
            `- CPU: ${this.cpu}\n` +
            `- RAM: ${this.ram}GB\n` +
            `- Storage: ${this.storage}GB\n` +
            `- GPU: ${this.gpu}\n` +
            `- WiFi: ${this.hasWifi ? 'Yes' : 'No'}\n` +
            `- Bluetooth: ${this.hasBluetooth ? 'Yes' : 'No'}\n` +
            `- Monitor: ${this.monitor || 'None'}`
        );
    }

    public getSpecs(): {
        cpu: string;
        ram: number;
        storage: number;
        gpu: string;
        hasWifi: boolean;
        hasBluetooth: boolean;
        monitor: string;
    } {
        return {
            cpu: this.cpu,
            ram: this.ram,
            storage: this.storage,
            gpu: this.gpu,
            hasWifi: this.hasWifi,
            hasBluetooth: this.hasBluetooth,
            monitor: this.monitor,
        };
    }
}

// Different methods for creating different types of computers
// These functions mix object creation with business logic

export function createOfficeComputer(): Computer {
    // Directly constructing the computer with a large parameter list
    return new Computer(
        'Intel i3', // CPU
        8, // RAM
        256, // Storage
        'Integrated Graphics', // GPU
        true, // WiFi
        true, // Bluetooth
        '', // No monitor
    );
}

export function createGamingComputer(): Computer {
    return new Computer(
        'AMD Ryzen 9',
        32,
        1000,
        'NVIDIA RTX 3080',
        true,
        true,
        '27" 4K Gaming Monitor',
    );
}

export function createServerComputer(): Computer {
    return new Computer('Intel Xeon', 64, 2000, 'Server Graphics', false, false, '');
}

// Client code has to directly construct objects with all parameters at once
// or use one of the predefined configuration functions
export function createCustomComputer(
    cpu: string,
    ram: number,
    storage: number,
    gpu: string,
    hasWifi: boolean,
    hasBluetooth: boolean,
    monitor: string,
): Computer {
    return new Computer(cpu, ram, storage, gpu, hasWifi, hasBluetooth, monitor);
}
