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
    public connection: Connection<TValue> | undefined;

    constructor(props: IInputProps<TValue>) {
        super(props.defaultValue);

        this.name = props.name || 'Untitled';
        this.type = props.type;
        this.defaultValue = props.defaultValue;
    }

    /** Determines if input is connected */
    public get connected(): boolean {
        return !!this.connection;
    }

    /** Disposes the Input */
    public dispose(): void {
        this.connection?.dispose();
        this.connection = undefined;

        this.unsubscribe();
    }
}
