import { PI } from './PI';

describe('PI', () => {
    it('should initialize with correct values', () => {
        const pi = new PI();

        expect(typeof pi.id).toEqual('string');
        expect(pi.name).toEqual('PI');
        expect(pi.inputs).toMatchObject({});
        expect(pi.outputs.PI).toBeDefined();
    });

    it('should compute properly', () => {
        const pi = new PI();

        const spy = jest.fn();
        pi.outputs.PI.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(Math.PI);
    });
});
