import { action, computed, makeObservable, observable } from 'mobx';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { Connection } from '../Connection/Connection';
import { Input } from '../Input/Input';
import { IOutputProps } from '../Output/Output.types';

export class Output<TValue = any> extends ReplaySubject<TValue> {
    /** Identifier */
    public id: string = uuid();
    /** Name */
    public name: string;
    /** Type */
    public type: z.Schema;
    /** Compute operation */
    public observable: Observable<TValue>;
    /** Value Operator subscription */
    public subscription: Subscription;
    /** Associated Connections */
    public connections: Connection<TValue>[];

    constructor(props: IOutputProps<TValue>) {
        super(1);

        this.name = props.name || 'Untitled';
        this.type = props.type;
        this.observable = props.observable;
        this.subscription = this.observable.subscribe(this);
        this.connections = [];

        makeObservable(this, {
            id: observable,
            name: observable,
            type: observable,
            observable: observable,
            subscription: observable,
            connections: observable,
            connected: computed,
            connect: action,
            dispose: action
        });
    }

    /** Determines if output is connected */
    public get connected(): boolean {
        return this.connections.length > 0;
    }

    /** Connects the output with a compatible input port */
    public connect(input: Input<TValue>): Connection<TValue> {
        return new Connection(this, input);
    }

    /** Disposes the Output */
    public dispose() {
        for (const connection of this.connections) {
            connection.dispose();
        }

        this.connections = [];

        this.subscription.unsubscribe();
        this.unsubscribe();
    }
}
