# nodl

A library for node-based applications. Leveraged by RxJS and Zod.

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
import { Context, Node, Input, Output } from 'nodl';
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

/** The context to bind the nodes to */
const context = new Context();

/** Declare 3 addition nodes */
const additionNode1 = new Addition(context);
const additionNode2 = new Addition(context);
const additionNode3 = new Addition(context);

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

```jsx
import * as React from 'react';
import { Canvas, Node } from 'nodl';

export const App = () => {
    const context = new Context();
    const addition = new Addition(context);

    return (
        <Canvas size={{ width: 5000, height: 5000 }}>
            {Array.from(context.nodes.values()).map(node => {
                return (
                    <Node
                        key={node.id}
                        node={node}
                        headerComponent={node => <MyHeader node={node} />}
                        windowComponent={node => <MyWindow node={node} />}
                        bodyComponent={node => <MyBody node={node} />}
                        bounds="parent"
                    />
                );
            })}
        </Canvas>
    );
};
```
