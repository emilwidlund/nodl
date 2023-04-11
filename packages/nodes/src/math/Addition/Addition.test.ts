import { Addition } from './Addition';

describe('Addition', () => {
    it('should initialize with correct values', () => {
        const addition = new Addition();

        expect(typeof addition.id).toEqual('string');
        expect(addition.name).toEqual('Addition');
        expect(addition.inputs.a).toBeDefined();
        expect(addition.inputs.b).toBeDefined();
        expect(addition.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const addition = new Addition();

        const spy = jest.fn();
        addition.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        addition.inputs.a.next(100);
        expect(spy).toHaveBeenCalledWith(100);

        addition.inputs.b.next(100);
        expect(spy).toHaveBeenCalledWith(200);
    });
});
