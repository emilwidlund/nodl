import { Power } from './Power';

describe('Power', () => {
    it('should initialize with correct values', () => {
        const power = new Power();

        expect(typeof power.id).toEqual('string');
        expect(power.name).toEqual('Power');
        expect(power.inputs.x).toBeDefined();
        expect(power.inputs.y).toBeDefined();
        expect(power.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const power = new Power();

        const spy = jest.fn();
        power.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(1);

        power.inputs.x.next(2);
        expect(spy).toHaveBeenCalledWith(1);

        spy.mockReset();

        power.inputs.y.next(2);
        expect(spy).toHaveBeenCalledWith(4);
    });
});
