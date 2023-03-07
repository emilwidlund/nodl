/** @jsxImportSource @emotion/react */
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { fromCartesianPoint } from '../../utils/coordinates/coordinates';
import { canvasWrapperStyles, canvasContentStyles } from './Canvas.styles';
import { CanvasProps } from './Canvas.types';

export const Canvas = observer(
    React.forwardRef<HTMLDivElement, CanvasProps>(
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
                <div ref={scrollRef} css={canvasWrapperStyles} className={className}>
                    <div
                        ref={ref}
                        css={canvasContentStyles(size)}
                        className="canvas"
                        children={children}
                        onMouseMove={onMouseMove}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onClick={onClick}
                    />
                </div>
            );
        }
    )
);
