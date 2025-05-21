/**
 * State Pattern Proper Implementation
 *
 * Benefits of this implementation:
 * 1. Encapsulates state-specific behavior in separate classes
 * 2. Eliminates conditional statements for state transitions
 * 3. Makes adding new states easy without modifying existing code
 * 4. State transitions are managed by the state objects themselves
 * 5. Follows the Open/Closed Principle
 */

// The State interface declares methods that all concrete states should implement
export interface DocumentState {
    submitForReview(context: Document): void;
    publish(context: Document): void;
    reject(context: Document): void;
    edit(context: Document): void;
    getName(): string;
}

// The Context class maintains a reference to a state object and delegates state-specific behavior to it
export class Document {
    public outputs: string[] = [];
    private state: DocumentState;

    constructor() {
        // Initial state is Draft
        this.state = new DraftState();
        this.outputs.push(`Created new document in ${this.state.getName()} state`);
    }

    // Change the current state
    public changeState(state: DocumentState): void {
        this.state = state;
    }

    // Get the current state name
    public getStateName(): string {
        return this.state.getName();
    }

    // Delegate behavior to the current state
    public submitForReview(): void {
        this.outputs.push('Attempting to submit document for review...');
        this.state.submitForReview(this);
    }

    public publish(): void {
        this.outputs.push('Attempting to publish document...');
        this.state.publish(this);
    }

    public reject(): void {
        this.outputs.push('Attempting to reject document...');
        this.state.reject(this);
    }

    public edit(): void {
        this.outputs.push('Attempting to edit document...');
        this.state.edit(this);
    }
}

// Concrete State: Draft
export class DraftState implements DocumentState {
    public submitForReview(context: Document): void {
        context.outputs.push('Document submitted for review');
        context.changeState(new ModerationState());
    }

    public publish(context: Document): void {
        context.outputs.push('Cannot publish document without review');
    }

    public reject(context: Document): void {
        context.outputs.push('Cannot reject document that has not been submitted');
    }

    public edit(context: Document): void {
        context.outputs.push('Editing draft document');
    }

    public getName(): string {
        return 'Draft';
    }
}

// Concrete State: Moderation
export class ModerationState implements DocumentState {
    public submitForReview(context: Document): void {
        context.outputs.push('Document is already under review');
    }

    public publish(context: Document): void {
        context.outputs.push('Document has been published');
        context.changeState(new PublishedState());
    }

    public reject(context: Document): void {
        context.outputs.push('Document has been rejected');
        context.changeState(new RejectedState());
    }

    public edit(context: Document): void {
        context.outputs.push('Document pulled from review and returned to draft state');
        context.changeState(new DraftState());
    }

    public getName(): string {
        return 'Moderation';
    }
}

// Concrete State: Published
export class PublishedState implements DocumentState {
    public submitForReview(context: Document): void {
        context.outputs.push('Cannot submit a published document for review');
    }

    public publish(context: Document): void {
        context.outputs.push('Document is already published');
    }

    public reject(context: Document): void {
        context.outputs.push('Cannot reject a published document');
    }

    public edit(context: Document): void {
        context.outputs.push('Published document unpublished and returned to draft state');
        context.changeState(new DraftState());
    }

    public getName(): string {
        return 'Published';
    }
}

// Concrete State: Rejected
export class RejectedState implements DocumentState {
    public submitForReview(context: Document): void {
        context.outputs.push('Rejected document resubmitted for review');
        context.changeState(new ModerationState());
    }

    public publish(context: Document): void {
        context.outputs.push('Cannot publish a rejected document');
    }

    public reject(context: Document): void {
        context.outputs.push('Document is already rejected');
    }

    public edit(context: Document): void {
        context.outputs.push('Rejected document returned to draft state');
        context.changeState(new DraftState());
    }

    public getName(): string {
        return 'Rejected';
    }
}
