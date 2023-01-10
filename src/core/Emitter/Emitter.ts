import { Disposable, Listener } from './Emitter.types';

export class Emitter<T> {
    /** Registered Listeners */
    private listeners: Listener<T>[] = [];
    /** Temporary Listeners which will be disposed after first event */
    private temporaryListeners: Listener<T>[] = [];

    public on(listener: Listener<T>): Disposable {
        this.listeners.push(listener);

        return {
            dispose: () => this.dispose(listener)
        };
    }

    public once(listener: Listener<T>): void {
        this.temporaryListeners.push(listener);
    }

    public emit(event: T) {
        /** Update any general listeners */
        this.listeners.forEach(listener => listener(event));

        /** Clear the `once` queue */
        if (this.temporaryListeners.length > 0) {
            const toCall = this.temporaryListeners;

            this.temporaryListeners = [];

            toCall.forEach(listener => listener(event));
        }
    }

    public pipe(te: Emitter<T>): Disposable {
        return this.on(e => te.emit(e));
    }

    public dispose(listener: Listener<T>) {
        const callbackIndex = this.listeners.indexOf(listener);

        if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
    }
}
