import { SquareRoot } from './SquareRoot';

describe('SquareRoot', () => {
    it('should initialize with correct values', () => {
        const squareRoot = new SquareRoot();

        expect(typeof squareRoot.id).toEqual('string');
        expect(squareRoot.name).toEqual('SquareRoot');
        expect(squareRoot.inputs.input).toBeDefined();
        expect(squareRoot.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const squareRoot = new SquareRoot();

        const spy = jest.fn();
        squareRoot.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        squareRoot.inputs.input.next(9);
        expect(spy).toHaveBeenCalledWith(3);
    });
});
