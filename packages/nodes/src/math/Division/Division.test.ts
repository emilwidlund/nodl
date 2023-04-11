import { Division } from './Division';

describe('Division', () => {
    it('should initialize with correct values', () => {
        const division = new Division();

        expect(typeof division.id).toEqual('string');
        expect(division.name).toEqual('Division');
        expect(division.inputs.a).toBeDefined();
        expect(division.inputs.b).toBeDefined();
        expect(division.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const division = new Division();

        const spy = jest.fn();
        division.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(1);

        division.inputs.a.next(2);
        expect(spy).toHaveBeenCalledWith(2);

        division.inputs.b.next(10);
        expect(spy).toHaveBeenCalledWith(0.2);
    });
});
