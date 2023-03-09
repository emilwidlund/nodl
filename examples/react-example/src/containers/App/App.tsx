import { Global } from '@emotion/react';
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

export const App = () => {
    const store = new CircuitStore();

    React.useEffect(() => {
        store.setNodes([
            [additionNode1, { x: -220, y: 100 }],
            [additionNode2, { x: -220, y: -100 }],
            [additionNode3, { x: 220, y: 0 }]
        ]);

        return () => {
            store.dispose();
        };
    }, []);

    return (
        <>
            <Global
                styles={{
                    body: {
                        margin: 0,
                        backgroundColor: '#1c1e2a'
                    }
                }}
            />
            <Circuit
                store={store}
                onConnection={c => console.log('NEW CONNECTION', c)}
                onConnectionRemoval={c => console.log('REMOVED CONNECTION', c)}
                onNodeRemoval={n => console.log('REMOVED NODE', n)}
                onSelectionChanged={s => console.log('SELECTION CHANGED', s)}
            />
        </>
    );
};
