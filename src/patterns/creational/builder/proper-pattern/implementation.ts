/**
 * Builder Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Separates complex object construction from its representation
 * 2. Allows step-by-step creation with flexible construction process
 * 3. Same construction code can create different representations
 * 4. Encapsulates details of object construction
 */

// Define enum types for computer components
export enum CpuType {
    INTEL_I3 = 'Intel i3',
    INTEL_I5 = 'Intel i5',
    INTEL_I7 = 'Intel i7',
    INTEL_I9 = 'Intel i9',
    INTEL_XEON = 'Intel Xeon',
    AMD_RYZEN_5 = 'AMD Ryzen 5',
    AMD_RYZEN_7 = 'AMD Ryzen 7',
    AMD_RYZEN_9 = 'AMD Ryzen 9',
    SERVER = 'Server CPU',
}

export enum GpuType {
    INTEGRATED = 'Integrated Graphics',
    NVIDIA_GTX_1660 = 'NVIDIA GTX 1660',
    NVIDIA_RTX_3060 = 'NVIDIA RTX 3060',
    NVIDIA_RTX_3070 = 'NVIDIA RTX 3070',
    NVIDIA_RTX_3080 = 'NVIDIA RTX 3080',
    AMD_RADEON = 'AMD Radeon',
    SERVER = 'Server Graphics',
}

export enum MonitorType {
    NONE = '',
    STANDARD_24 = '24" Monitor',
    GAMING_27_4K = '27" 4K Gaming Monitor',
    ULTRAWIDE = '34" Ultrawide Monitor',
    DUAL = 'Dual Monitor Setup',
}

// Product: The complex object being built
export class Computer {
    private cpu: string = '';
    private ram: number = 0;
    private storage: number = 0;
    private gpu: string = '';
    private hasWifi: boolean = false;
    private hasBluetooth: boolean = false;
    private monitor: string = '';

    public setCpu(cpu: CpuType | string): void {
        this.cpu = cpu;
    }

    public setRam(ram: number): void {
        this.ram = ram;
    }

    public setStorage(storage: number): void {
        this.storage = storage;
    }

    public setGpu(gpu: GpuType | string): void {
        this.gpu = gpu;
    }

    public setWifi(hasWifi: boolean): void {
        this.hasWifi = hasWifi;
    }

    public setBluetooth(hasBluetooth: boolean): void {
        this.hasBluetooth = hasBluetooth;
    }

    public setMonitor(monitor: MonitorType | string): void {
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

// Builder interface: Defines all possible construction steps
export interface ComputerBuilder {
    reset(): void;
    setCpu(cpu: CpuType | string): ComputerBuilder;
    setRam(ram: number): ComputerBuilder;
    setStorage(storage: number): ComputerBuilder;
    setGpu(gpu: GpuType | string): ComputerBuilder;
    setWifi(hasWifi: boolean): ComputerBuilder;
    setBluetooth(hasBluetooth: boolean): ComputerBuilder;
    setMonitor(monitor: MonitorType | string): ComputerBuilder;
    build(): Computer;
}

// Concrete Builder
export class StandardComputerBuilder implements ComputerBuilder {
    private computer: Computer;

    constructor() {
        this.computer = new Computer();
    }

    public reset(): void {
        this.computer = new Computer();
    }

    public setCpu(cpu: CpuType | string): ComputerBuilder {
        this.computer.setCpu(cpu);
        return this;
    }

    public setRam(ram: number): ComputerBuilder {
        this.computer.setRam(ram);
        return this;
    }

    public setStorage(storage: number): ComputerBuilder {
        this.computer.setStorage(storage);
        return this;
    }

    public setGpu(gpu: GpuType | string): ComputerBuilder {
        this.computer.setGpu(gpu);
        return this;
    }

    public setWifi(hasWifi: boolean): ComputerBuilder {
        this.computer.setWifi(hasWifi);
        return this;
    }

    public setBluetooth(hasBluetooth: boolean): ComputerBuilder {
        this.computer.setBluetooth(hasBluetooth);
        return this;
    }

    public setMonitor(monitor: MonitorType | string): ComputerBuilder {
        this.computer.setMonitor(monitor);
        return this;
    }

    public build(): Computer {
        const result = this.computer;
        this.reset();
        return result;
    }
}

// Director: Defines the order of building steps and creates specific configurations
export class ComputerDirector {
    private builder: ComputerBuilder;

    constructor(builder: ComputerBuilder) {
        this.builder = builder;
    }

    public changeBuilder(builder: ComputerBuilder): void {
        this.builder = builder;
    }

    // Makes a basic office computer
    public makeOfficeComputer(): Computer {
        return this.builder
            .setCpu(CpuType.INTEL_I3)
            .setRam(8)
            .setStorage(256)
            .setGpu(GpuType.INTEGRATED)
            .setWifi(true)
            .setBluetooth(true)
            .build();
    }

    // Makes a gaming computer
    public makeGamingComputer(): Computer {
        return this.builder
            .setCpu(CpuType.AMD_RYZEN_9)
            .setRam(32)
            .setStorage(1000)
            .setGpu(GpuType.NVIDIA_RTX_3080)
            .setWifi(true)
            .setBluetooth(true)
            .setMonitor(MonitorType.GAMING_27_4K)
            .build();
    }

    // Makes a server computer
    public makeServerComputer(): Computer {
        return this.builder
            .setCpu(CpuType.INTEL_XEON)
            .setRam(64)
            .setStorage(2000)
            .setGpu(GpuType.SERVER)
            .setWifi(false)
            .setBluetooth(false)
            .build();
    }
}
