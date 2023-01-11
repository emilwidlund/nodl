import { Observable, Subject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Input } from '../Input/Input';
import { IOutputProps } from '../Output/Output.types';

export class Output<T> extends Subject<T> {
    /** Identifier */
    public id: string = uuid();
    /** Name */
    public name: string;
    /** Type */
    public type: string;
    /** Compute operation */
    public compute: Observable<T>;
    /** Value Operator subscription */
    public subscription: Subscription;

    constructor(props: IOutputProps<T>) {
        super();

        this.name = props.name || 'Untitled';
        this.type = props.type || 'Any';
        this.compute = props.compute;
        this.subscription = this.compute.subscribe(this);
    }

    public connect(input: Input<T>) {
        this.subscription.unsubscribe();
        this.subscription = this.subscribe(input);
    }

    public dispose() {
        this.subscription.unsubscribe();
    }
}
