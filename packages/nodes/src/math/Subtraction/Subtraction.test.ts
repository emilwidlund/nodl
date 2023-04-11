import { Subtraction } from './Subtraction';

describe('Subtraction', () => {
    it('should initialize with correct values', () => {
        const subtraction = new Subtraction();

        expect(typeof subtraction.id).toEqual('string');
        expect(subtraction.name).toEqual('Subtraction');
        expect(subtraction.inputs.a).toBeDefined();
        expect(subtraction.inputs.b).toBeDefined();
        expect(subtraction.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const subtraction = new Subtraction();

        const spy = jest.fn();
        subtraction.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        subtraction.inputs.a.next(100);
        expect(spy).toHaveBeenCalledWith(100);

        subtraction.inputs.b.next(500);
        expect(spy).toHaveBeenCalledWith(-400);
    });
});
