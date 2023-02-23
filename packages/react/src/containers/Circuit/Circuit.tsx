import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Canvas } from '../../components/Canvas/Canvas';
import { Connection } from '../../components/Connection/Connection';
import { Node } from '../../components/Node/Node';
import { CANVAS_SIZE } from '../../constants';
import { useKeyboardActions } from '../../hooks/useKeyboardActions/useKeyboardActions';
import { store as canvasStore } from '../../stores/CanvasStore/CanvasStore';
import { normalizeBounds } from '../../utils/bounds/bounds';
import { circuitContainerStyles, circuitSelectionStyles } from './Circuit.styles';
import { CircuitProps } from './Circuit.types';

const Nodes = observer(() => {
    return (
        <>
            {Array.from(canvasStore.nodes.values() || []).map(node => (
                <Node key={node.id} node={node} />
            ))}
        </>
    );
});

const Connections = observer(() => {
    const ref = React.useRef<SVGSVGElement>(null);

    const onClick = React.useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (ref.current === e.target) {
            canvasStore.selectNodes([]);
        }
    }, []);

    return (
        <svg ref={ref} id="connections" width="100%" height="100%" onClick={onClick}>
            {Array.from(canvasStore.connections.values() || []).map(connection => (
                <Connection key={connection.id} connection={connection} />
            ))}

            {canvasStore.draftConnectionSource && <Connection output={canvasStore.draftConnectionSource} />}
        </svg>
    );
});

const Selection = observer(() => {
    return canvasStore.selectionBounds ? (
        <div className={circuitSelectionStyles(normalizeBounds(canvasStore.selectionBounds))} />
    ) : null;
});

export const Circuit = observer(
    React.forwardRef<HTMLDivElement, CircuitProps>((props, ref) => {
        useKeyboardActions();

        const onMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;

            canvasStore.setMousePosition({ x, y });

            if (canvasStore.selectionBounds) {
                const { x, y, width, height } = canvasStore.selectionBounds;

                const bounds = {
                    x,
                    y,
                    width: width + e.movementX,
                    height: height + e.movementY
                };

                canvasStore.setSelectionBounds(bounds);
            }
        }, []);

        const onMouseDown = React.useCallback(({ nativeEvent }: React.MouseEvent<HTMLDivElement>) => {
            if ((nativeEvent.target as HTMLDivElement).id === 'connections') {
                canvasStore.setSelectionBounds({
                    x: canvasStore.mousePosition.x,
                    y: canvasStore.mousePosition.y,
                    width: 0,
                    height: 0
                });
            }
        }, []);

        const onMouseUp = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            canvasStore.setDraftConnectionSource(null);
            canvasStore.setSelectionBounds(null);
        }, []);

        React.useEffect(() => {
            canvasStore.setNodes(props.nodes);

            for (const node of props.nodes) {
                canvasStore.setNodePosition(node, { x: 0, y: 0 });
            }
        }, [props]);

        return (
            <Canvas
                ref={ref}
                className={circuitContainerStyles}
                size={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                <Nodes />
                <Connections />
                <Selection />
            </Canvas>
        );
    })
);
