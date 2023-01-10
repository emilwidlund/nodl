import { Emitter } from './Emitter';

type EmitterPayload = {
    value: string;
};

describe('Emitter', () => {
    let emitter: Emitter<EmitterPayload>;

    beforeEach(() => {
        emitter = new Emitter();
    });

    it('should be able to emit payloads', () => {
        const spy = jest.fn();
        emitter.on(spy);

        emitter.emit({ value: '123' });

        expect(spy).toHaveBeenCalledWith({ value: '123' });
    });
});
