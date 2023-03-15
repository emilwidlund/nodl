import { Input, Output, Node, schema } from '@nodl/core';
import { combineLatest, map } from 'rxjs';
import { z } from 'zod';

export const NumberSchema = schema(z.number());

export class Addition extends Node {
    name = 'Addition';

    inputs = {
        a: new Input({ name: 'A', type: NumberSchema, defaultValue: 0 }),
        b: new Input({ name: 'B', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                map(inputs => inputs.reduce((sum, value) => sum + value), 0)
            )
        })
    };
}
