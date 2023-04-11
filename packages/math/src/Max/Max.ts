import { Node, Input, Output } from '@nodl/core';
import { combineLatest, map } from 'rxjs';

import { NumberSchema } from '../schemas/NumberSchema/NumberSchema';

export class Max extends Node {
    name = 'Max';

    inputs = {
        a: new Input({ name: 'A', type: NumberSchema, defaultValue: 0 }),
        b: new Input({ name: 'B', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(map(([a, b]) => Math.max(a, b)))
        })
    };
}
