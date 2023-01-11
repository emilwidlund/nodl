import { float, Sym } from '@thi.ng/shader-ast';
import _ from 'lodash';

import { Node } from '../Node/Node';
import { ExtendedNode, IExtededNodeProps } from '../Node/Node.fixture';
import { INodeSerialized } from '../Node/Node.types';
import { Context } from './Context';
import { IContextProps } from './Context.types';

export class ExtendedContext extends Context {
    constructor(props: IContextProps = {}) {
        super(props);

        this.root = this.initialize();
    }

    resolveNode<TNode extends Node>(props: INodeSerialized): TNode {
        return new ExtendedNode(this, props as unknown as IExtededNodeProps) as TNode;
    }

    resolveRootNode(nodes: Node[]): Node {
        return nodes.length > 0 ? nodes[0] : new ExtendedNode(this);
    }

    render(outs: Record<string, Sym<any>>): void {
        return;
    }
}

export const getContextProps = <T extends IContextProps>(props: Partial<T> = {}): T => {
    return _.defaultsDeep(props, {
        id: '123',
        name: 'Extended',
        nodes: [
            [
                '123',
                {
                    id: '123',
                    name: 'My Node',
                    type: 'MyType',
                    inputs: {
                        input: {
                            id: '123',
                            name: 'A',
                            type: 'float',
                            defaultValue: float(0),
                            value: float(1)
                        }
                    },
                    outputs: {
                        output: {
                            id: '456',
                            name: 'Result',
                            type: 'float'
                        }
                    },
                    data: {
                        position: {
                            x: 100,
                            y: 200
                        }
                    }
                }
            ],
            [
                '456',
                {
                    id: '456',
                    name: 'My Second Node',
                    type: 'MySecondType',
                    inputs: {
                        input: {
                            id: '789',
                            name: 'A',
                            type: 'float',
                            defaultValue: float(0),
                            value: float(1)
                        }
                    },
                    outputs: {
                        output: {
                            id: '012',
                            name: 'Result',
                            type: 'float'
                        }
                    },
                    data: {
                        position: {
                            x: 200,
                            y: 300
                        }
                    }
                }
            ]
        ],
        connections: [
            [
                '123',
                {
                    id: '123',
                    from: '456',
                    to: '789'
                }
            ]
        ]
    });
};
