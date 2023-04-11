import { Input, Node, Output, schema } from '@nodl/core';
import { combineLatest, map } from 'rxjs';
import * as THREE from 'three';
import z from 'zod';

export class Vector3 extends Node {
    name = 'Vector3';
    cachedVector: THREE.Vector3 = new THREE.Vector3();

    inputs = {
        x: new Input({
            name: 'X',
            type: schema(z.number()),
            defaultValue: 0
        }),
        y: new Input({
            name: 'Y',
            type: schema(z.number()),
            defaultValue: 0
        }),
        z: new Input({
            name: 'Z',
            type: schema(z.number()),
            defaultValue: 0
        })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: schema('Vector3', z.instanceof(THREE.Vector3)),
            observable: combineLatest([this.inputs.x, this.inputs.y, this.inputs.z]).pipe(
                map(([x, y, z]) => {
                    this.cachedVector.x = x * 0.01;
                    this.cachedVector.y = y * 0.01;
                    this.cachedVector.z = z * 0.01;

                    return this.cachedVector;
                })
            )
        })
    };
}
