import { Node, Input, Output } from '@nodl/core';
import { combineLatest, map } from 'rxjs';

import { NumberSchema } from '../../schemas/NumberSchema/NumberSchema';

export class Power extends Node {
    name = 'Power';

    inputs = {
        x: new Input({ name: 'X', type: NumberSchema, defaultValue: 0 }),
        y: new Input({ name: 'Y', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: combineLatest([this.inputs.x, this.inputs.y]).pipe(map(([x, y]) => Math.pow(x, y)))
        })
    };
}
