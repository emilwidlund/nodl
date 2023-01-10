import { jest } from '@jest/globals';
import { bool, float } from '@thi.ng/shader-ast';

import { ExtendedContext } from '../Context/Context.fixture';
import { ExtendedNode } from '../Node/Node.fixture';
import { Input } from './Input';

describe('Input', () => {
    let context: ExtendedContext;
    let node: ExtendedNode;
    let input: Input<'bool', ExtendedNode>;

    beforeEach(() => {
        context = new ExtendedContext();
        node = new ExtendedNode(context);
        input = new Input(node, { name: 'Test Input', type: 'bool', defaultValue: bool(false) });
    });

    it('should initialize properly', () => {
        expect(input.id).toBeDefined();
        expect(input.name).toBe('Test Input');
        expect(input.type).toBe('bool');
        expect(input.defaultValue).toEqual(bool(false));
        expect(input.value).toEqual(bool(false));
        expect(input.connected).toBe(false);
        expect(input.connection).toBeUndefined();
        expect(input.node).toBe(node);

        const spy = jest.spyOn(input, 'validator');
        input.validator(false);
        expect(spy).toHaveReturnedWith(true);
    });

    it('should initialize properly from props', () => {
        const inputWithProps = new Input(node, {
            id: '123',
            name: 'My Input',
            defaultValue: float(0),
            value: float(5),
            type: 'float',
            validator: <T>(value: unknown): value is T => typeof value === 'string'
        });

        expect(inputWithProps.id).toBe('123');
        expect(inputWithProps.name).toBe('My Input');
        expect(inputWithProps.type).toBe('float');
        expect(inputWithProps.defaultValue).toEqual(float(0));
        expect(inputWithProps.value).toEqual(float(5));
        expect(inputWithProps.connected).toBe(false);
        expect(inputWithProps.connection).toBeUndefined();
        expect(inputWithProps.node).toBe(node);

        const spy = jest.spyOn(inputWithProps, 'validator');
        inputWithProps.validator(123);
        expect(spy).toHaveReturnedWith(false);
        inputWithProps.validator('123');
        expect(spy).toHaveReturnedWith(true);
    });

    it('should set value', () => {
        input.setValue(bool(true));

        expect(input.value).toEqual(bool(true));
    });

    it('should not set value if validator returns false', () => {
        input.validator = <T>(value: unknown): value is T => false;
        input.setValue(bool(true));

        expect(input.value).toEqual(bool(false));
    });

    it('should connect with output', () => {
        const node1 = new ExtendedNode(context, {
            outputs: {
                output: {
                    name: 'Out',
                    type: 'float',
                    value: () => float(20)
                }
            }
        });
        const node2 = new ExtendedNode(context);

        const input2 = new Input(node2, {
            name: 'A',
            type: 'float',
            defaultValue: float(10)
        });

        const connection = node1.outputs.output.connect(input2);

        expect(input2.connected).toBeTruthy();
        expect(input2.connection).toBe(connection);
        expect(input2.value).toBe(node1.outputs.output);
    });

    it('should cleanup connection on disposal', () => {
        const node1 = new ExtendedNode(context, {
            outputs: {
                output: {
                    name: 'Out',
                    type: 'float',
                    value: () => float(20)
                }
            }
        });
        const node2 = new ExtendedNode(context);

        const input2 = new Input(node2, {
            name: 'A',
            type: 'float',
            defaultValue: float(10)
        });

        node1.outputs.output.connect(input2);

        const spy = jest.spyOn(context, 'disconnect');

        input2.dispose();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(input2.connected).toBeFalsy();
        expect(input2.connection).toBeUndefined();
        expect(input2.value).toEqual(float(10));
    });

    it('should serialize properly', () => {
        const serialized = JSON.parse(JSON.stringify(input));

        expect(serialized).toEqual({
            id: input.id,
            name: input.name,
            type: input.type,
            defaultValue: bool(false),
            value: bool(false)
        });
    });
});
