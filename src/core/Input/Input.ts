import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import 'reflect-metadata';

import { IInputProps } from './Input.types';

export class Input<T = any> extends BehaviorSubject<T> {
    /** Identifier */
    public id: string = uuid();
    /** Name */
    public name: string;
    /** Type */
    public type: object;
    /** Default Value */
    public defaultValue: T;

    constructor(props: IInputProps<T>) {
        super(props.defaultValue);

        this.name = props.name || 'Untitled';
        this.type = props.type;
        this.defaultValue = props.defaultValue;
    }
}
