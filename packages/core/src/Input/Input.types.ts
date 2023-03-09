import { Schema } from '../Schema/Schema.types';

export interface IInputProps<T> {
    name?: string;
    type: Schema;
    defaultValue: T;
}
