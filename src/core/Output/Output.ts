import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Input } from '../Input/Input';
import { IOutputProps } from '../Output/Output.types';

export class Output<T = any> extends ReplaySubject<T> {
    /** Identifier */
    public id: string = uuid();
    /** Name */
    public name: string;
    /** Type */
    public type: object;
    /** Compute operation */
    public observable: Observable<T>;
    /** Value Operator subscription */
    public subscription: Subscription;

    constructor(props: IOutputProps<T>) {
        super();

        this.name = props.name || 'Untitled';
        this.type = props.type;
        this.observable = props.observable;
        this.subscription = this.observable.subscribe(this);
    }

    /** Connects the output with a compatible input port */
    public connect(input: Input<T>) {
        if (input.type !== this.type) {
            throw new Error('Input type is incompatible with Output type');
        }

        this.subscription.unsubscribe();
        this.subscription = this.subscribe(input);
    }

    public dispose() {
        this.subscription.unsubscribe();
    }
}
