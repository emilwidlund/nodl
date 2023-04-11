---
sidebar_position: 3
---

# Reactivity

Reactivity in the Nodl-framework is achieved by leveraging the power of RxJS - a library for reactive programming using observables. It offers a wide array of powerful utilities & operations on value streams, which suits the concept of node graphs very well.

```typescript
import { combineLatest, map } from 'rxjs';
import { z } from 'zod';

import { Input } from '../Input/Input';
import { Output } from '../Output/Output';
import { schema } from '../Schema/Schema';
import { Node } from './Node';

export const NumberSchema = schema(z.number());

export class Addition extends Node {
    name = 'Addition';

    inputs = {
        a: new Input({ name: 'A', type: NumberSchema, defaultValue: 0 }),
        b: new Input({ name: 'B', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            /** Dynamically computed whenever input A or input B is mutated */
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                map(inputs => inputs.reduce((sum, value) => sum + value), 0)
            )
        })
    };
}
```

## Inputs

All Nodl-inputs are effectively RxJS BehaviorSubjects - an EventEmitter-like structure with an initial value; capable of emitting its current value upon mutation.

```typescript
const additionNode = new Addition();

/**
 * Emits a new value through input A
 * The addition's output will automatically be re-computed with a new value
 */
additionNode.inputs.a.next(100);
```

Inputs can easily be converted to observables if needed.

```typescript
import { Node, Input, Output, schema } from '@nodl/core';
import * as THREE from 'three';
import { map } from 'rxjs';
import { z } from 'zod';

const ColorSchema = schema('Color', z.instanceOf(THREE.Color));

export class Color extends Node {
    name = 'Color';

    inputs = {
        color: new Input({
            name: 'Color',
            type: ColorSchema,
            defaultValue: new THREE.Color('#fff')
        })
    };

    outputs = {
        rgb: new Output({
            name: 'RGB',
            type: ColorSchema,
            /** This will simply pass along input color's value */
            observable: this.inputs.color.asObservable()
        })
    };
}
```

## Outputs

Outputs on the other hand are RxJS ReplaySubjects, storing its last emitted value in an internal buffer. This internal buffer will replay its contents on new connections, so that a new target input can receive its last emitted value.
