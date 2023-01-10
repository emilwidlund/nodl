import { Emitter } from './Emitter';

type EmitterPayload = {
    type: 'TEST';
    value: string;
};

describe('Emitter', () => {
    let emitter: Emitter<EmitterPayload>;

    beforeEach(() => {
        emitter = new Emitter();
    });

    it('should emit payloads', () => {
        const spy = jest.fn();
        emitter.on(spy);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).toHaveBeenCalledWith({ type: 'TEST', value: '123' });
    });

    it('should register listeners', () => {
        const spy = jest.fn();
        emitter.on(spy);

        expect(emitter.listeners).toContain(spy);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).toHaveBeenCalledWith({ type: 'TEST', value: '123' });

        expect(emitter.listeners).toContain(spy);
    });

    it('should register temporary listeners', () => {
        const spy = jest.fn();
        emitter.once(spy);

        expect(emitter.temporaryListeners).toContain(spy);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).toHaveBeenCalledWith({ type: 'TEST', value: '123' });

        expect(emitter.temporaryListeners).not.toContain(spy);
    });

    it('should pipe events', () => {
        const spy = jest.fn();

        const targetEmitter = new Emitter<EmitterPayload>();
        targetEmitter.on(spy);
        const disposable = emitter.pipe(targetEmitter);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).toHaveBeenCalledWith({ type: 'TEST', value: '123' });

        disposable.dispose();

        emitter.emit({ type: 'TEST', value: '456' });
        expect(spy).not.toHaveBeenCalledWith({ type: 'TEST', value: '456' });
    });

    it('should dispose through disposable', () => {
        const spy = jest.fn();
        const disposable = emitter.on(spy);

        disposable.dispose();

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(emitter.listeners).not.toContain(spy);
    });

    it('should dispose callback', () => {
        const spy = jest.fn();
        emitter.on(spy);

        emitter.dispose(spy);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(emitter.listeners).not.toContain(spy);
    });

    it('should dispose temporary callback', () => {
        const spy = jest.fn();
        emitter.once(spy);

        emitter.dispose(spy);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(emitter.temporaryListeners).not.toContain(spy);
    });

    it('should dispose all callbacks', () => {
        const spy = jest.fn();
        const spy2 = jest.fn();
        const spy3 = jest.fn();
        const spy4 = jest.fn();
        emitter.on(spy);
        emitter.on(spy2);
        emitter.once(spy3);
        emitter.once(spy4);

        emitter.dispose();

        expect(emitter.listeners.length).toBe(0);
        expect(emitter.temporaryListeners.length).toBe(0);

        emitter.emit({ type: 'TEST', value: '123' });
        expect(spy).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(spy2).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(spy3).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
        expect(spy4).not.toHaveBeenCalledWith({ type: 'TEST', value: '123' });
    });
});
