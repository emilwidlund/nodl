import { Min } from './Min';

describe('Min', () => {
    it('should initialize with correct values', () => {
        const min = new Min();

        expect(typeof min.id).toEqual('string');
        expect(min.name).toEqual('Min');
        expect(min.inputs.a).toBeDefined();
        expect(min.inputs.b).toBeDefined();
        expect(min.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const min = new Min();

        const spy = jest.fn();
        min.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        min.inputs.a.next(2);
        expect(spy).toHaveBeenCalledWith(0);

        min.inputs.b.next(10);
        expect(spy).toHaveBeenCalledWith(2);
    });
});
