import { Max } from './Max';

describe('Max', () => {
    it('should initialize with correct values', () => {
        const max = new Max();

        expect(typeof max.id).toEqual('string');
        expect(max.name).toEqual('Max');
        expect(max.inputs.a).toBeDefined();
        expect(max.inputs.b).toBeDefined();
        expect(max.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const max = new Max();

        const spy = jest.fn();
        max.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        max.inputs.a.next(2);
        expect(spy).toHaveBeenCalledWith(2);

        max.inputs.b.next(10);
        expect(spy).toHaveBeenCalledWith(10);
    });
});
