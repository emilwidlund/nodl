import { css } from '@emotion/css';

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
`;
