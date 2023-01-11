import { jest } from '@jest/globals';
import { add, float } from '@thi.ng/shader-ast';

import { ExtendedContext } from '../Context/Context.fixture';
import { ExtendedNode, IExtededNodeProps } from './Node.fixture';

describe('Node', () => {
    let context: ExtendedContext;

    beforeEach(() => {
        context = new ExtendedContext();
    });

    it('should initialize properly', () => {
        const node = new ExtendedNode(context);

        expect(node.id).toBeDefined();
        expect(node.name).toBe('Untitled');
        expect(node.inputs).toBeDefined();
        expect(node.outputs).toBeDefined();
        expect(node.data.position).toEqual({ x: 0, y: 0 });
        expect(node.data.type).toBeUndefined();
        expect(node.context).toBe(context);
        expect(node.ports.length).toBe(2);
        expect(node.connections.length).toBe(0);
    });

    it('should initialize with props', () => {
        const props: IExtededNodeProps = {
            id: '123',
            name: 'My Node',
            inputs: {
                input: {
                    id: '123',
                    name: 'Input',
                    type: 'float',
                    defaultValue: float(0)
                }
            },
            outputs: {
                output: {
                    id: '456',
                    name: 'Output',
                    type: 'float',
                    value: () => {
                        return add(float(0), float(0));
                    }
                }
            },
            data: {
                position: {
                    x: 10,
                    y: 20
                },
                type: {
                    selected: 'bool',
                    options: ['bool', 'float']
                }
            }
        };

        const node = new ExtendedNode(context, props);

        expect(node.id).toBe('123');
        expect(node.name).toBe('My Node');
        expect(node.inputs.input).toBeDefined();
        expect(node.outputs.output).toBeDefined();
        expect(node.data.position).toEqual({ x: 10, y: 20 });
        expect(node.data.type).toEqual({ selected: 'bool', options: ['bool', 'float'] });
        expect(node.context).toBe(context);
    });

    it('should initialize into Context', () => {
        const node = new ExtendedNode(context);

        expect(context.nodes.has(node.id)).toBeTruthy();
    });

    it('should keep track of associated connections', () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        const connection = node1.outputs.output.connect(node2.inputs.input);
        expect(node1.connections[0]).toBe(connection);
        expect(node2.connections[0]).toBe(connection);
    });

    it('should be able to resolve values properly', () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        node1.outputs.output.connect(node2.inputs.input);

        expect(node2.inputs.input.value).toBe(node1.outputs.output);
        expect(node2.resolveValue(node2.inputs.input.value)).toBe(node1.outputs.output.value);
    });

    it('should dispose ports & connections and remove from coontext properly', () => {
        const node1 = new ExtendedNode(context);
        const node2 = new ExtendedNode(context);

        const connection = node1.outputs.output.connect(node2.inputs.input);

        const inputSpy = jest.spyOn(node2.inputs.input, 'dispose');
        const connectionSpy = jest.spyOn(connection, 'dispose');

        node2.dispose();

        expect(inputSpy).toHaveBeenCalledTimes(1);
        expect(connectionSpy).toHaveBeenCalledTimes(1);
        expect(context.nodes.has(node2.id)).toBeFalsy();
    });

    it('should serialize properly', () => {
        const node = new ExtendedNode(context, { data: { position: { x: 100, y: 200 } } });
        const serialized = JSON.parse(JSON.stringify(node));

        expect(serialized).toEqual(
            JSON.parse(
                JSON.stringify({
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    inputs: {
                        input: node.inputs.input.toJSON()
                    },
                    outputs: {
                        output: node.outputs.output.toJSON()
                    },
                    data: {
                        position: {
                            x: 100,
                            y: 200
                        }
                    }
                })
            )
        );
    });
});
