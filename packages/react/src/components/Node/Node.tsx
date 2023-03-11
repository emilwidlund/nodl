/** @jsxImportSource @emotion/react */
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

import { NODE_POSITION_OFFSET_X } from '../../constants';
import { useHover } from '../../hooks/useHover/useHover';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';
import { fromCanvasCartesianPoint } from '../../utils/coordinates/coordinates';
import { Port } from '../Port/Port';
import {
    nodeHeaderWrapperStyles,
    nodeContentWrapperStyles,
    nodeWrapperStyles,
    nodePortsWrapperStyles,
    nodeHeaderActionsStyles,
    nodeActionStyles,
    nodeHeaderNameWrapperStyle,
    nodeWindowWrapperStyles
} from './Node.styles';
import { NodeActionProps, NodePortsProps, NodeProps } from './Node.types';

export const Node = observer(({ node, actions, window }: NodeProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { onMouseEnter, onMouseLeave, isHovered } = useHover();
    const { store } = React.useContext(StoreContext);

    React.useEffect(() => {
        if (ref.current) {
            store.setNodeElement(node.id, ref.current);

            return () => {
                store.removeNodeElement(node.id);
            };
        }
    }, [ref]);

    const handleOnClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!store.selectedNodes?.includes(node)) {
                store.selectNodes([node]);
            }
        },
        [node]
    );

    const handleOnFocus = React.useCallback(() => {
        if (!store.selectedNodes?.includes(node)) {
            store.selectNodes([node]);
        }
    }, [node]);

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
        [node]
    );

    const handleRemoveNode = React.useCallback(() => {
        node.dispose();

        store.removeNode(node.id);
    }, [node]);

    const active = store.selectedNodes?.indexOf(node) !== -1;
    const position = store.nodePositions.get(node.id) || { x: 0, y: 0 };

    return (
        <Draggable
            nodeRef={ref}
            position={fromCanvasCartesianPoint(position.x - NODE_POSITION_OFFSET_X, position.y)}
            onDrag={handleOnDrag}
            handle=".handle"
        >
            <div
                ref={ref}
                css={nodeWrapperStyles(active)}
                onClick={handleOnClick}
                onFocus={handleOnFocus}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                tabIndex={0}
            >
                <div css={nodeHeaderWrapperStyles(active)} className={'handle'}>
                    <div css={nodeHeaderNameWrapperStyle}>
                        <span>{node.name}</span>
                    </div>
                    <div css={nodeHeaderActionsStyles(isHovered || active)}>
                        <NodeAction color="#ff4444" onClick={handleRemoveNode} />
                    </div>
                </div>
                {window ? <div css={nodeWindowWrapperStyles} children={window} /> : undefined}
                <div css={nodeContentWrapperStyles}>
                    <NodePorts ports={Object.values(node.inputs)} />
                    <NodePorts ports={Object.values(node.outputs)} isOutputWrapper={true} />
                </div>
            </div>
        </Draggable>
    );
});

const NodeAction = ({ color = '#fff', onClick }: NodeActionProps) => {
    return <div css={nodeActionStyles(color)} color={color} onClick={onClick} />;
};

const NodePorts = ({ ports, isOutputWrapper }: NodePortsProps) => {
    return (
        <div css={nodePortsWrapperStyles(isOutputWrapper)}>
            {ports.map(port => (
                <Port key={port.id} port={port} />
            ))}
        </div>
    );
};
