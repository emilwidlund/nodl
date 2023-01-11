import { jest } from '@jest/globals';
import { add, float } from '@thi.ng/shader-ast';
import { observable } from 'mobx';

import { ExtendedContext } from '../Context/Context.fixture';
import { ExtendedNode } from '../Node/Node.fixture';
import { Output } from './Output';

describe('Output', () => {
    let context: ExtendedContext;
    let node: ExtendedNode;
    let output: Output<'float', ExtendedNode>;

    beforeEach(() => {
        context = new ExtendedContext();
        node = new ExtendedNode(context);
        output = new Output(node, { name: 'Test Output', type: 'float', value: () => float(10) });
    });

    it('should initialize properly', () => {
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Test Output');
        expect(output.type).toBe('float');
        expect(output.value).toEqual(float(10));
        expect(output.connected).toBe(false);
        expect(output.connections.length).toBe(0);
        expect(output.node).toBe(node);
    });

    it('should initialize properly from props', () => {
        const outputWithProps = new Output(node, {
            id: '123',
            name: 'My Output',
            value: () => float(5),
            type: 'float'
        });

        expect(outputWithProps.id).toBe('123');
        expect(outputWithProps.name).toBe('My Output');
        expect(outputWithProps.type).toBe('float');
        expect(outputWithProps.value).toEqual(float(5));
        expect(outputWithProps.connected).toBe(false);
        expect(outputWithProps.connections.length).toBe(0);
        expect(outputWithProps.node).toBe(node);
    });

    it('should connect with input', () => {
        const node1 = new ExtendedNode(context, {
            inputs: {
                input: {
                    name: 'In',
                    type: 'float',
                    defaultValue: float(0)
                }
            }
        });
        const node2 = new ExtendedNode(context);

        const output2 = new Output(node2, {
            name: 'A',
            type: 'float',
            value: () => float(10)
        });

        const connection = output2.connect(node1.inputs.input);

        expect(output2.connected).toBeTruthy();
        expect(output2.connections[0]).toBe(connection);
    });

    it('should cleanup connections on disposal', () => {
        const node1 = new ExtendedNode(context, {
            inputs: {
                input: {
                    name: 'In',
                    type: 'float',
                    defaultValue: float(0)
                }
            }
        });
        const node2 = new ExtendedNode(context);

        const output2 = new Output(node2, {
            name: 'A',
            type: 'float',
            value: () => float(10)
        });

        output2.connect(node1.inputs.input);

        const spy = jest.spyOn(context, 'disconnect');

        output2.dispose();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(output2.connected).toBeFalsy();
        expect(output2.connections.length).toBe(0);
        expect(output2.value).toEqual(float(10));
    });

    it('should compute properly', () => {
        const observable1 = observable.box(float(10));
        const observable2 = observable.box(float(20));

        output = new Output(node, {
            name: 'Test Output',
            type: 'float',
            value: () => add(observable1.get(), observable2.get())
        });

        observable1.set(float(100));
        expect(output.value).toEqual(add(float(100), float(20)));

        observable2.set(float(200));
        expect(output.value).toEqual(add(float(100), float(200)));
    });

    it('should serialize properly', () => {
        const serialized = JSON.parse(JSON.stringify(output));

        expect(serialized).toEqual({
            id: output.id,
            name: output.name,
            type: output.type,
            value: undefined
        });
    });
});
