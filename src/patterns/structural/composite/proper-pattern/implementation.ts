/**
 * Composite Pattern Implementation
 *
 * The Composite pattern allows you to compose objects into tree structures to represent
 * part-whole hierarchies. It lets clients treat individual objects and compositions of
 * objects uniformly.
 *
 * Key components:
 * 1. Component - common interface for all concrete classes
 * 2. Leaf - represents individual objects with no children
 * 3. Composite - represents complex components that may have children
 */
import { logger, LogColor } from '~/utils/logger';

// Common interface for all file system entities
export interface FileSystemComponent {
    getName(): string;
    getSize(): number;
    print(indent?: string): void;
    isDirectory(): boolean;
    getParent(): Directory | null;
    setParent(parent: Directory | null): void;
    getPath(): string;
    toString(indent?: string): string; // Add this method for testing
}

// Leaf component
export class File implements FileSystemComponent {
    private writable: boolean = true;
    private parent: Directory | null = null;

    constructor(
        private name: string,
        private size: number,
        private fileType: string,
    ) {}

    getName(): string {
        return this.name;
    }

    getSize(): number {
        return this.size;
    }

    getFileType(): string {
        return this.fileType;
    }

    isWritable(): boolean {
        return this.writable;
    }

    setWritable(writable: boolean): void {
        this.writable = writable;
    }

    isDirectory(): boolean {
        return false;
    }

    getParent(): Directory | null {
        return this.parent;
    }

    setParent(parent: Directory | null): void {
        this.parent = parent;
    }

    getPath(): string {
        if (!this.parent) {
            return this.name;
        }
        return `${this.parent.getPath()}/${this.name}`;
    }

    print(indent: string = ''): void {
        const message = this.toString(indent);
        logger.log(message, LogColor.INFO);
    }

    toString(indent: string = ''): string {
        return `${indent}File: ${this.name} (${this.size} bytes, ${this.fileType})`;
    }
}

// Composite component
export class Directory implements FileSystemComponent {
    private components: FileSystemComponent[] = [];
    private parent: Directory | null = null;

    constructor(private name: string) {}

    getName(): string {
        return this.name;
    }

    isDirectory(): boolean {
        return true;
    }

    getSize(): number {
        return this.components.reduce((total, component) => {
            return total + component.getSize();
        }, 0);
    }

    add(component: FileSystemComponent): string {
        this.components.push(component);
        component.setParent(this);
        const message = `Added ${component.isDirectory() ? 'directory' : 'file'} ${component.getName()} to directory ${this.name}`;
        logger.log(message, LogColor.SUCCESS);
        return message;
    }

    remove(component: FileSystemComponent): boolean {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
            component.setParent(null);
            const message = `Removed ${component.isDirectory() ? 'directory' : 'file'} ${component.getName()} from directory ${this.name}`;
            logger.log(message, LogColor.WARNING);
            return true;
        }
        return false;
    }

    getChild(index: number): FileSystemComponent | null {
        if (index >= 0 && index < this.components.length) {
            return this.components[index];
        }
        return null;
    }

    getChildren(): FileSystemComponent[] {
        return [...this.components];
    }

    getParent(): Directory | null {
        return this.parent;
    }

    setParent(parent: Directory | null): void {
        this.parent = parent;
    }

    getPath(): string {
        if (!this.parent) {
            return this.name;
        }
        return `${this.parent.getPath()}/${this.name}`;
    }

    print(indent: string = ''): void {
        logger.log(`${indent}Directory: ${this.name} (${this.getSize()} bytes)`, LogColor.INFO);

        // Print all children using polymorphism - works for both files and directories
        this.components.forEach((component) => {
            component.print(indent + '  ');
        });
    }

    toString(indent: string = ''): string {
        let result = `${indent}Directory: ${this.name} (${this.getSize()} bytes)\n`;
        this.components.forEach((component) => {
            result += component.toString(indent + '  ') + '\n';
        });
        return result;
    }
}

// Symlink component - another leaf component that points to another component
export class Symlink implements FileSystemComponent {
    private parent: Directory | null = null;

    constructor(
        private name: string,
        private target: FileSystemComponent,
        private size: number = 1, // Symlinks typically have a small size
    ) {}

    getName(): string {
        return this.name;
    }

    getSize(): number {
        return this.size;
    }

    getTargetSize(): number {
        return this.target.getSize();
    }

    isDirectory(): boolean {
        return false;
    }

    getTarget(): FileSystemComponent {
        return this.target;
    }

    getParent(): Directory | null {
        return this.parent;
    }

    setParent(parent: Directory | null): void {
        this.parent = parent;
    }

    getPath(): string {
        if (!this.parent) {
            return this.name;
        }
        return `${this.parent.getPath()}/${this.name}`;
    }

    print(indent: string = ''): void {
        const message = this.toString(indent);
        logger.log(message, LogColor.INFO);
    }

    toString(indent: string = ''): string {
        const targetType = this.target.isDirectory() ? 'directory' : 'file';
        return `${indent}Symlink: ${this.name} -> ${this.target.getName()} (${this.size} bytes, points to ${targetType})`;
    }
}

// Client code that treats all types uniformly
export class FileSystemManager {
    private static lastOperationResult: string | null = null;

    // Method to get the last operation result for testing
    static getLastOperationResult(): string | null {
        return this.lastOperationResult;
    }

    // Method to reset the last operation result
    static resetLastOperationResult(): void {
        this.lastOperationResult = null;
    }

    // Uniform treatment of file system entities
    static printComponent(component: FileSystemComponent, indent: string = ''): void {
        component.print(indent);
    }

    static getComponentSize(component: FileSystemComponent): number {
        return component.getSize();
    }

    static findByName(name: string, directory: Directory): FileSystemComponent[] {
        const results: FileSystemComponent[] = [];

        directory.getChildren().forEach((component) => {
            // Check if current component's name contains the search term
            if (component.getName().includes(name)) {
                results.push(component);
            }

            // If it's a directory, recursively search inside it
            if (component.isDirectory()) {
                const subResults = this.findByName(name, component as Directory);
                results.push(...subResults);
            }
        });

        return results;
    }

    static moveComponent(component: FileSystemComponent, toDir: Directory): void {
        const fromDir = component.getParent();
        if (fromDir && fromDir.remove(component)) {
            toDir.add(component);
            const message = `Moved ${component.isDirectory() ? 'directory' : 'file'} ${component.getName()} from ${fromDir.getName()} to ${toDir.getName()}`;
            logger.log(message, LogColor.SUCCESS);
            this.lastOperationResult = message;
        }
    }

    static getFullPath(component: FileSystemComponent): string {
        return component.getPath();
    }
}

// Helper function to create a sample file system
export function createSampleFileSystem(): Directory {
    const root = new Directory('root');

    const docs = new Directory('documents');
    const images = new Directory('images');
    const system = new Directory('system');

    const readme = new File('readme.txt', 1024, 'text');
    const config = new File('config.json', 2048, 'json');
    const logo = new File('logo.png', 4096, 'image');
    const photo = new File('photo.jpg', 8192, 'image');
    const sysFile = new File('system.dat', 16384, 'binary');

    // Build file system structure
    root.add(docs);
    root.add(images);
    root.add(system);

    root.add(readme); // File directly in root
    docs.add(config);
    images.add(logo);
    images.add(photo);
    system.add(sysFile);

    // Create a symlink in docs directory pointing to the readme file
    const readmeLink = new Symlink('readme-link.txt', readme);
    docs.add(readmeLink);

    return root;
}
