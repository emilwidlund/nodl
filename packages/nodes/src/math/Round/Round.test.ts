import { Round } from './Round';

describe('Round', () => {
    it('should initialize with correct values', () => {
        const round = new Round();

        expect(typeof round.id).toEqual('string');
        expect(round.name).toEqual('Round');
        expect(round.inputs.input).toBeDefined();
        expect(round.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const round = new Round();

        const spy = jest.fn();
        round.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        round.inputs.input.next(2.2);
        expect(spy).toHaveBeenCalledWith(2);

        spy.mockReset();

        round.inputs.input.next(2.8);
        expect(spy).toHaveBeenCalledWith(3);
    });
});
