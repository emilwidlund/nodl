import { css } from '@emotion/react';

export const canvasWrapperStyles = css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
`;

export const canvasContentStyles = (size: { width: number; height: number }) => css`
    position: relative;
    width: ${size.width}px;
    height: ${size.height}px;
    background-image: radial-gradient(#434437 5%, #1c1e2a 5%);
    background-position: 0 0;
    background-size: 30px 30px;
`;
