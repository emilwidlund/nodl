import { Subject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Context } from '../Context/Context';
import { Input } from '../Input/Input';
import { Output } from '../Output/Output';

export class Connection<T> extends Subject<T> {
    /** Identifier */
    public id: string = uuid();
    /** Associated Context */
    public context: Context;
    /** Output */
    public from: Output<T>;
    /** Input */
    public to: Input<T>;
    /** Subscription */
    public subscription: Subscription;

    constructor(context: Context, from: Output<T>, to: Input<T>) {
        super();

        this.context = context;
        this.from = from;
        this.to = to;

        this.subscription = this.from.subscribe(this.to);
    }

    /** Disposes the Connection */
    public dispose() {
        this.subscription.unsubscribe();

        this.to.next(this.to.defaultValue);
    }
}
