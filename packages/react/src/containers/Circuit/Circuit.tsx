/** @jsxImportSource @emotion/react */
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Canvas } from '../../components/Canvas/Canvas';
import { Connection } from '../../components/Connection/Connection';
import { Node } from '../../components/Node/Node';
import { CANVAS_SIZE } from '../../constants';
import { useKeyboardActions } from '../../hooks/useKeyboardActions/useKeyboardActions';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';
import { normalizeBounds } from '../../utils/bounds/bounds';
import { circuitContainerStyles, circuitSelectionStyles } from './Circuit.styles';
import { CircuitProps } from './Circuit.types';

const Nodes = observer(() => {
    const { store } = React.useContext(StoreContext);

    return (
        <>
            {store.nodes.map(node => (
                <Node key={node.id} node={node} />
            ))}
        </>
    );
});

const Connections = observer(() => {
    const ref = React.useRef<SVGSVGElement>(null);
    const { store } = React.useContext(StoreContext);

    const onClick = React.useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (ref.current === e.target) {
            store.selectNodes([]);
        }
    }, []);

    return (
        <svg ref={ref} id="connections" width="100%" height="100%" onClick={onClick}>
            {store.connections.map(connection => (
                <Connection key={connection.id} connection={connection} />
            ))}

            {store.draftConnectionSource && <Connection output={store.draftConnectionSource} />}
        </svg>
    );
});

const Selection = observer(() => {
    const { store } = React.useContext(StoreContext);

    return store.selectionBounds ? <div css={circuitSelectionStyles(normalizeBounds(store.selectionBounds))} /> : null;
});

export const Circuit = observer(
    React.forwardRef<HTMLDivElement, CircuitProps>((props, ref) => {
        useKeyboardActions(props.store);

        const onMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.nativeEvent.clientX - rect.left;
            const y = e.nativeEvent.clientY - rect.top;

            props.store.setMousePosition({ x, y });

            if (props.store.selectionBounds) {
                const { x, y, width, height } = props.store.selectionBounds;

                const bounds = {
                    x,
                    y,
                    width: width + e.movementX,
                    height: height + e.movementY
                };

                props.store.setSelectionBounds(bounds);
            }
        }, []);

        const onMouseDown = React.useCallback(({ nativeEvent }: React.MouseEvent<HTMLDivElement>) => {
            if ((nativeEvent.target as HTMLDivElement).id === 'connections') {
                props.store.setSelectionBounds({
                    x: props.store.mousePosition.x,
                    y: props.store.mousePosition.y,
                    width: 0,
                    height: 0
                });
            }
        }, []);

        const onMouseUp = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            props.store.setDraftConnectionSource(null);
            props.store.setSelectionBounds(null);
        }, []);

        React.useEffect(() => {
            return reaction(
                () => props.store.connections,
                (connections, prevConnections) => {
                    const addedConnections = connections.filter(connection => !prevConnections.includes(connection));
                    const removedConnections = prevConnections.filter(connection => !connections.includes(connection));

                    if (addedConnections.length && props.onConnection) {
                        for (const connection of addedConnections) {
                            props.onConnection(connection);
                        }
                    }

                    if (removedConnections.length && props.onConnectionRemoval) {
                        for (const connection of removedConnections) {
                            props.onConnectionRemoval(connection);
                        }
                    }
                }
            );
        }, [props]);

        React.useEffect(() => {
            return reaction(
                () => props.store.nodes,
                (nodes, prevNodes) => {
                    const removedNodes = prevNodes.filter(node => !nodes.includes(node));

                    if (removedNodes.length && props.onNodeRemoval) {
                        for (const node of removedNodes) {
                            props.onNodeRemoval(node);
                        }
                    }
                }
            );
        }, [props]);

        React.useEffect(() => {
            return reaction(
                () => props.store.selectedNodes,
                (selectedNodes, prevSelectedNodes) => {
                    if (selectedNodes.length !== prevSelectedNodes.length) {
                        props.onSelectionChanged?.(selectedNodes);
                    }
                }
            );
        }, [props]);

        return (
            <StoreContext.Provider value={{ store: props.store }}>
                <Canvas
                    ref={ref}
                    className={props.className}
                    css={circuitContainerStyles}
                    size={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                >
                    <Nodes />
                    <Connections />
                    <Selection />
                </Canvas>
            </StoreContext.Provider>
        );
    })
);
