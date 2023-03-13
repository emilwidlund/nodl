import { Global } from '@emotion/react';
import { Circuit, CircuitStore } from '@nodl/react';
import * as color from 'color';
import * as React from 'react';

import { useNodeControls } from '../../hooks/useNodeControls';
import { useNodeWindowResolver } from '../../hooks/useNodeWindowResolver';
import { Color } from '../../nodes/ColorNode/ColorNode';
import { Mesh } from '../../nodes/MeshNode/MeshNode';
import { Mix } from '../../nodes/MixNode/MixNode';

/** Declare 3 nodes */
const colorNode = new Color();
const colorNode2 = new Color();
const mixNode = new Mix();
const meshNode = new Mesh();

/** Connect them together */
colorNode.outputs.rgb.connect(mixNode.inputs.a);
colorNode2.outputs.rgb.connect(mixNode.inputs.b);
mixNode.outputs.output.connect(meshNode.inputs.color);

/** Push color node's initial values */
colorNode.inputs.color.next(color('#00ffa2'));
colorNode2.inputs.color.next(color('#ff0048'));

const store = new CircuitStore();

export const App = () => {
    const nodeWindowResolver = useNodeWindowResolver();
    const { onSelection } = useNodeControls();

    React.useEffect(() => {
        store.setNodes([
            [colorNode, { x: -420, y: 400 }],
            [colorNode2, { x: -420, y: 0 }],
            [mixNode, { x: 0, y: 200 }],
            [meshNode, { x: 400, y: 200 }]
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
            <Circuit store={store} nodeWindowResolver={nodeWindowResolver} onSelectionChanged={onSelection} />
        </>
    );
};
