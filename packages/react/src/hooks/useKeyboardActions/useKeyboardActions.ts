import * as React from 'react';

import { CircuitStore } from '../../stores/CircuitStore/CircuitStore';
import { KeyboardKey } from '../../types';
import { KeyboardAction } from './useKeyboardActions.types';

export const useKeyboardActions = (store: CircuitStore) => {
    const removeNodes = React.useCallback(() => {
        for (const node of store.selectedNodes || []) {
            node.dispose();
            store.removeNode(node.id);
        }

        store.selectNodes([]);
    }, [store]);

    const selectAllNodes = React.useCallback(() => {
        const nodes = Array.from(store.nodes.values() || []);
        store.selectNodes(nodes);
    }, [store]);

    const deselectAllNodes = React.useCallback(() => {
        if (store.selectedNodes?.length) {
            store.selectNodes([]);
        }
    }, [store]);

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
