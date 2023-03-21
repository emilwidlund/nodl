import { Node, Input, schema } from '@nodl/core';
import color from 'color';
import { combineLatest, map } from 'rxjs';
import * as THREE from 'three';
import z from 'zod';

import { ColorSchema } from '../../../../schemas/ColorSchema/ColorSchema';

export class Mesh extends Node {
    name = 'Mesh';

    inputs = {
        color: new Input({
            name: 'Color',
            type: ColorSchema,
            defaultValue: color('#fff')
        }),
        position: new Input({
            name: 'Position',
            type: schema('Vector3', z.instanceof(THREE.Vector3)),
            defaultValue: new THREE.Vector3()
        }),
        rotation: new Input({
            name: 'Rotation',
            type: schema('Vector3', z.instanceof(THREE.Vector3)),
            defaultValue: new THREE.Vector3()
        })
    };

    outputs = {};

    mesh = combineLatest([this.inputs.color, this.inputs.position, this.inputs.rotation]).pipe(
        map(([color, position, rotation]) => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(),
                new THREE.MeshPhongMaterial({ color: new THREE.Color(color.hex()) })
            );

            mesh.position.copy(position);
            mesh.rotation.setFromVector3(rotation);

            return mesh;
        })
    );
}
