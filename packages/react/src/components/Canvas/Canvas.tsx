import { cx } from '@emotion/css';
import * as React from 'react';

import { fromCartesianPoint } from '../../utils/coordinates/coordinates';
import { canvasWrapperStyles, canvasContentStyles } from './Canvas.styles';
import { CanvasProps } from './Canvas.types';

export const Circuit = React.forwardRef<HTMLDivElement, CanvasProps>(
    ({ children, size, className, onMouseMove, onClick, onMouseDown, onMouseUp }: CanvasProps, ref) => {
        const scrollRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            if (scrollRef.current) {
                const { x, y } = fromCartesianPoint(size.width, size.height, 0, 0);
                const { x: offsetX, y: offsetY } = fromCartesianPoint(
                    scrollRef.current.clientWidth,
                    scrollRef.current.clientHeight,
                    0,
                    0
                );

                scrollRef.current.scrollTo({ left: x - offsetX, top: y - offsetY });
            }
        }, []);

        return (
            <div ref={scrollRef} className={cx(canvasWrapperStyles, className)}>
                <div
                    ref={ref}
                    className={cx(canvasContentStyles(size), 'canvas')}
                    children={children}
                    onMouseMove={onMouseMove}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onClick={onClick}
                />
            </div>
        );
    }
);
