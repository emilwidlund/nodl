import { Node, Input, Output } from '@nodl/core';
import color from 'color';
import { map } from 'rxjs';
import * as THREE from 'three';
import { BoxGeometry, MeshPhongMaterial } from 'three';

import { ColorSchema } from '../../schemas/ColorSchema/ColorSchema';
import { MeshSchema } from '../../schemas/MeshSchema/MeshSchema';

export class Mesh extends Node {
    name = 'Mesh';

    inputs = {
        color: new Input({
            name: 'Color',
            type: ColorSchema,
            defaultValue: color('#fff')
        })
    };

    outputs = {
        mesh: new Output({
            name: 'Mesh',
            type: MeshSchema,
            observable: this.inputs.color.pipe(
                map(
                    color =>
                        new THREE.Mesh(
                            new BoxGeometry(),
                            new MeshPhongMaterial({ color: new THREE.Color(color.hex()) })
                        )
                )
            )
        })
    };
}
