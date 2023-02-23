import { action, computed, makeObservable, observable } from 'mobx';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { Connection } from '../Connection/Connection';
import { IInputProps } from './Input.types';

export class Input<TValue = any> extends BehaviorSubject<TValue> {
    /** Identifier */
    public id: string = uuid();
    /** Name */
    public name: string;
    /** Type */
    public type: z.Schema;
    /** Default Value */
    public defaultValue: TValue;
    /** Associated Connection */
    public connection: Connection<TValue> | null;

    constructor(props: IInputProps<TValue>) {
        super(props.defaultValue);

        this.name = props.name || 'Untitled';
        this.type = props.type;
        this.defaultValue = props.defaultValue;
        this.connection = null;

        makeObservable(this, {
            id: observable,
            name: observable,
            type: observable,
            defaultValue: observable,
            connection: observable,
            connected: computed,
            dispose: action
        });
    }

    /** Determines if input is connected */
    public get connected(): boolean {
        return !!this.connection;
    }

    /** Disposes the Input */
    public dispose(): void {
        this.connection?.dispose();
        this.connection = null;

        this.unsubscribe();
    }
}
