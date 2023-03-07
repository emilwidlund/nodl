import { css } from '@emotion/react';

export const portWrapperStyles = (highlighted: boolean, reverseDirection: boolean, disabled: boolean) => css`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    padding: 4px 0;
    font-size: var(--font-size-xxs);
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 0.1em;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: opacity 0.15s;

    ${reverseDirection ? 'padding-left' : 'padding-right'}: 16px;
    flex-direction: ${reverseDirection ? 'row-reverse' : 'row'};
    color: ${highlighted ? 'var(--text-light-color)' : 'var(--text-neutral-color)'};
    opacity: ${disabled ? 0.33 : 1};
`;

export const portTypeStyles = (
    connected: boolean,
    isOutput: boolean,
    isParentHovered: boolean,
    isHovered: boolean
) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0;
    border-radius: 4px;
    background-color: ${connected
        ? isHovered
            ? 'var(--system-red)'
            : 'var(--accent-color)'
        : isParentHovered
        ? 'var(--accent-color)'
        : 'rgba(255, 255, 255, 0.1)'};
    color: ${connected || isParentHovered ? 'var(--text-light-color)' : 'var(--text-neutral-color)'};
    width: 16px;
    height: 16px;
    transition: color 0.15s, background-color 0.15s;

    ${isOutput ? 'margin-left: 8px;' : 'margin-right: 8px;'}
`;
