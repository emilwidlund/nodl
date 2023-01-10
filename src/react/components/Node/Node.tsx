import * as React from 'react';
import Draggable from 'react-draggable';
import { NodeProps } from './Node.types';

export const Node = React.forwardRef<HTMLDivElement>(({headerComponent,  windowComponent, bodyComponent, options}: NodeProps, ref) => {

    return (
        <Draggable {...options}>
            <div ref={ref}>
                <div className='handle'>
                    {headerComponent}
                </div>
                {windowComponent ? <div>{windowComponent}</div> : undefined}
                <div>
                    {bodyComponent}
                </div>
            </div>
        </Draggable>
    );
})