import { Cosine } from './Cosine';

describe('Cosine', () => {
    it('should initialize with correct values', () => {
        const cosine = new Cosine();

        expect(typeof cosine.id).toEqual('string');
        expect(cosine.name).toEqual('Cosine');
        expect(cosine.inputs.input).toBeDefined();
        expect(cosine.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const cosine = new Cosine();

        const spy = jest.fn();
        cosine.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(1);

        cosine.inputs.input.next(Math.PI);
        expect(spy).toHaveBeenCalledWith(-1);

        spy.mockReset();

        cosine.inputs.input.next(-Math.PI);
        expect(spy).toHaveBeenCalledWith(-1);
    });
});
