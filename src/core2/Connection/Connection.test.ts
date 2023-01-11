import { jest } from '@jest/globals';
import { float } from '@thi.ng/shader-ast';

import { ExtendedContext } from '../Context/Context.fixture';
import { ExtendedNode } from '../Node/Node.fixture';

describe('Connection', () => {
    let context: ExtendedContext;
    let node1: ExtendedNode;
    let node2: ExtendedNode;

    beforeEach(() => {
        context = new ExtendedContext();
        node1 = new ExtendedNode(context);
        node2 = new ExtendedNode(context);
    });

    it('should initialize properly', () => {
        const previousInputValue = node2.inputs.input.value;
        const connection = node1.outputs.output.connect(node2.inputs.input);

        expect(connection.id).toBeDefined();
        expect(connection.from).toBe(node1.outputs.output);
        expect(connection.to).toBe(node2.inputs.input);
        expect(connection.previousInputValue).toEqual(previousInputValue);
        expect(connection.type).toEqual(node1.outputs.output.type);
    });

    it('should transport values', () => {
        node1.outputs.output.connect(node2.inputs.input);

        const spy = jest.spyOn(node2.inputs.input, 'setValue');

        node1.inputs.input.setValue(float(100));

        expect(spy).toHaveBeenCalledWith(node1.outputs.output);
        expect(node2.inputs.input.value).toEqual(node1.outputs.output);
    });

    it('should reset values upon disposal', () => {
        const previousInputValue = node2.inputs.input.value;
        const connection = node1.outputs.output.connect(node2.inputs.input);

        node1.inputs.input.setValue(float(100));
        expect(node2.inputs.input.value).toEqual(node1.outputs.output);
        expect(node2.inputs.input.value).not.toEqual(previousInputValue);

        const spy = jest.spyOn(connection, 'dispose');

        context.disconnect(connection);
        expect(node2.inputs.input.value).not.toEqual(node1.outputs.output);
        expect(node2.inputs.input.value).toEqual(previousInputValue);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw if value type mismatch', () => {
        node2.inputs.input.type = 'vec3';

        expect(() => node1.outputs.output.connect(node2.inputs.input)).toThrow();
    });

    it('should serialize properly', () => {
        const connection = node1.outputs.output.connect(node2.inputs.input);

        const serialized = JSON.parse(JSON.stringify(connection));

        expect(serialized).toEqual({
            id: connection.id,
            from: node1.outputs.output.id,
            to: node2.inputs.input.id
        });
    });
});
