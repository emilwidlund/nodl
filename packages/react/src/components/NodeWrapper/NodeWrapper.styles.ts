import { css } from '@emotion/react';

export const NODE_CONTENT_PADDING = 12;

export const nodeWrapperStyles = (active: boolean) => css`
    --node-background: var(--panel-background);

    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: ${active ? 9 : 0};

    :focus {
        outline: none;
    }
`;
