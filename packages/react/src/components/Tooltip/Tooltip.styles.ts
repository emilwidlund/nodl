import { css } from '@emotion/react';

import { TooltipPosition } from './Tooltip.types';

const getPositionalStyles = (
    position: TooltipPosition,
    dimensions: { width: number; height: number },
    offset: { x: number; y: number } = { x: 0, y: 0 }
) => {
    const generalOffset = -10;
    const combinedOffset = { x: -offset.x + generalOffset, y: -offset.y + generalOffset };
    const { x, y } = combinedOffset;
    const [verticalOffset, horizontalOffset] = [
        `calc(${y}px + -${dimensions.height}px)`,
        `calc(${x}px + -${dimensions.width}px)`
    ];

    switch (position) {
        case TooltipPosition.TOP:
            return css`
                top: ${verticalOffset};
                left: 50%;
                transform: translate(-50%, -50%);
            `;
        case TooltipPosition.TOP_RIGHT:
            return css`
                top: ${verticalOffset};
                right: ${horizontalOffset};
            `;
        case TooltipPosition.RIGHT:
            return css`
                right: ${horizontalOffset};
            `;
        case TooltipPosition.BOTTOM_RIGHT:
            return css`
                right: ${horizontalOffset};
                bottom: ${verticalOffset};
            `;
        case TooltipPosition.BOTTOM:
            return css`
                bottom: ${verticalOffset};
                left: 50%;
                transform: translate(-50%, -50%);
            `;
        case TooltipPosition.BOTTOM_LEFT:
            return css`
                bottom: ${verticalOffset};
                left: ${horizontalOffset};
            `;
        case TooltipPosition.LEFT:
            return css`
                left: ${horizontalOffset};
            `;
        case TooltipPosition.TOP_LEFT:
            return css`
                left: ${horizontalOffset};
                top: ${verticalOffset};
            `;
    }
};

export const tooltipNodeWrapperStyles = (
    position: TooltipPosition,
    dimensions: { width: number; height: number },
    offset?: { x: number; y: number }
) => css`
    --tooltip-background-color: var(--panel-background);

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    position: absolute;
    display: flex;
    flex-direction: row;
    padding: 6px 8px;
    border-radius: 6px;
    background-color: var(--tooltip-background-color);
    color: var(--text-light-color);
    font-size: var(--font-size-xxs);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-feature-settings: 'ss02' 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 79;
    white-space: nowrap;
    animation: fade 0.2s;
    ${getPositionalStyles(position, dimensions, offset)}
`;

export const tooltipWrapperStyles = css`
    display: flex;
`;
