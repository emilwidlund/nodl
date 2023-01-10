import { Disposable, Listener } from './Emitter.types';

export class Emitter<T> {
    /** Registered Listeners */
    public listeners: Listener<T>[] = [];
    /** Temporary Listeners which will be disposed after first event */
    public temporaryListeners: Listener<T>[] = [];

    /** Registers a listener */
    public on(listener: Listener<T>): Disposable {
        this.listeners.push(listener);

        return {
            dispose: () => this.dispose(listener)
        };
    }

    /** Registers a temporary listener */
    public once(listener: Listener<T>): void {
        this.temporaryListeners.push(listener);
    }

    /**
     * Emits an event to all registered listeners.
     * Temporary listeners are immediately disposed after event is dispatched.
     */
    public emit(event: T) {
        /** Update any general listeners */
        this.listeners.forEach(listener => listener(event));

        /** Clear the `temporary` queue */
        if (this.temporaryListeners.length > 0) {
            const toCall = this.temporaryListeners;

            this.temporaryListeners = [];

            toCall.forEach(listener => listener(event));
        }
    }

    /** Pipes the emitter's events to a given emitter of the same type */
    public pipe(te: Emitter<T>): Disposable {
        return this.on(e => te.emit(e));
    }

    /**
     * Disposes the given listener.
     * If no listener is provided, all listeners are disposed.
     */
    public dispose(listener?: Listener<T>) {
        if (!listener) {
            this.listeners = [];
            this.temporaryListeners = [];
        } else {
            const callbackIndex = this.listeners.indexOf(listener);
            const temporaryCallbackIndex = this.temporaryListeners.indexOf(listener);

            if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
            if (temporaryCallbackIndex > -1) this.temporaryListeners.splice(temporaryCallbackIndex, 1);
        }
    }
}
