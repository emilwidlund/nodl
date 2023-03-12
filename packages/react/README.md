# @nodl/react

A React-implementation of the Nodl framework.

This library is powered by MobX under the hood; and may be observed by an external MobX-instance for UI reactivity.

[View Demo](https://codesandbox.io/s/agitated-elgamal-txqqql?file=/src/App.js)

![Visual representation of nodl](../../assets/nodl.png?raw=true)

### Getting Started

#### Installation

```
# Using NPM
npm install @nodl/core @nodl/react

# Using Yarn
yarn add @nodl/core @nodl/react

# Using Bun
bun install @nodl/core @nodl/react
```

#### Additional dependencies

Make sure to also install the following packages:

```
# Using NPM
npm install react react-dom rxjs zod

# Using Yarn
yarn add react react-dom rxjs zod

# Using Bun
bun install react react-dom rxjs zod
```

### API

#### Circuit

The fundamental piece which renders a surface with fully interactive Nodes & Connections.

Supports the following props:

-   `store: CircuitStore` A Circuit store which holds the internal circuit state along with associated nodes.
-   `className?: string` An optional className to assign the Circuit.
-   `nodeWindowResolver?: (node: Node) => JSX.Element` An optional function which can be used to render a custom "window" for given nodes.
-   `onConnection?(connection: Connection<unknown>)` An optional callback which fires when new connections are made.
-   `onConnectionRemoval?(connection: Connection<unknown>)` An optional callback which fires when connections are removed.
-   `onNodeRemoval?(node: Node)` An optional callback which fires when nodes are removed.
-   `onSelectionChanged?(nodes: Node[])` An optional callback which fires when selected nodes changes.

```typescript
const store = new CircuitStore();

store.setNodes([
    [additionNode1, { x: -220, y: 100 }],
    [additionNode2, { x: -220, y: -100 }],
    [additionNode3, { x: 220, y: 0 }]
]);

export const App = () => {
    return (
        <Circuit
            store={store}
            onConnection={connection => console.log('NEW CONNECTION', connection)}
            onConnectionRemoval={connection => console.log('REMOVED CONNECTION', connection)}
            onNodeRemoval={node => console.log('REMOVED NODE', node)}
            onSelectionChanged={nodes => console.log('SELECTION CHANGED', nodes)}
        />
    );
};
```

#### Circuit Store

The manager which is responsible for the circuit state.

##### Properties

-   `nodes: Node[]` The associated nodes.
-   `selectedNodes: Node[]` The currently selected nodes.
-   `selectionBounds: Bounds | null` The current selected area's bounds.
-   `mousePosition: MousePosition` Current mouse position within the Circuit surface.

##### Methods

-   `setNodes(nodesWithPosition: [Node, {x: number, y: number}][])` Used to initialize the store with nodes along with their position.
-   `removeNode(nodeId: Node['id'])` Removes a node from the store.
-   `selectNodes(nodes: Node[])` Selects the given nodes.
-   `dispose()` Disposes the store and its internal reactions.

### Example

```typescript
import { Node, Input, Output, schema } from '@nodl/core';
import { Circuit, CircuitStore } from '@nodl/react';
import * as React from 'react';
import { combineLatest, map } from 'rxjs';
import { z } from 'zod';

/** Declare a zod schema for value validation */
const NumberSchema = schema(z.number());

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

const store = new CircuitStore();

store.setNodes([
    [additionNode1, { x: -220, y: 100 }],
    [additionNode2, { x: -220, y: -100 }],
    [additionNode3, { x: 220, y: 0 }]
]);

export const App = () => {
    return (
        <Circuit
            store={store}
            onConnection={c => console.log('NEW CONNECTION', c)}
            onConnectionRemoval={c => console.log('REMOVED CONNECTION', c)}
            onNodeRemoval={n => console.log('REMOVED NODE', n)}
            onSelectionChanged={s => console.log('SELECTION CHANGED', s)}
        />
    );
};
```
