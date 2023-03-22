/** @jsxImportSource @emotion/react */
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import { nodeWrapperStyles } from './NodeWrapper.styles';
import { NodeWrapperProps } from './NodeWrapper.types';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';

export const NodeWrapper = observer(({ node, children }: NodeWrapperProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [nodeWidth, setNodeWidth] = React.useState(0);
    const { store } = React.useContext(StoreContext);

    React.useEffect(() => {
        if (ref.current) {
            store.setNodeElement(node.id, ref.current);

            setNodeWidth(ref.current.getBoundingClientRect().width);

            return () => {
                store.removeNodeElement(node.id);
            };
        }
    }, [ref, store]);

    const handleOnClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!store.selectedNodes?.includes(node)) {
                store.selectNodes([node]);
            }
        },
        [node, store]
    );

    const handleOnFocus = React.useCallback(() => {
        if (!store.selectedNodes?.includes(node)) {
            store.selectNodes([node]);
        }
    }, [node, store]);

    const handleOnDrag: DraggableEventHandler = React.useCallback(
        (e, { deltaX, deltaY }) => {
            e.preventDefault();
            e.stopPropagation();

            for (const selectedNode of store.selectedNodes || []) {
                store.setNodePosition(selectedNode.id, {
                    x: (store.nodePositions.get(selectedNode.id)?.x || 0) + deltaX,
                    y: (store.nodePositions.get(selectedNode.id)?.y || 0) + -deltaY
                });
            }
        },
        [node, store]
    );

    const active = store.selectedNodes?.indexOf(node) !== -1;
    const position = store.nodePositions.get(node.id) || { x: 0, y: 0 };

    return (
        <Draggable
            nodeRef={ref}
            position={store.fromCanvasCartesianPoint(position.x - nodeWidth / 2, position.y)}
            onDrag={handleOnDrag}
            handle=".handle"
        >
            <div ref={ref} css={nodeWrapperStyles(active)} onClick={handleOnClick} onFocus={handleOnFocus} tabIndex={0}>
                {children}
            </div>
        </Draggable>
    );
});
