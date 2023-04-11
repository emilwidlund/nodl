import { Node, Input, Output } from '@nodl/core';
import { map } from 'rxjs';

import { NumberSchema } from '../schemas/NumberSchema/NumberSchema';

export class Sign extends Node {
    name = 'Sign';

    inputs = {
        input: new Input({ name: 'Input', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: this.inputs.input.pipe(map(input => Math.sign(input)))
        })
    };
}
