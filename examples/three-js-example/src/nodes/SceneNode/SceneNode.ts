import { Node, Input } from '@nodl/core';
import { Mesh, BoxGeometry, MeshPhongMaterial } from 'three';

import { MeshSchema } from '../../schemas/MeshSchema/MeshSchema';

export class Scene extends Node {
    inputs = {
        mesh: new Input({
            name: 'Mesh',
            type: MeshSchema,
            defaultValue: new Mesh(new BoxGeometry(), new MeshPhongMaterial())
        })
    };

    outputs = {};
}
