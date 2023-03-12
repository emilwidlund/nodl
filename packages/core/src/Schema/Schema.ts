import type { z } from 'zod';

import { Schema } from './Schema.types';

export function schema(name: string, schema: z.Schema): Schema;
export function schema(schema: z.Schema): Schema;
export function schema(...args: any[]): Schema {
    if (arguments.length > 1) {
        const [name, schema] = args;

        return {
            name,
            validator: schema
        };
    } else {
        const [schema] = args;

        return {
            name: schema.constructor.name.replace('Zod', ''),
            validator: schema
        };
    }
}
