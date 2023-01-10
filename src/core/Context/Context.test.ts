import { jest } from '@jest/globals';

import { InputValue } from '../Input/Input.types';
import { ExtendedNode } from '../Node/Node.fixture';
import { ExtendedContext, getContextProps } from './Context.fixture';
import { IContextSerialized } from './Context.types';

describe('Context', () => {
    let context: ExtendedContext;
    let contextProps: IContextSerialized;
    let contextWithProps: ExtendedContext;

    beforeEach(() => {
        context = new ExtendedContext();
        contextProps = getContextProps();
        contextWithProps = new ExtendedContext(contextProps);
    });

    it('should initialize with all necessary properties', () => {
        expect(context.id).toBeDefined();
        expect(context.name).toBe('Untitled');
        expect(context.root).toBeDefined();
        expect(context.nodes.size).toBe(1);
        expect(context.connections.size).toBe(0);
        expect(context.props).toBeDefined();
    });

    it('should initialize with given properties', () => {
        expect(contextWithProps.id).toBe(contextProps.id);
        expect(contextWithProps.name).toBe(contextProps.name);
        expect(contextWithProps.root instanceof ExtendedNode).toBeTruthy();
        expect(contextWithProps.nodes.size).toBe(2);
        expect(contextWithProps.connections.size).toBe(1);
        expect(contextWithProps.props).toEqual(contextProps);
    });

    it('should be capable of adding nodes', () => {
        const spy = jest.spyOn(context, 'add');
        const node = new ExtendedNode(context);

        expect(spy).toHaveBeenCalledWith(node);
        expect(context.nodes.size).toBe(2);
    });

    it('should be capable of removing nodes', async () => {
        const spy = jest.spyOn(context, 'remove');
        const node = new ExtendedNode(context);
        node.dispose();

        expect(spy).toHaveBeenCalledWith(node);
        expect(context.nodes.size).toBe(1);
    });

    it('should be capable of connecting ports', async () => {
        const spy = jest.spyOn(context, 'connect');
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        node1.outputs.output.connect(node2.inputs.input);

        expect(spy).toHaveBeenCalledWith(node1.outputs.output, node2.inputs.input);
        expect(context.connections.size).toBe(1);
    });

    it('should throw if given mismatching types upon connection', async () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        node1.outputs.output.type = 'abc';
        node1.outputs.output.type = 'def';

        expect(() => node1.outputs.output.connect(node2.inputs.input)).toThrowError(
            'Output (def) and Input (undefined) are of different types'
        );
    });

    it('should throw if validation fails upon connection', async () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        node2.inputs.input.validator = (val: unknown): val is InputValue<'vec3'> => false;

        expect(() => node1.outputs.output.connect(node2.inputs.input)).toThrow();
    });

    it('should be capable of disconnecting ports', async () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        const connection = node1.outputs.output.connect(node2.inputs.input);
        context.disconnect(connection);

        expect(context.connections.size).toBe(0);
    });

    it('should serialize to JSON', () => {
        const [node1, node2] = [...contextWithProps.nodes.values()];
        const [connection] = [...contextWithProps.connections.values()];

        const serialized = JSON.parse(JSON.stringify(contextWithProps));

        expect(serialized).toEqual(
            JSON.parse(
                JSON.stringify({
                    id: contextWithProps.id,
                    name: contextWithProps.name,
                    nodes: [
                        [
                            node1.id,
                            {
                                id: node1.id,
                                name: node1.name,
                                type: node1.type,
                                inputs: {
                                    input: node1.inputs.input.toJSON()
                                },
                                outputs: {
                                    output: node1.outputs.output.toJSON()
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
                                id: node2.id,
                                name: node2.name,
                                type: node2.type,
                                inputs: {
                                    input: node2.inputs.input.toJSON()
                                },
                                outputs: {
                                    output: node2.outputs.output.toJSON()
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
                        [connection.id, { id: connection.id, from: node1.outputs.output.id, to: node2.inputs.input.id }]
                    ]
                })
            )
        );
    });
});
