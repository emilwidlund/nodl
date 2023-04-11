import { Euler } from './Euler';

describe('Euler', () => {
    it('should initialize with correct values', () => {
        const euler = new Euler();

        expect(typeof euler.id).toEqual('string');
        expect(euler.name).toEqual('Euler');
        expect(euler.inputs).toMatchObject({});
        expect(euler.outputs.Euler).toBeDefined();
    });

    it('should compute properly', () => {
        const euler = new Euler();

        const spy = jest.fn();
        euler.outputs.Euler.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(Math.E);
    });
});
