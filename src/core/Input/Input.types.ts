import { z } from 'zod';

export interface IInputProps<T> {
    name?: string;
    type: z.Schema;
    defaultValue: T;
}
