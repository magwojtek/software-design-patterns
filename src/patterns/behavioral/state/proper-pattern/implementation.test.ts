import { Document, DocumentState, DraftState, PublishedState } from './implementation';

describe('State Proper Pattern Tests', () => {
    test('document starts in draft state', () => {
        const document = new Document();
        expect(document.getStateName()).toBe('Draft');
        expect(document.outputs).toContain('Created new document in Draft state');
    });

    test('draft document can be submitted for review', () => {
        const document = new Document();
        document.submitForReview();

        expect(document.getStateName()).toBe('Moderation');
        expect(document.outputs).toContain('Document submitted for review');
    });

    test('draft document cannot be published directly', () => {
        const document = new Document();
        document.publish();

        expect(document.getStateName()).toBe('Draft');
        expect(document.outputs).toContain('Cannot publish document without review');
    });

    test('document in moderation can be published', () => {
        const document = new Document();
        document.submitForReview();
        document.publish();

        expect(document.getStateName()).toBe('Published');
        expect(document.outputs).toContain('Document has been published');
    });

    test('document in moderation can be rejected', () => {
        const document = new Document();
        document.submitForReview();
        document.reject();

        expect(document.getStateName()).toBe('Rejected');
        expect(document.outputs).toContain('Document has been rejected');
    });

    test('rejected document can be resubmitted', () => {
        const document = new Document();
        document.submitForReview();
        document.reject();
        document.submitForReview();

        expect(document.getStateName()).toBe('Moderation');
        expect(document.outputs).toContain('Rejected document resubmitted for review');
    });

    test('any document can be edited, returning it to draft state', () => {
        // Test from moderation state
        const document1 = new Document();
        document1.submitForReview();
        document1.edit();

        expect(document1.getStateName()).toBe('Draft');
        expect(document1.outputs).toContain(
            'Document pulled from review and returned to draft state',
        );

        // Test from published state
        const document2 = new Document();
        document2.submitForReview();
        document2.publish();
        document2.edit();

        expect(document2.getStateName()).toBe('Draft');
        expect(document2.outputs).toContain(
            'Published document unpublished and returned to draft state',
        );

        // Test from rejected state
        const document3 = new Document();
        document3.submitForReview();
        document3.reject();
        document3.edit();

        expect(document3.getStateName()).toBe('Draft');
        expect(document3.outputs).toContain('Rejected document returned to draft state');
    });

    test('published document cannot be submitted for review', () => {
        const document = new Document();
        document.submitForReview();
        document.publish();
        document.submitForReview();

        expect(document.getStateName()).toBe('Published');
        expect(document.outputs).toContain('Cannot submit a published document for review');
    });

    test('published document cannot be rejected', () => {
        const document = new Document();
        document.submitForReview();
        document.publish();
        document.reject();

        expect(document.getStateName()).toBe('Published');
        expect(document.outputs).toContain('Cannot reject a published document');
    });

    test('demonstrates adding a new state without modifying existing code', () => {
        // Create a new state class
        class ArchiveState implements DocumentState {
            public submitForReview(context: Document): void {
                context.outputs.push('Cannot submit an archived document for review');
            }

            public publish(context: Document): void {
                context.outputs.push('Cannot publish an archived document');
            }

            public reject(context: Document): void {
                context.outputs.push('Cannot reject an archived document');
            }

            public edit(context: Document): void {
                context.outputs.push('Archived document restored to draft state');
                context.changeState(new DraftState());
            }

            public getName(): string {
                return 'Archive';
            }
        }

        // Extend PublishedState to add archive functionality
        class ExtendedPublishedState extends PublishedState {
            public archive(context: Document): void {
                context.outputs.push('Document has been archived');
                context.changeState(new ArchiveState());
            }
        }

        // Test the new state
        const document = new Document();
        document.submitForReview();
        document.publish();

        // Change to our extended state
        document.changeState(new ExtendedPublishedState());

        // Use reflection to call the archive method
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).archive = function (this: any) {
            this.outputs.push('Attempting to archive document...');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.state as any).archive(this);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).archive();

        expect(document.getStateName()).toBe('Archive');
        expect(document.outputs).toContain('Document has been archived');

        // Test archive state behavior
        document.publish();
        expect(document.outputs).toContain('Cannot publish an archived document');

        document.edit();
        expect(document.getStateName()).toBe('Draft');
        expect(document.outputs).toContain('Archived document restored to draft state');
    });
});
