import { Node } from '@nodl/core';

import { CircuitStore } from './CircuitStore';

export type MousePosition = {
    x: number;
    y: number;
};

export type NodeWithPosition = [Node, { x: number; y: number }];

export type StoreProviderValue = {
    store: CircuitStore;
};
