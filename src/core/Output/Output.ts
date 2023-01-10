import { Type } from '@thi.ng/shader-ast';
import { makeObservable, computed } from 'mobx';

import { Connection } from '../Connection/Connection';
import { Input } from '../Input/Input';
import { Node } from '../Node/Node';
import { Port } from '../Port/Port';
import { IOutputProps, OutputValue } from './Output.types';

export class Output<TType extends Type, TNode extends Node = Node> extends Port<TType, TNode> {
    /** Computed Value */
    value!: OutputValue<TType>;

    constructor(node: TNode, props: IOutputProps<TType>) {
        super(node, props);

        Object.defineProperty(this, 'value', {
            enumerable: true,
            configurable: true,
            get: props.value
        });

        makeObservable(this, {
            value: computed,
            connections: computed
        });
    }

    /** Connects output with input */
    public connect<TInputNode extends Node, TInput extends Input<TType, TInputNode>>(input: TInput): Connection<TType> {
        return this.node.context.connect(this, input);
    }

    /** Outgoing Connections */
    public get connections(): Connection<TType>[] {
        return [...this.node.context.connections.values()].filter(connection => connection.from.id === this.id);
    }

    /** Disposes the Output */
    public dispose() {
        for (const connection of this.connections) {
            this.node.context.disconnect(connection);
        }
    }
}
