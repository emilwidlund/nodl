# @nodl/core

The core implementation of the Nodl framework.

### Getting Started

#### Installation

```
# Using NPM
npm install @nodl/core

# Using Yarn
yarn add @nodl/core

# Using Bun
bun install @nodl/core
```

### API

#### Node

Nodes are units that consists of inputs and outputs. They're conceptually very similar to functions, with the difference that outputs may be multiple, compared to a function's single return value. 

An Addition Node may for instance have two inputs and a single output, which computes the sum of the inputs.

```typescript
import { z } from 'zod';
import { Node, Input, Output } from '@nodl/core';
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
```

### Example

```typescript
import { z } from 'zod';
import { Node, Input, Output } from '@nodl/core';
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
