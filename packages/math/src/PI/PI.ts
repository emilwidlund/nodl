import { Node, Output } from '@nodl/core';
import { Observable } from 'rxjs';

import { NumberSchema } from '../schemas/NumberSchema/NumberSchema';

export class PI extends Node {
    name = 'PI';

    inputs = {};

    outputs = {
        PI: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: new Observable(sub => {
                sub.next(Math.PI);
            })
        })
    };
}
