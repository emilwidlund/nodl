import { Logarithm2 } from './Logarithm2';

describe('Logarithm2', () => {
    it('should initialize with correct values', () => {
        const logarithm2 = new Logarithm2();

        expect(typeof logarithm2.id).toEqual('string');
        expect(logarithm2.name).toEqual('Logarithm2');
        expect(logarithm2.inputs.input).toBeDefined();
        expect(logarithm2.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const logarithm2 = new Logarithm2();

        const spy = jest.fn();
        logarithm2.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(-Infinity);

        logarithm2.inputs.input.next(10);
        expect(spy).toHaveBeenCalledWith(3.321928094887362);
    });
});
