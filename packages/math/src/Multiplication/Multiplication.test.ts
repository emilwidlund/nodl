import { Multiplication } from './Multiplication';

describe('Multiplication', () => {
    it('should initialize with correct values', () => {
        const multiplication = new Multiplication();

        expect(typeof multiplication.id).toEqual('string');
        expect(multiplication.name).toEqual('Multiplication');
        expect(multiplication.inputs.a).toBeDefined();
        expect(multiplication.inputs.b).toBeDefined();
        expect(multiplication.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const multiplication = new Multiplication();

        const spy = jest.fn();
        multiplication.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(1);

        multiplication.inputs.a.next(2);
        expect(spy).toHaveBeenCalledWith(2);

        multiplication.inputs.b.next(10);
        expect(spy).toHaveBeenCalledWith(20);
    });
});
