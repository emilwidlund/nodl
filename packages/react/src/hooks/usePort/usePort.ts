import { Input, Output } from '@nodl/core';
import { useCallback, useEffect, useMemo, useRef, useContext } from 'react';

import { StoreContext } from '../../stores/CircuitStore/CircuitStore';

export const usePort = (port: Input | Output) => {
    const ref = useRef<HTMLDivElement>(null);
    const { store } = useContext(StoreContext);

    const isOutput = useMemo(() => 'connect' in port, [port]);

    useEffect(() => {
        if (ref.current) {
            store.setPortElement(port.id, ref.current);

            return () => {
                store.removePortElement(port.id);
            };
        }
    }, []);

    const onMouseDown = useCallback(() => {
        if (isOutput) {
            store.setDraftConnectionSource(port as Output<any>);
        }
    }, [isOutput]);

    const onMouseUp = useCallback(() => {
        if (!isOutput && store.draftConnectionSource) {
            store.commitDraftConnection(port as Input<any>);
        }
    }, [isOutput]);

    const onClick = useCallback(() => {
        if (port.connected) {
            const connections = 'connection' in port ? [port.connection] : port.connections;

            for (const connection of connections) {
                if (connection) {
                    connection.dispose();
                }
            }
        }
    }, [port]);

    return {
        ref,
        onMouseUp,
        onMouseDown,
        onClick
    };
};
