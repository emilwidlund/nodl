import { Addition } from './Node.fixture';

describe('Node', () => {
    it('should initialize with correct values', () => {
        const addition = new Addition();

        expect(typeof addition.id).toEqual('string');
        expect(addition.name).toEqual('Addition');
        expect(addition.inputs).toMatchObject({});
        expect(addition.outputs).toMatchObject({});
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
