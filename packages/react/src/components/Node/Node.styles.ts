import { css } from '@emotion/react';

import { NODE_WIDTH } from '../../constants';

export const NODE_CONTENT_PADDING = 12;

export const nodeWrapperStyles = (active: boolean) => css`
    --node-background: var(--panel-background);

    position: absolute;
    display: flex;
    flex-direction: column;
    width: ${NODE_WIDTH}px;
    user-select: none;
    -webkit-user-select: none;
    z-index: ${active ? 9 : 0};
    border-radius: 12px;
    transition: box-shadow 0.15s;
    font-feature-settings: 'ss02' 1;

    :focus {
        outline: none;
    }

    :active {
        box-shadow: ${active ? '0 0 20px rgba(0, 0, 0, 0.33)' : ''};
    }
`;

export const nodeHeaderWrapperStyles = (active: boolean) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 14px 12px 12px;
    font-size: var(--font-size-xxs);
    font-weight: 500;
    background-color: var(--node-background);
    line-height: 1;
    color: ${active ? `var(--text-light-color)` : `var(--text-neutral-color)`};
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: 2px solid ${active ? `var(--accent-color)` : `var(--border-color)`};
    text-transform: uppercase;
    letter-spacing: 0.1em;
`;

export const nodeHeaderNameWrapperStyle = css`
    display: flex;
    flex-direction: row;

    & > :first-child {
        margin-right: 8px;
        line-height: 0.6;
    }
`;

export const nodeHeaderActionsStyles = (active: boolean) => css`
    opacity: ${active ? 1 : 0};
    transition: opacity 0.15s;
`;

export const nodeActionStyles = (color: string) => css`
    opacity: 1;
    transition: opacity 0.1s;
    margin-left: 6px;
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background-color: ${color};

    &:hover {
        opacity: 0.4;
    }
`;

export const nodeWindowWrapperStyles = css`
    position: relative;
    display: flex;
    flex-direction: column;
`;

export const nodeContentWrapperStyles = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${NODE_CONTENT_PADDING}px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: var(--node-background);
`;

export const nodePortsWrapperStyles = (isOutputWrapper = false) => css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    ${isOutputWrapper ? 'align-items: flex-end;' : ''}
`;
