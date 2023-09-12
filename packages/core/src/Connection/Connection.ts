import { action, makeObservable, observable } from 'mobx';
import { Subject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Input } from '../Input/Input';
import { Output } from '../Output/Output';

export class Connection<T> extends Subject<T> {
    /** Identifier */
    public id: string = uuid();
    /** Output */
    public from: Output<T>;
    /** Input */
    public to: Input<T>;
    /** Subscription */
    public subscription: Subscription;

    constructor(from: Output<T>, to: Input<T>) {
        super();

        if (to.connected) {
            /** Remove previous connection gracefully */
            to.connection?.dispose();
        }

        this.from = from;
        this.to = to;

        this.subscription = this.from.subscribe(value => {
            try {
                this.to.type.validator.parse(value);
                this.to.next(value);
            } catch (err) {
                this.dispose();
                throw new Error('Received a value with an incompatible type');
            }
        });

        this.from.connections.push(this);
        this.to.connection = this;

        makeObservable(this, {
            id: observable,
            from: observable,
            to: observable,
            subscription: observable,
            dispose: action
        });
    }

    /** Disposes the Connection */
    public dispose() {
        this.unsubscribe();
        this.subscription.unsubscribe();

        this.from.connections = this.from.connections.filter(connection => connection !== this);
        this.to.connection = null;

        this.to.next(this.to.defaultValue);
    }
}
