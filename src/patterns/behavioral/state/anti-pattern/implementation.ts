/**
 * State Pattern Anti-Pattern
 *
 * Problems with this implementation:
 * 1. Uses conditional statements to handle state transitions
 * 2. State logic is scattered throughout the context class
 * 3. Adding new states requires modifying existing code
 * 4. State transitions are hard-coded and difficult to maintain
 * 5. Violates the Open/Closed Principle
 */

// Enum for document states
export enum DocumentState {
    DRAFT = 'draft',
    MODERATION = 'moderation',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
}

// The context class that manages state with conditionals
export class DocumentAntiPattern {
    public outputs: string[] = [];

    // State is represented as an enum
    private state: DocumentState = DocumentState.DRAFT;

    constructor() {
        this.outputs.push('Created new document in draft state');
    }

    // Get the current state
    public getState(): DocumentState {
        return this.state;
    }

    // Request for moderation
    public submitForReview(): void {
        this.outputs.push('Attempting to submit document for review...');

        if (this.state === DocumentState.DRAFT) {
            this.state = DocumentState.MODERATION;
            this.outputs.push('Document submitted for review');
        } else if (this.state === DocumentState.MODERATION) {
            this.outputs.push('Document is already under review');
        } else if (this.state === DocumentState.PUBLISHED) {
            this.outputs.push('Cannot submit a published document for review');
        } else if (this.state === DocumentState.REJECTED) {
            this.state = DocumentState.MODERATION;
            this.outputs.push('Rejected document resubmitted for review');
        }
    }

    // Publish the document
    public publish(): void {
        this.outputs.push('Attempting to publish document...');

        if (this.state === DocumentState.DRAFT) {
            this.outputs.push('Cannot publish document without review');
        } else if (this.state === DocumentState.MODERATION) {
            this.state = DocumentState.PUBLISHED;
            this.outputs.push('Document has been published');
        } else if (this.state === DocumentState.PUBLISHED) {
            this.outputs.push('Document is already published');
        } else if (this.state === DocumentState.REJECTED) {
            this.outputs.push('Cannot publish a rejected document');
        }
    }

    // Reject the document
    public reject(): void {
        this.outputs.push('Attempting to reject document...');

        if (this.state === DocumentState.DRAFT) {
            this.outputs.push('Cannot reject document that has not been submitted');
        } else if (this.state === DocumentState.MODERATION) {
            this.state = DocumentState.REJECTED;
            this.outputs.push('Document has been rejected');
        } else if (this.state === DocumentState.PUBLISHED) {
            this.outputs.push('Cannot reject a published document');
        } else if (this.state === DocumentState.REJECTED) {
            this.outputs.push('Document is already rejected');
        }
    }

    // Edit the document
    public edit(): void {
        this.outputs.push('Attempting to edit document...');

        if (this.state === DocumentState.DRAFT) {
            this.outputs.push('Editing draft document');
        } else if (this.state === DocumentState.MODERATION) {
            this.state = DocumentState.DRAFT;
            this.outputs.push('Document pulled from review and returned to draft state');
        } else if (this.state === DocumentState.PUBLISHED) {
            this.state = DocumentState.DRAFT;
            this.outputs.push('Published document unpublished and returned to draft state');
        } else if (this.state === DocumentState.REJECTED) {
            this.state = DocumentState.DRAFT;
            this.outputs.push('Rejected document returned to draft state');
        }
    }
}
