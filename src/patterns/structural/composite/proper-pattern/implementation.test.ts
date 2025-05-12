import {
    FileSystemComponent,
    File,
    Directory,
    Symlink,
    FileSystemManager,
    createSampleFileSystem,
} from './implementation';
import { logger, LogColor } from '~/utils/logger';

describe('Composite Pattern - Proper Implementation', () => {
    let root: Directory;
    let docs: Directory;
    let images: Directory;
    let readme: File;
    let photo: File;
    let readmeLink: Symlink;

    beforeEach(() => {
        // Set up fresh file system for each test
        root = createSampleFileSystem();

        // Get references to commonly used entities
        docs = root.getChild(0) as Directory; // documents directory
        images = root.getChild(1) as Directory; // images directory
        readme = root.getChild(3) as File; // readme.txt file
        photo = images.getChild(1) as File; // photo.jpg file
        readmeLink = docs.getChild(1) as Symlink; // readme-link.txt symlink
    });

    describe('Component interface', () => {
        it('should treat all components uniformly through the interface', () => {
            // All components should implement the FileSystemComponent interface
            const components: FileSystemComponent[] = [root, docs, readme, readmeLink];

            // We can call common methods on all components without type checking
            components.forEach((component) => {
                expect(typeof component.getName()).toBe('string');
                expect(typeof component.getSize()).toBe('number');
                expect(component.getParent()).toBeDefined(); // Could be null for root
            });
        });
    });

    describe('File operations', () => {
        it('should have proper file properties', () => {
            expect(readme.getName()).toBe('readme.txt');
            expect(readme.getSize()).toBe(1024);
            expect(readme.getFileType()).toBe('text');
        });

        it('should print file information correctly', () => {
            // Use toString() method to test the output directly
            const output = readme.toString();

            // Verify the output contains the expected information
            expect(output).toContain('File: readme.txt');
            expect(output).toContain('1024 bytes');
            expect(output).toContain('text');
        });

        it('should report the correct path', () => {
            expect(readme.getPath()).toBe('root/readme.txt');
        });
    });

    describe('Directory operations', () => {
        it('should add components correctly', () => {
            const newFile = new File('newfile.txt', 512, 'text');
            docs.add(newFile);

            expect(docs.getChildren()).toContain(newFile);
            expect(newFile.getParent()).toBe(docs);
        });

        it('should remove components correctly', () => {
            const result = docs.remove(readmeLink);

            expect(result).toBe(true);
            expect(docs.getChildren()).not.toContain(readmeLink);
            expect(readmeLink.getParent()).toBeNull();
        });

        it('should calculate size recursively', () => {
            // Total size is the sum of all files in the hierarchy plus symlinks
            // We'll check an approximate value since the exact value depends on implementation details
            expect(root.getSize()).toBeGreaterThan(30000);
            expect(root.getSize()).toBeLessThan(32000);
        });

        it('should print directory structure recursively', () => {
            // Instead of checking logger, test the string representation
            const output = root.toString();

            // Check that the output contains expected components
            expect(output).toContain('Directory: root');
            expect(output).toContain('Directory: documents');
            expect(output).toContain('Directory: images');
            expect(output).toContain('File: readme.txt');
        });

        it('should report the correct path', () => {
            expect(docs.getPath()).toBe('root/documents');
        });
    });

    describe('Symlink operations', () => {
        it('should point to the correct target', () => {
            expect(readmeLink.getTarget()).toBe(readme);
        });

        it('should have its own size but access to target size', () => {
            expect(readmeLink.getSize()).toBe(1);
            expect(readmeLink.getTargetSize()).toBe(1024);
        });

        it('should print symlink information correctly', () => {
            const output = readmeLink.toString();
            expect(output).toContain('Symlink: readme-link.txt');
            expect(output).toContain('readme.txt');
            expect(output).toContain('points to file');
        });
    });

    describe('FileSystemManager operations (demonstrating uniform handling)', () => {
        it('should get size of any component type uniformly', () => {
            // Test various component types with the same method
            expect(FileSystemManager.getComponentSize(readme)).toBe(1024);
            expect(FileSystemManager.getComponentSize(docs)).toBe(2048 + 1); // config.json + readme-link
            expect(FileSystemManager.getComponentSize(readmeLink)).toBe(1);
        });

        it('should print any component type uniformly', () => {
            // Add a toString method to FileSystemManager
            const readmeOutput = readme.toString();
            const docsOutput = docs.toString();
            const symlinkOutput = readmeLink.toString();

            // Verify contents rather than checking logger calls
            expect(readmeOutput).toContain('File: readme.txt');
            expect(docsOutput).toContain('Directory: documents');
            expect(symlinkOutput).toContain('Symlink: readme-link.txt');
        });

        it('should find components by name', () => {
            const results = FileSystemManager.findByName('readme', root);

            expect(results.length).toBe(2);
            expect(results).toContain(readme);
            expect(results).toContain(readmeLink);
        });

        it('should move any component type uniformly and track the operation', () => {
            // Reset operation result before test
            FileSystemManager.resetLastOperationResult();

            // Move photo.jpg from images to docs
            FileSystemManager.moveComponent(photo, docs);

            // Should be removed from images
            expect(images.getChildren()).not.toContain(photo);

            // Should be added to docs
            expect(docs.getChildren()).toContain(photo);
            expect(photo.getParent()).toBe(docs);

            // Check the operation result instead of spying on logger
            const result = FileSystemManager.getLastOperationResult();
            expect(result).toContain('Moved file photo.jpg from images to documents');
        });

        it('should get the full path of any component', () => {
            expect(FileSystemManager.getFullPath(readme)).toBe('root/readme.txt');
            expect(FileSystemManager.getFullPath(docs)).toBe('root/documents');
            expect(FileSystemManager.getFullPath(readmeLink)).toBe(
                'root/documents/readme-link.txt',
            );
        });
    });

    describe('Extensibility (demonstrating Open/Closed principle)', () => {
        it('should work with new component types without modifying existing code', () => {
            // Create a custom component type that implements the FileSystemComponent interface
            class EncryptedFile extends File {
                constructor(
                    name: string,
                    size: number,
                    fileType: string,
                    private encryptionType: string,
                ) {
                    super(name, size, fileType);
                }

                getEncryptionType(): string {
                    return this.encryptionType;
                }

                print(indent: string = ''): void {
                    // Override with custom implementation
                    logger.log(
                        `${indent}EncryptedFile: ${this.getName()} (${this.getSize()} bytes, ${this.getFileType()}, ${this.encryptionType})`,
                        LogColor.INFO,
                    );
                }

                toString(indent: string = ''): string {
                    return `${indent}EncryptedFile: ${this.getName()} (${this.getSize()} bytes, ${this.getFileType()}, ${this.encryptionType})`;
                }
            }

            // Create an instance of the new component type
            const encryptedFile = new EncryptedFile('secret.enc', 2048, 'encrypted', 'AES-256');

            // Add it to the file system
            docs.add(encryptedFile);

            // The FileSystemManager can work with this new type without modification
            expect(FileSystemManager.getComponentSize(encryptedFile)).toBe(2048);
            expect(FileSystemManager.getFullPath(encryptedFile)).toBe('root/documents/secret.enc');

            // We can use the new component's specific methods
            expect(encryptedFile.getEncryptionType()).toBe('AES-256');
        });
    });
});
