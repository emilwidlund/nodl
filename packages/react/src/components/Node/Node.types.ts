import { Node } from '@nodl/core';
import { DraggableProps } from 'react-draggable';

export type NodeProps = {
    node: Node;
    headerComponent?: (node: Node) => JSX.Element;
    windowComponent?: (node: Node) => JSX.Element;
    bodyComponent?: (node: Node) => JSX.Element;
    className?: string;
    disabled?: boolean;
} & DraggableProps;
