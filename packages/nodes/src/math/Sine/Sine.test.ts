import { Sine } from './Sine';

describe('Sine', () => {
    it('should initialize with correct values', () => {
        const sine = new Sine();

        expect(typeof sine.id).toEqual('string');
        expect(sine.name).toEqual('Sine');
        expect(sine.inputs.input).toBeDefined();
        expect(sine.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const sine = new Sine();

        const spy = jest.fn();
        sine.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        sine.inputs.input.next(Math.PI / 2);
        expect(spy).toHaveBeenCalledWith(1);

        spy.mockReset();

        sine.inputs.input.next(-(Math.PI / 2));
        expect(spy).toHaveBeenCalledWith(-1);
    });
});
