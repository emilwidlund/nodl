import { Connection, Input, Node, Output } from '@nodl/core';
import { isEmpty, isEqual, xorWith } from 'lodash';
import { autorun, IReactionDisposer, makeAutoObservable } from 'mobx';
import { createContext } from 'react';

import { NODE_CENTER } from '../../constants';
import { normalizeBounds, withinBounds } from '../../utils/bounds/bounds';
import { Bounds } from '../../utils/bounds/bounds.types';
import { fromCanvasCartesianPoint } from '../../utils/coordinates/coordinates';
import { MousePosition, NodeWithPosition, StoreProviderValue } from './CircuitStore.types';

export class CircuitStore {
    /** Associated Nodes */
    public nodes: Node[] = [];
    /** Associated Node Elements */
    public nodeElements: Map<Node['id'], HTMLDivElement> = new Map();
    /** Node Positions */
    public nodePositions: Map<Node['id'], { x: number; y: number }> = new Map();
    /** Associated Port Elements */
    public portElements: Map<Input['id'] | Output['id'], HTMLDivElement> = new Map();
    /** Selected Nodes */
    public selectedNodes: Node[] = [];
    /** Draft Connection Source */
    public draftConnectionSource: Output | null = null;
    /** Selection bounds */
    public selectionBounds: Bounds | null = null;
    /** Mouse Position */
    public mousePosition: MousePosition = { x: 0, y: 0 };

    /** Selection Bounds autorun disposer */
    private selectionBoundsDisposer: IReactionDisposer;

    constructor() {
        makeAutoObservable(this);

        this.selectionBoundsDisposer = this.onSelectionBoundsChange();
    }

    /** All associated connections */
    public get connections() {
        return this.nodes
            .flatMap(node => node.connections)
            .filter((value, index, self) => self.indexOf(value) === index);
    }

    /** Sets the associated nodes */
    public setNodes(nodesWithPosition: NodeWithPosition[]) {
        for (const [node, position] of nodesWithPosition) {
            this.nodes.push(node);
            this.nodePositions.set(node.id, position);
        }
    }

    /** Removes a node from the store */
    public removeNode(nodeId: Node['id']) {
        this.nodes = this.nodes.filter(node => node.id !== nodeId);
        this.nodeElements.delete(nodeId);
        this.nodePositions.delete(nodeId);
    }

    /** Associates a given Node instance with an HTML Element */
    public setNodeElement(nodeId: Node['id'], portElement: HTMLDivElement): void {
        this.nodeElements.set(nodeId, portElement);
    }

    /** Clears a given Node's associated HTML Element from store */
    public removeNodeElement(nodeId: Node['id']): void {
        this.nodeElements.delete(nodeId);
    }

    /** Associates a given Input or Output instance with an HTML Element */
    public setPortElement(portId: Input['id'] | Output['id'], portElement: HTMLDivElement): void {
        this.portElements.set(portId, portElement);
    }

    /** Clears a given Input's or Output's associated HTML Element from store */
    public removePortElement(portId: Input['id'] | Output['id']): void {
        this.portElements.delete(portId);
    }

    /** Sets an Output as the current draft connection source */
    public setDraftConnectionSource(source: Output | null): void {
        this.draftConnectionSource = source;
    }

    /** Sets an Output as the current draft connection source */
    public commitDraftConnection<T>(target: Input<T>): Connection<T> | void {
        if (this.draftConnectionSource) {
            const connection = this.draftConnectionSource.connect(target);

            this.setDraftConnectionSource(null);

            return connection;
        }
    }

    /** Selects the given nodes */
    public selectNodes(nodes: Node[]): void {
        this.selectedNodes = nodes;
    }

    /** Sets the selection bounds */
    public setSelectionBounds(bounds: Bounds | null): void {
        this.selectionBounds = bounds;
    }

    /** Sets the mouse position */
    public setMousePosition(mousePosition: MousePosition): void {
        this.mousePosition = mousePosition;
    }

    /** Sets a node's position */
    public setNodePosition(nodeId: Node['id'], position: { x: number; y: number }) {
        this.nodePositions.set(nodeId, position);
    }

    /** Remove a node's position */
    public removeNodePosition(nodeId: Node['id']) {
        this.nodePositions.delete(nodeId);
    }

    /** Returns the node with the associated port */
    public getNodeByPortId(portId: Input['id'] | Output['id']) {
        return this.nodes.find(node => {
            return [...Object.values(node.inputs), ...Object.values(node.outputs)].some(port => port.id === portId);
        });
    }

    /** Disposes the store by cleaning up effects */
    public dispose(): void {
        this.nodes = [];
        this.nodeElements.clear();
        this.nodePositions.clear();
        this.portElements.clear();
        this.selectedNodes = [];
        this.selectionBounds = null;
        this.draftConnectionSource = null;
        this.mousePosition = { x: 0, y: 0 };

        this.selectionBoundsDisposer();
    }

    /** Automatically selects the nodes which are within the selection bounds */
    private onSelectionBoundsChange(): IReactionDisposer {
        return autorun(() => {
            if (this.selectionBounds) {
                const bounds = normalizeBounds(this.selectionBounds);

                const selectionCandidates = [];

                for (const node of this.nodes) {
                    const nodeElement = this.nodeElements.get(node.id);

                    if (nodeElement) {
                        const nodeRect = nodeElement.getBoundingClientRect();

                        const nodePosition = this.nodePositions.get(node.id);

                        if (
                            nodePosition &&
                            withinBounds(bounds, {
                                ...fromCanvasCartesianPoint(nodePosition.x - NODE_CENTER, nodePosition.y),
                                width: nodeRect.width,
                                height: nodeRect.height
                            })
                        ) {
                            selectionCandidates.push(node);
                        }
                    }
                }

                if (!isEmpty(xorWith(this.selectedNodes, selectionCandidates, isEqual))) {
                    this.selectNodes(selectionCandidates);
                }
            }
        });
    }
}

const defaultStoreProviderValue: StoreProviderValue = {
    store: new CircuitStore()
};

export const StoreContext = createContext(defaultStoreProviderValue);
