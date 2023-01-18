import * as React from 'react';

type HoverEventHandler<TElement> = (
    event: React.MouseEvent<TElement>
) => ((event: React.MouseEvent<TElement>) => void) | void;

export const useHover = <TElement>(onHover?: HoverEventHandler<TElement>) => {
    const [isHovered, setHover] = React.useState(false);
    const cleanup = React.useRef<((event: React.MouseEvent<TElement>) => void) | void>();

    const onMouseEnter = React.useCallback((e: React.MouseEvent<TElement>) => {
        setHover(true);
        cleanup.current = onHover?.(e);
    }, []);

    const onMouseLeave = React.useCallback((e: React.MouseEvent<TElement>) => {
        setHover(false);
        cleanup.current?.(e);
    }, []);

    return {
        onMouseEnter,
        onMouseLeave,
        isHovered
    };
};
