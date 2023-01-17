import { Connection, Input, Node, Output } from '@nodl/core';
import { autorun, IReactionDisposer, makeAutoObservable } from 'mobx';

import { NODE_CENTER } from '../../constants';
import { normalizeBounds, withinBounds } from '../../utils/bounds/bounds';
import { Bounds } from '../../utils/bounds/bounds.types';
import { fromCanvasCartesianPoint } from '../../utils/coordinates/coordinates';

export class CanvasStore {
    /** Associated Nodes */
    public nodes: Node[] = [];
    /** Associated Node Elements */
    public nodeElements: Map<Node['id'], HTMLDivElement> = new Map();
    /** Associated Port Elements */
    public portElements: Map<Input['id'] | Output['id'], HTMLDivElement> = new Map();
    /** Selected Nodes */
    public selectedNodes: Node[] = [];
    /** Draft Connection Source */
    public draftConnectionSource?: Output;
    /** Selection bounds */
    public selectionBounds?: Bounds;

    /** Selection Bounds autorun disposer */
    private selectionBoundsDisposer: IReactionDisposer;

    constructor() {
        makeAutoObservable(this);

        this.selectionBoundsDisposer = this.onSelectionBoundsChange();
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
    public setDraftConnectionSource(source?: Output): void {
        this.draftConnectionSource = source;
    }

    /** Sets an Output as the current draft connection source */
    public commitDraftConnection<T>(target: Input<T>): Connection<T> | void {
        if (this.draftConnectionSource) {
            const connection = this.draftConnectionSource.connect(target);

            this.setDraftConnectionSource(undefined);

            return connection;
        }
    }

    /** Selects the given nodes */
    public selectNodes(nodes: Node[]): void {
        this.selectedNodes = nodes;
    }

    /** Sets the selection bounds */
    public setSelectionBounds(bounds?: Bounds): void {
        this.selectionBounds = bounds;
    }

    /** Disposes the store by cleaning up effects */
    public dispose(): void {
        this.selectionBoundsDisposer();
    }

    /** Automatically selects the nodes which are within the selection bounds */
    private onSelectionBoundsChange(): IReactionDisposer {
        return autorun(() => {
            if (this.selectionBounds) {
                const bounds = normalizeBounds(this.selectionBounds);

                const selectionCandidates = [];

                for (const node of this.nodes.values()) {
                    const nodeElement = this.nodeElements.get(node.id);

                    if (nodeElement) {
                        const nodeRect = nodeElement.getBoundingClientRect();

                        if (
                            withinBounds(bounds, {
                                ...fromCanvasCartesianPoint(node.data.position.x: - NODE_CENTER, node.data.position.y),
                                width: nodeRect.width,
                                height: nodeRect.height
                            })
                        ) {
                            selectionCandidates.push(node);
                        }
                    }
                }

                this.selectNodes(selectionCandidates);
            }
        });
    }
}
