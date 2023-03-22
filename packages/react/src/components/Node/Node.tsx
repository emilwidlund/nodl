/** @jsxImportSource @emotion/react */
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import {
    nodeHeaderWrapperStyles,
    nodeContentWrapperStyles,
    nodeContainerStyles,
    nodePortsWrapperStyles,
    nodeHeaderActionsStyles,
    nodeActionStyles,
    nodeHeaderNameWrapperStyle,
    nodeWindowWrapperStyles
} from './Node.styles';
import { NodeActionProps, NodePortsProps, NodeProps } from './Node.types';
import { useHover } from '../../hooks/useHover/useHover';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';
import { NodeWrapper } from '../NodeWrapper/NodeWrapper';
import { Port } from '../Port/Port';

export const Node = observer(({ node, window }: NodeProps) => {
    const { onMouseEnter, onMouseLeave, isHovered } = useHover();
    const { store } = React.useContext(StoreContext);

    const handleRemoveNode = React.useCallback(() => {
        node.dispose();

        store.removeNode(node.id);
    }, [node]);

    const active = store.selectedNodes?.indexOf(node) !== -1;

    return (
        <NodeWrapper node={node}>
            <div css={nodeContainerStyles(active)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
        </NodeWrapper>
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
