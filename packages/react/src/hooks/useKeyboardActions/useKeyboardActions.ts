import * as React from 'react';

import { store as canvasStore } from '../../stores/CanvasStore/CanvasStore';
import { KeyboardKey } from '../../types';
import { KeyboardAction } from './useKeyboardActions.types';

export const useKeyboardActions = () => {
    const removeNodes = React.useCallback(() => {
        for (const node of canvasStore.selectedNodes || []) {
            node.dispose();
        }
    }, []);

    const selectAllNodes = React.useCallback(() => {
        const nodes = Array.from(canvasStore.nodes.values() || []);
        canvasStore.selectNodes(nodes);
    }, []);

    const deselectAllNodes = React.useCallback(() => {
        if (canvasStore.selectedNodes?.length) {
            canvasStore.selectNodes([]);
        }
    }, []);

    const actions: KeyboardAction[] = React.useMemo(
        () => [
            /** Remove Nodes */
            {
                key: KeyboardKey.Delete,
                callback: removeNodes
            },
            {
                key: KeyboardKey.Backspace,
                callback: removeNodes
            },

            /** Select Nodes */
            {
                modifier: 'metaKey',
                key: 'a',
                callback: selectAllNodes
            },
            {
                modifier: 'ctrlKey',
                key: 'a',
                callback: selectAllNodes
            },

            /** Deselect Nodes */
            {
                key: KeyboardKey.Escape,
                callback: deselectAllNodes
            }
        ],
        [removeNodes, selectAllNodes, deselectAllNodes]
    );

    const downHandler = React.useCallback(
        (e: KeyboardEvent) => {
            for (const action of actions) {
                if (action.key === e.key) {
                    if (action.modifier && !e[action.modifier]) continue;
                    action.callback(e);
                }
            }
        },
        [actions]
    );

    React.useEffect(() => {
        window.addEventListener('keydown', downHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    }, []);
};
