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

        if (from.type !== to.type) {
            throw new Error('Input type is incompatible with Output type');
        }

        if (to.connected) {
            /** Remove previous connection gracefully */
            to.connection?.dispose();
        }

        this.from = from;
        this.to = to;

        this.subscription = this.from.subscribe(this.to);

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
