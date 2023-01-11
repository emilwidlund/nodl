import { Connection } from '../Connection/Connection';
import { Node } from '../Node/Node';

export class Context<TRoot extends Node = any> {
    /** Root Node */
    root: TRoot | undefined;
    /** Nodes */
    nodes: Map<Node['id'], Node>;
    /** Connections */
    connections: Map<Connection<unknown>['id'], Connection<unknown>>;

    constructor(root?: TRoot) {
        this.root = root;
        this.nodes = new Map();
        this.connections = new Map();
    }

    /** Adds node to context */
    public add(node: Node) {
        this.nodes.set(node.id, node);
    }

    /** Removes node from context */
    public remove(node: Node) {
        this.nodes.delete(node.id);
    }

    /** Assigns a root Node */
    public setRoot(node: TRoot) {
        this.root = node;
    }
}
