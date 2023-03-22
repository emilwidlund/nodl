import { Node } from '@nodl/core';
import { PropsWithChildren } from 'react';
import { DraggableProps } from 'react-draggable';

export type NodeWrapperProps = PropsWithChildren<
    {
        node: Node;
        className?: string;
    } & Partial<DraggableProps>
>;
