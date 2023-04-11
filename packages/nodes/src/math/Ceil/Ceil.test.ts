import { Ceil } from './Ceil';

describe('Ceil', () => {
    it('should initialize with correct values', () => {
        const ceil = new Ceil();

        expect(typeof ceil.id).toEqual('string');
        expect(ceil.name).toEqual('Ceil');
        expect(ceil.inputs.input).toBeDefined();
        expect(ceil.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const ceil = new Ceil();

        const spy = jest.fn();
        ceil.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        ceil.inputs.input.next(2.2);
        expect(spy).toHaveBeenCalledWith(3);

        spy.mockReset();

        ceil.inputs.input.next(2.8);
        expect(spy).toHaveBeenCalledWith(3);
    });
});
