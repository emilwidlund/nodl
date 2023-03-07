import { css } from '@emotion/react';

import { Bounds } from '../../utils/bounds/bounds.types';

export const circuitSelectionStyles = ({ x, y, width, height }: Bounds) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: ${width}px;
    height: ${height}px;
    transform: translate(${x}px, ${y}px);
    border: 1px solid var(--accent-color);
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 29;
`;

export const circuitContainerStyles = css`
    position: absolute;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
    font-size: 12px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    // Font Sizes
    --font-size-hero: 5em;
    --font-size-xl: 4em;
    --font-size-lg: 3em;
    --font-size-md: 2em;
    --font-size-sm: 1.2em;
    --font-size-xs: 1em;
    --font-size-xxs: 0.8em;

    // Colors
    --dark-contrast-background: #12141c;
    --dark-background: #1c1e2a;
    --panel-background: #242736;
    --light-background: #fff;
    --neutral-background: #f4f4f4;
    --border-color: #34384e;
    --connection-color: #424763;
    --accent-color: #1e62ff;
    --accent-color-subtle: rgba(30, 98, 255, 0.8);
    --text-light-color: #fff;
    --text-neutral-color: #7b7e8c;
    --text-dark-color: #000;

    --system-red: #ff4444;
    --system-yellow: #ffdd00;

    :root {
        font-family: 'Inter', sans-serif;
    }

    @supports (font-variation-settings: normal) {
        :root {
            font-family: 'Inter var', sans-serif;
        }
    }
`;
