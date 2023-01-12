# nodl

A library for node-based applications. Leveraged by RxJS and Zod.

![Visual representation of a Nodl node](assets/nodl.png?raw=true)

### Getting Started

#### Installation

```
npm install nodl
yarn add nodl
bun install nodl
```

### API

#### Core

```typescript
import { z } from 'zod';
import { Node, Input, Output } from 'nodl';
import { combineLatest, map } from 'rxjs';

/** Declare a zod schema for value validation */
const NumberSchema = z.number();

class Addition extends Node {
    inputs = {
        a: new Input({ name: 'A', type: NumberSchema, defaultValue: 0 }),
        b: new Input({ name: 'B', type: NumberSchema, defaultValue: 0 })
    };

    outputs = {
        output: new Output({
            name: 'Output',
            type: NumberSchema,
            observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                map(inputs => inputs.reduce((sum, value) => sum + value), 0)
            )
        })
    };
}

/** Declare 3 addition nodes */
const additionNode1 = new Addition();
const additionNode2 = new Addition();
const additionNode3 = new Addition();

/** Connect them together */
additionNode1.outputs.output.connect(additionNode3.inputs.a);
additionNode2.outputs.output.connect(additionNode3.inputs.b);

/**
 * The output of AdditionNode3 will fire with a new sum
 * everytime the inputs of AdditionNode1 and AdditionNode2 changes
 */
additionNode3.outputs.output.subscribe(console.log);
```

#### React

Coming soon.
