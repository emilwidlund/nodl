import { Node, Input, Output } from '@nodl/core';
import * as color from 'color';
import { map } from 'rxjs';

import { ColorSchema } from '../../schemas/ColorSchema/ColorSchema';

export class Color extends Node {
    name = 'Color';

    inputs = {
        color: new Input({
            name: 'Color',
            type: ColorSchema,
            defaultValue: color('#fff')
        })
    };

    outputs = {
        rgb: new Output({
            name: 'RGB',
            type: ColorSchema,
            observable: this.inputs.color.asObservable()
        }),
        red: new Output({
            name: 'Red',
            type: ColorSchema,
            observable: this.inputs.color.pipe(map(value => color([value.red()])))
        }),
        green: new Output({
            name: 'Green',
            type: ColorSchema,
            observable: this.inputs.color.pipe(map(value => color([0, value.green()])))
        }),
        blue: new Output({
            name: 'Blue',
            type: ColorSchema,
            observable: this.inputs.color.pipe(map(value => color([0, 0, value.blue()])))
        })
    };
}
