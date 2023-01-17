import * as React from 'react';
import Draggable from 'react-draggable';

import { NodeProps } from './Node.types';

export const Node = React.forwardRef<HTMLDivElement, NodeProps>(
    ({ node, className, headerComponent, windowComponent, bodyComponent, ...draggableOptions }: NodeProps, ref) => {
        return (
            <Draggable {...draggableOptions}>
                <div className={className} ref={ref}>
                    <div className="handle">{headerComponent?.(node)}</div>
                    {windowComponent ? <div>{windowComponent?.(node)}</div> : undefined}
                    <div>{bodyComponent?.(node)}</div>
                </div>
            </Draggable>
        );
    }
);
