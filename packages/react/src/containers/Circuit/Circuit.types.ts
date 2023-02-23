import { Connection, Node } from '@nodl/core';

import { CircuitStore } from '../../stores/CircuitStore/CircuitStore';

export type CircuitProps = {
    store: CircuitStore;
    className?: string;
    onNodeRemoval?(node: Node): void;
    onConnection?(connection: Connection<unknown>): void;
    onConnectionRemoval?(connection: Connection<unknown>): void;
    onSelectionChanged?(nodes: Node[]): void;
};
