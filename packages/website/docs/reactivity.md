---
sidebar_position: 2
---

# Concepts

## Anatomy

### Nodes

Nodes are units that consists of inputs and outputs, which performs some kind of operation. They're conceptually very similar to functions, with the difference that outputs may be multiple, compared to a function's single return value.

An Addition Node may for instance have two inputs and a single output, which assigns the output the sum of the inputs.

![Visual representation of nodl](../static/img/nodl.png)

#### Inputs

Inputs are EventEmitter-like entities with an initial value; capable of emitting its current value upon mutation. Whenever its value is mutated, it emits the new value to its subscribers (most often Outputs on the same Node).

#### Outputs

Outputs are a little different. They're also EventEmitter-like entities, but they don't have an initial value. All Outputs are computed dynamically, and has an internal buffer with its last emitted value. Whenever a connection is established between an Output & an Input - the internal buffer will replay its last computed value and assign it to the Input (which in turn will emit its newly assigned value to its dependants).

### Connections

Connections are responsible for carrying values between Outputs & Inputs. Connections may only be initiated between an Output and an Input.

```typescript
const additionNode1 = new Addition();
const additionNode2 = new Addition();

const connection = additionNode1.outputs.output.connect(additionNode2.inputs.a);

/**
 * Call the dispose-method to disconnect
 * The input will fallback to its default value upon disconnection
 */
connection.dispose();
```

### Schemas

Nodl uses Zod for value validation. Each Input & Output has an assigned type; configured by a schema. Connected outputs & inputs must share the same underlying type schema.

```typescript
import { schema } from '@nodl/core';
import { z } from 'zod';
import * as color from 'color';

/** An appropriate name for this schema will be inferred automatically */
const NumberSchema = schema(z.number());

/** Pass an optional name if you want to define the schema name yourself */
const MyCustomSchema = schema(
    'Color',
    z.custom((value: any) => color(value))
);
```

## Reactivity

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

### Inputs

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
    name = 'Addition';

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

### Outputs

Outputs on the other hand are RxJS ReplaySubjects, storing its last emitted value in an internal buffer. This internal buffer will replay its contents on new connections, so that a new target input can receive its last emitted value.
