import { Node, Input, Output } from '@nodl/core';
import color from 'color';
import { combineLatest, map } from 'rxjs';

import { ColorSchema } from '../../schemas/ColorSchema/ColorSchema';

export class Mix extends Node {
    inputs = {
        a: new Input({ name: 'A', type: ColorSchema, defaultValue: color('#000') }),
        b: new Input({ name: 'B', type: ColorSchema, defaultValue: color('#000') })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: ColorSchema,
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                map(inputs => inputs.reduce((sum, value) => sum.mix(value)), color('#000'))
            )
        })
    };
}
