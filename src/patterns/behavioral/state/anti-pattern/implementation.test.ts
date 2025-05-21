import { DocumentAntiPattern, DocumentState } from './implementation';

describe('State Anti-Pattern Tests', () => {
    test('document starts in draft state', () => {
        const document = new DocumentAntiPattern();
        expect(document.getState()).toBe(DocumentState.DRAFT);
        expect(document.outputs).toContain('Created new document in draft state');
    });

    test('draft document can be submitted for review', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();

        expect(document.getState()).toBe(DocumentState.MODERATION);
        expect(document.outputs).toContain('Document submitted for review');
    });

    test('draft document cannot be published directly', () => {
        const document = new DocumentAntiPattern();
        document.publish();

        expect(document.getState()).toBe(DocumentState.DRAFT);
        expect(document.outputs).toContain('Cannot publish document without review');
    });

    test('document in moderation can be published', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();
        document.publish();

        expect(document.getState()).toBe(DocumentState.PUBLISHED);
        expect(document.outputs).toContain('Document has been published');
    });

    test('document in moderation can be rejected', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();
        document.reject();

        expect(document.getState()).toBe(DocumentState.REJECTED);
        expect(document.outputs).toContain('Document has been rejected');
    });

    test('rejected document can be resubmitted', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();
        document.reject();
        document.submitForReview();

        expect(document.getState()).toBe(DocumentState.MODERATION);
        expect(document.outputs).toContain('Rejected document resubmitted for review');
    });

    test('any document can be edited, returning it to draft state', () => {
        // Test from moderation state
        const document1 = new DocumentAntiPattern();
        document1.submitForReview();
        document1.edit();

        expect(document1.getState()).toBe(DocumentState.DRAFT);
        expect(document1.outputs).toContain(
            'Document pulled from review and returned to draft state',
        );

        // Test from published state
        const document2 = new DocumentAntiPattern();
        document2.submitForReview();
        document2.publish();
        document2.edit();

        expect(document2.getState()).toBe(DocumentState.DRAFT);
        expect(document2.outputs).toContain(
            'Published document unpublished and returned to draft state',
        );

        // Test from rejected state
        const document3 = new DocumentAntiPattern();
        document3.submitForReview();
        document3.reject();
        document3.edit();

        expect(document3.getState()).toBe(DocumentState.DRAFT);
        expect(document3.outputs).toContain('Rejected document returned to draft state');
    });

    test('published document cannot be submitted for review', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();
        document.publish();
        document.submitForReview();

        expect(document.getState()).toBe(DocumentState.PUBLISHED);
        expect(document.outputs).toContain('Cannot submit a published document for review');
    });

    test('published document cannot be rejected', () => {
        const document = new DocumentAntiPattern();
        document.submitForReview();
        document.publish();
        document.reject();

        expect(document.getState()).toBe(DocumentState.PUBLISHED);
        expect(document.outputs).toContain('Cannot reject a published document');
    });
});
