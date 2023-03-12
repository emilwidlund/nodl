import { Connection, Node } from '@nodl/core';

import { CircuitStore } from '../../stores/CircuitStore/CircuitStore';

export type NodeWindowResolver = (node: Node) => JSX.Element | undefined;

export type CircuitProps = {
    store: CircuitStore;
    className?: string;
    nodeWindowResolver?: NodeWindowResolver;
    onNodeRemoval?(node: Node): void;
    onConnection?(connection: Connection<unknown>): void;
    onConnectionRemoval?(connection: Connection<unknown>): void;
    onSelectionChanged?(nodes: Node[]): void;
};
