/**
 * Composite Anti-Pattern Implementation
 *
 * Issues with this implementation:
 * 1. File and Directory classes have different interfaces (no common parent)
 * 2. Client code (FileSystemManager) needs to check types for each operation
 * 3. Adding a new file system entity type requires modifying FileSystemManager
 * 4. Violates the Open/Closed Principle and Liskov Substitution Principle
 * 5. Complex client code with conditional logic
 */
import { logger, LogColor } from '~/utils/logger';

// No common interface for file system entities
export class File {
    private writable: boolean = true;

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

    print(indent: string = ''): void {
        logger.log(
            `${indent}File: ${this.name} (${this.size} bytes, ${this.fileType})`,
            LogColor.INFO,
        );
    }
}

export class Directory {
    private files: File[] = [];
    private subdirectories: Directory[] = [];

    constructor(private name: string) {}

    getName(): string {
        return this.name;
    }

    getFiles(): File[] {
        return this.files;
    }

    getSubdirectories(): Directory[] {
        return this.subdirectories;
    }

    addFile(file: File): void {
        this.files.push(file);
        logger.success(`Added file ${file.getName()} to directory ${this.name}`);
    }

    removeFile(file: File): boolean {
        const index = this.files.indexOf(file);
        if (index !== -1) {
            this.files.splice(index, 1);
            logger.warn(`Removed file ${file.getName()} from directory ${this.name}`);
            return true;
        }
        return false;
    }

    addSubdirectory(directory: Directory): void {
        this.subdirectories.push(directory);
        logger.success(`Added directory ${directory.getName()} to directory ${this.name}`);
    }

    removeSubdirectory(directory: Directory): boolean {
        const index = this.subdirectories.indexOf(directory);
        if (index !== -1) {
            this.subdirectories.splice(index, 1);
            logger.warn(`Removed directory ${directory.getName()} from directory ${this.name}`);
            return true;
        }
        return false;
    }

    getSize(): number {
        let totalSize = 0;

        // Sum file sizes
        for (const file of this.files) {
            totalSize += file.getSize();
        }

        // Sum subdirectory sizes (recursively)
        for (const subdir of this.subdirectories) {
            totalSize += subdir.getSize();
        }

        return totalSize;
    }

    print(indent: string = ''): void {
        logger.info(`${indent}Directory: ${this.name} (${this.getSize()} bytes)`);

        // Print files
        for (const file of this.files) {
            file.print(indent + '  ');
        }

        // Print subdirectories (recursively)
        for (const subdir of this.subdirectories) {
            subdir.print(indent + '  ');
        }
    }
}

// Client code that needs to check types
export class FileSystemManager {
    // Need type checking for each operation
    static getEntitySize(entity: File | Directory): number {
        if (entity instanceof File) {
            return entity.getSize();
        } else if (entity instanceof Directory) {
            return entity.getSize();
        }
        return 0; // Default case
    }

    static printEntity(entity: File | Directory, indent: string = ''): void {
        if (entity instanceof File) {
            entity.print(indent);
        } else if (entity instanceof Directory) {
            entity.print(indent);
        }
    }

    static findByName(name: string, directory: Directory): (File | Directory)[] {
        const results: (File | Directory)[] = [];

        // Check files in this directory
        for (const file of directory.getFiles()) {
            if (file.getName().includes(name) || file.getFileType().includes(name)) {
                results.push(file);
            }
        }

        // Check subdirectories
        for (const subdir of directory.getSubdirectories()) {
            if (subdir.getName().includes(name)) {
                results.push(subdir);
            }

            // Recursively search in subdirectories
            const subResults = this.findByName(name, subdir);
            results.push(...subResults);
        }

        return results;
    }

    static moveEntity(file: File, fromDir: Directory, toDir: Directory): void {
        if (fromDir.removeFile(file)) {
            toDir.addFile(file);
            logger.success(
                `Moved file ${file.getName()} from ${fromDir.getName()} to ${toDir.getName()}`,
            );
        }
    }

    static moveDirectory(dir: Directory, fromDir: Directory, toDir: Directory): void {
        if (fromDir.removeSubdirectory(dir)) {
            toDir.addSubdirectory(dir);
            logger.success(
                `Moved directory ${dir.getName()} from ${fromDir.getName()} to ${toDir.getName()}`,
            );
        }
    }

    // Adding a new entity type would require modifying this class
    // For example, if we added a Symlink class, we'd need to modify all these methods
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
    root.addSubdirectory(docs);
    root.addSubdirectory(images);
    root.addSubdirectory(system);

    root.addFile(readme);
    docs.addFile(config);
    images.addFile(logo);
    images.addFile(photo);
    system.addFile(sysFile);

    return root;
}
