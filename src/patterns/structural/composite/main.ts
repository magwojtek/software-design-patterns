import { logger } from '~/utils/logger';
import * as AntiPattern from './anti-pattern/implementation';
import * as ProperPattern from './proper-pattern/implementation';

export function demonstrateAntiPattern(): void {
    logger.info('\n--- COMPOSITE PATTERN - ANTI-PATTERN DEMO ---');

    // Create a file system structure
    const root = AntiPattern.createSampleFileSystem();

    // Print the structure
    logger.info('\nPrinting file system structure:');
    root.print();

    // Use the FileSystemManager to work with different entities
    logger.info('\nUsing FileSystemManager with type checking:');

    // Get the first file (readme.txt)
    const readme = root.getFiles()[0];

    // Get the documents directory
    const docs = root.getSubdirectories()[0];

    // Need to check types for each operation
    logger.success(
        `Size of readme.txt: ${AntiPattern.FileSystemManager.getEntitySize(readme)} bytes`,
    );
    logger.success(
        `Size of documents directory: ${AntiPattern.FileSystemManager.getEntitySize(docs)} bytes`,
    );

    // Search for a file (requires specific Directory parameter)
    const results = AntiPattern.FileSystemManager.findByName('image', root);
    logger.success(`Found ${results.length} items with 'image' in the name:`);
    results.forEach((entity) => {
        // Need to check type again to print
        AntiPattern.FileSystemManager.printEntity(entity, '  ');
    });

    // Move a file (requires specific types)
    if (root.getSubdirectories().length >= 2) {
        const images = root.getSubdirectories()[1];
        if (images.getFiles().length >= 1) {
            const photo = images.getFiles()[1]; // photo.jpg
            logger.warn('\nMoving photo.jpg from images to documents directory:');
            AntiPattern.FileSystemManager.moveEntity(photo, images, docs);
        }
    }

    // Print the updated structure
    logger.info('\nUpdated file system structure:');
    root.print();

    // Add a new entity type would require modification of client code
    logger.error('\nAdding a new entity type would require modifying FileSystemManager class');
}

export function demonstrateProperPattern(): void {
    logger.info('\n--- COMPOSITE PATTERN - PROPER PATTERN DEMO ---');

    // Create a file system structure
    const root = ProperPattern.createSampleFileSystem();

    // Print the structure
    logger.info('\nPrinting file system structure:');
    ProperPattern.FileSystemManager.printComponent(root);

    // Use the FileSystemManager to work with different components uniformly
    logger.info('\nUsing FileSystemManager with uniform interface:');

    // Get some components from the hierarchy
    const readme = root.getChild(3); // readme.txt (File)
    const docs = root.getChild(0); // documents (Directory)

    if (readme && docs) {
        const readmeLink = (docs as ProperPattern.Directory).getChild(1); // readme-link.txt (Symlink)

        // Work with components uniformly through the FileSystemComponent interface
        logger.success(
            `Size of readme.txt: ${ProperPattern.FileSystemManager.getComponentSize(readme)} bytes`,
        );
        logger.success(
            `Size of documents directory: ${ProperPattern.FileSystemManager.getComponentSize(docs)} bytes`,
        );

        if (readmeLink) {
            logger.success(
                `Size of readme-link.txt symlink: ${ProperPattern.FileSystemManager.getComponentSize(readmeLink)} bytes`,
            );

            // Paths are also handled uniformly
            logger.success(
                `Path of readme-link.txt symlink: ${ProperPattern.FileSystemManager.getFullPath(readmeLink)}`,
            );
        }

        // Paths are also handled uniformly
        logger.success(
            `Path of readme.txt: ${ProperPattern.FileSystemManager.getFullPath(readme)}`,
        );
        logger.success(
            `Path of documents directory: ${ProperPattern.FileSystemManager.getFullPath(docs)}`,
        );

        // Search for components (works with any component type)
        const results = ProperPattern.FileSystemManager.findByName('readme', root);
        logger.success(`\nFound ${results.length} items with 'readme' in the name:`);
        results.forEach((component) => {
            // No need to check types - all components have print() method
            ProperPattern.FileSystemManager.printComponent(component, '  ');
        });

        // Move a component (works with any component type)
        const images = root.getChild(1) as ProperPattern.Directory;
        if (images) {
            const photo = images.getChild(1); // photo.jpg
            if (photo) {
                logger.warn('\nMoving photo.jpg from images to documents directory:');
                ProperPattern.FileSystemManager.moveComponent(
                    photo,
                    docs as ProperPattern.Directory,
                );
            }
        }
    }

    // Print the updated structure
    logger.info('\nUpdated file system structure:');
    ProperPattern.FileSystemManager.printComponent(root);

    // Demonstrate extensibility with a new component type
    logger.info('\nDemonstrating extensibility with a new component type:');

    // Create a new encrypted file component
    class EncryptedFile extends ProperPattern.File {
        constructor(
            name: string,
            size: number,
            fileType: string,
            private encryptionType: string,
        ) {
            super(name, size, fileType);
        }

        print(indent: string = ''): void {
            logger.info(
                `${indent}🔒 Encrypted File: ${this.getName()} (${this.getSize()} bytes, ${this.getFileType()}, ${this.encryptionType})`,
            );
        }
    }

    // Create and add the new component type to the file system
    const secret = new EncryptedFile('secret.dat', 4096, 'binary', 'AES-256');
    (docs as ProperPattern.Directory).add(secret);

    // FileSystemManager works with the new component without modification
    logger.success(
        `Path of new encrypted file: ${ProperPattern.FileSystemManager.getFullPath(secret)}`,
    );
    logger.success(
        `Size of encrypted file: ${ProperPattern.FileSystemManager.getComponentSize(secret)} bytes`,
    );

    // Print the final structure including the new component type
    logger.info('\nFinal file system structure with new component type:');
    ProperPattern.FileSystemManager.printComponent(root);
}

// When this module is run directly
logger.info('=== COMPOSITE PATTERN DEMONSTRATION ===');
logger.info(
    'The Composite pattern lets you compose objects into tree structures and then work with these structures as if they were individual objects.',
);

demonstrateAntiPattern();
demonstrateProperPattern();

logger.info('\n=== COMPARISON ===');
logger.error('Anti-pattern approach:');
logger.error('- Uses different classes with inconsistent interfaces');
logger.error('- Requires type checking in client code');
logger.error('- Adding new types requires modifying existing code');
logger.error('- Complex client code with conditional logic');

logger.success('\nProper pattern approach:');
logger.success('- Defines a common interface for all components');
logger.success('- No type checking needed in client code');
logger.success('- Can add new component types without modifying existing code');
logger.success('- Simpler, more maintainable client code');
logger.success('- Follows Open/Closed and Liskov Substitution principles');
