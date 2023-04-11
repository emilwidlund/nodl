import { Logarithm } from './Logarithm';

describe('Logarithm', () => {
    it('should initialize with correct values', () => {
        const logarithm = new Logarithm();

        expect(typeof logarithm.id).toEqual('string');
        expect(logarithm.name).toEqual('Logarithm');
        expect(logarithm.inputs.input).toBeDefined();
        expect(logarithm.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const logarithm = new Logarithm();

        const spy = jest.fn();
        logarithm.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(-Infinity);

        logarithm.inputs.input.next(10);
        expect(spy).toHaveBeenCalledWith(2.302585092994046);
    });
});
