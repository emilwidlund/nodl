import { Node, Output } from '@nodl/core';
import { Observable } from 'rxjs';

import { NumberSchema } from '../schemas/NumberSchema/NumberSchema';

export class Euler extends Node {
    name = 'Euler';

    inputs = {};

    outputs = {
        Euler: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: new Observable(sub => {
                sub.next(Math.E);
            })
        })
    };
}
