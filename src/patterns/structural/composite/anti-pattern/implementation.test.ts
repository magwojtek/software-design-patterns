import { File, Directory, FileSystemManager, createSampleFileSystem } from './implementation';
import { logger } from '~/utils/logger';

describe('Composite Pattern - Anti-Pattern Implementation', () => {
    let root: Directory;
    let docs: Directory;
    let images: Directory;
    let readme: File;
    let photo: File;

    beforeEach(() => {
        // Set up fresh file system for each test
        root = createSampleFileSystem();

        // Get references to commonly used entities
        docs = root.getSubdirectories()[0]; // documents directory
        images = root.getSubdirectories()[1]; // images directory
        readme = root.getFiles()[0]; // readme.txt file
        photo = images.getFiles()[1]; // photo.jpg file
    });

    describe('File operations', () => {
        it('should have proper file properties', () => {
            expect(readme.getName()).toBe('readme.txt');
            expect(readme.getSize()).toBe(1024);
            expect(readme.getFileType()).toBe('text');
            expect(readme.isWritable()).toBe(true);
        });

        it('should toggle writable property', () => {
            readme.setWritable(false);
            expect(readme.isWritable()).toBe(false);
        });

        it('should print file information correctly', () => {
            const logSpy = jest.spyOn(logger, 'log').mockImplementation();
            readme.print();
            expect(logSpy).toHaveBeenCalled();
        });
    });

    describe('Directory operations', () => {
        it('should add files correctly', () => {
            const newFile = new File('newfile.txt', 512, 'text');
            docs.addFile(newFile);

            expect(docs.getFiles()).toContain(newFile);
        });

        it('should add subdirectories correctly', () => {
            const newDir = new Directory('newdir');
            docs.addSubdirectory(newDir);

            expect(docs.getSubdirectories()).toContain(newDir);
        });

        it('should remove files correctly', () => {
            const config = docs.getFiles()[0]; // config.json
            const result = docs.removeFile(config);

            expect(result).toBe(true);
            expect(docs.getFiles()).not.toContain(config);
        });

        it('should remove subdirectories correctly', () => {
            const system = root.getSubdirectories()[2]; // system dir
            const result = root.removeSubdirectory(system);

            expect(result).toBe(true);
            expect(root.getSubdirectories()).not.toContain(system);
        });

        it('should calculate size recursively', () => {
            // Total size is the sum of all files in the hierarchy
            const totalSize = 1024 + 2048 + 4096 + 8192 + 16384; // All file sizes combined
            expect(root.getSize()).toBe(totalSize);
        });

        it('should print directory structure recursively', () => {
            const logSpy = jest.spyOn(logger, 'log').mockImplementation();

            root.print();

            // Should call log multiple times for the hierarchy
            expect(logSpy.mock.calls.length).toBeGreaterThan(1);
        });
    });

    describe('FileSystemManager operations', () => {
        it('should get entity size with type checking', () => {
            expect(FileSystemManager.getEntitySize(readme)).toBe(1024);
            expect(FileSystemManager.getEntitySize(docs)).toBe(2048); // config.json
        });

        it('should print entity with type checking', () => {
            const logSpy = jest.spyOn(logger, 'log').mockImplementation();

            FileSystemManager.printEntity(readme);
            FileSystemManager.printEntity(docs);

            expect(logSpy).toHaveBeenCalled();
        });

        it('should find entities by name', () => {
            const results = FileSystemManager.findByName('image', root);

            // Should find logo.png and photo.jpg (both have "image" in name or type)
            // and the images directory
            expect(results.length).toBe(3);
        });

        it('should move file between directories', () => {
            FileSystemManager.moveEntity(photo, images, docs);

            expect(images.getFiles()).not.toContain(photo);
            expect(docs.getFiles()).toContain(photo);
        });

        it('should move directory between directories', () => {
            const system = root.getSubdirectories()[2]; // system dir
            FileSystemManager.moveDirectory(system, root, docs);

            expect(root.getSubdirectories()).not.toContain(system);
            expect(docs.getSubdirectories()).toContain(system);
        });
    });
});
