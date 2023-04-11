import { Node, Input, Output } from '@nodl/core';
import { combineLatest, map } from 'rxjs';

import { NumberSchema } from '../../schemas/NumberSchema/NumberSchema';

export class Modulo extends Node {
    name = 'Modulo';

    inputs = {
        a: new Input({ name: 'A', type: NumberSchema, defaultValue: 1 }),
        b: new Input({ name: 'B', type: NumberSchema, defaultValue: 1 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                map(inputs => inputs.reduce((sum, value) => sum % value))
            )
        })
    };
}
