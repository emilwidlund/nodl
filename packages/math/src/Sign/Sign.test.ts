import { Sign } from './Sign';

describe('Sign', () => {
    it('should initialize with correct values', () => {
        const sign = new Sign();

        expect(typeof sign.id).toEqual('string');
        expect(sign.name).toEqual('Sign');
        expect(sign.inputs.input).toBeDefined();
        expect(sign.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const sign = new Sign();

        const spy = jest.fn();
        sign.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        sign.inputs.input.next(-2.2);
        expect(spy).toHaveBeenCalledWith(-1);

        spy.mockReset();

        sign.inputs.input.next(2.8);
        expect(spy).toHaveBeenCalledWith(1);
    });
});
