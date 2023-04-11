import { Floor } from './Floor';

describe('Floor', () => {
    it('should initialize with correct values', () => {
        const floor = new Floor();

        expect(typeof floor.id).toEqual('string');
        expect(floor.name).toEqual('Floor');
        expect(floor.inputs.input).toBeDefined();
        expect(floor.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const floor = new Floor();

        const spy = jest.fn();
        floor.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        floor.inputs.input.next(2.2);
        expect(spy).toHaveBeenCalledWith(2);

        spy.mockReset();

        floor.inputs.input.next(2.8);
        expect(spy).toHaveBeenCalledWith(2);
    });
});
