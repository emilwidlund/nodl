import { Absolute } from './Absolute';

describe('Absolute', () => {
    it('should initialize with correct values', () => {
        const absolute = new Absolute();

        expect(typeof absolute.id).toEqual('string');
        expect(absolute.name).toEqual('Absolute');
        expect(absolute.inputs.input).toBeDefined();
        expect(absolute.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const absolute = new Absolute();

        const spy = jest.fn();
        absolute.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        absolute.inputs.input.next(-2.2);
        expect(spy).toHaveBeenCalledWith(2.2);

        spy.mockReset();

        absolute.inputs.input.next(2.8);
        expect(spy).toHaveBeenCalledWith(2.8);
    });
});
