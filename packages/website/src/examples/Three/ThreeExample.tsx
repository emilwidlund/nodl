import BrowserOnly from '@docusaurus/BrowserOnly';
import { Circuit, CircuitStore } from '@nodl/react';
import color from 'color';
import { LevaPanel } from 'leva';
import * as React from 'react';

import { useNodeControls } from './hooks/useNodeControls';
import { useNodeWindowResolver } from './hooks/useNodeWindowResolver';
import { Clock } from './nodes/ClockNode/ClockNode';
import { Color } from './nodes/ColorNode/ColorNode';
import { Mesh } from './nodes/MeshNode/MeshNode';
import { Mix } from './nodes/MixNode/MixNode';
import { Vector3 } from './nodes/Vector3Node/Vector3Node';
import styles from './ThreeExample.module.css';

const colorNode = new Color();
const colorNode2 = new Color();
const mixNode = new Mix();
const clockNode = new Clock();
const rotationNode = new Vector3();
const meshNode = new Mesh();

/** Connect them together */
colorNode.outputs.rgb.connect(mixNode.inputs.a);
colorNode2.outputs.rgb.connect(mixNode.inputs.b);
mixNode.outputs.output.connect(meshNode.inputs.color);
clockNode.outputs.elapsed.connect(rotationNode.inputs.x);
clockNode.outputs.elapsed.connect(rotationNode.inputs.y);
rotationNode.outputs.output.connect(meshNode.inputs.rotation);

/** Push color node's initial values */
colorNode.inputs.color.next(color('#0070ff'));
colorNode2.inputs.color.next(color('#ff0048'));

const store = new CircuitStore();

export const ThreeExample = () => {
    const nodeWindowResolver = useNodeWindowResolver();
    const { levaStore, onSelection } = useNodeControls();

    React.useEffect(() => {
        store.setNodes([
            [colorNode, { x: -420, y: 450 }],
            [colorNode2, { x: -420, y: 50 }],
            [mixNode, { x: 0, y: 150 }],
            [clockNode, { x: -420, y: -350 }],
            [rotationNode, { x: 0, y: -200 }],
            [meshNode, { x: 400, y: 150 }]
        ]);

        return () => {
            store.dispose();
        };
    }, []);
    return (
        <BrowserOnly>
            {() => (
                <div style={{ position: 'relative', height: 1200 }}>
                    <LevaPanel store={levaStore} titleBar={{ position: { x: -20, y: 80 } }} />
                    <Circuit
                        className={styles.circuit}
                        store={store}
                        nodeWindowResolver={nodeWindowResolver}
                        onSelectionChanged={onSelection}
                    />
                </div>
            )}
        </BrowserOnly>
    );
};
