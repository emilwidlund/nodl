import { Observable } from 'rxjs';

import { Addition, NumberSchema } from '../Node/Node.fixture';

describe('Output', () => {
    it('should initialize with correct values', () => {
        const addition = new Addition();

        const output = addition.outputs.output;
        expect(typeof output.id).toEqual('string');
        expect(output.name).toEqual('Output');
        expect(output.type).toEqual({ name: 'Number', validator: NumberSchema });
        expect(output.observable instanceof Observable).toBeTruthy();
        expect(output.subscription).toBeDefined();
        expect(output.connected).toBeFalsy();
        expect(output.connections.length).toEqual(0);
    });

    it('should pipe observable to ReplaySubject', () => {
        const addition = new Addition();

        const observableSpy = jest.fn();
        const subjectSpy = jest.fn();
        addition.outputs.output.observable.subscribe(observableSpy);
        addition.outputs.output.subscribe(subjectSpy);

        expect(observableSpy).toHaveBeenLastCalledWith(0);
        expect(subjectSpy).toHaveBeenLastCalledWith(0);

        addition.inputs.a.next(500);

        expect(observableSpy).toHaveBeenLastCalledWith(500);
        expect(subjectSpy).toHaveBeenLastCalledWith(500);
    });

    it('should store connections', () => {
        const addition = new Addition();
        const addition2 = new Addition();

        expect(addition.outputs.output.connections.length).toEqual(0);
        const connection = addition.outputs.output.connect(addition2.inputs.a);
        expect(addition.outputs.output.connections).toContain(connection);
        connection.dispose();
        expect(addition.outputs.output.connections.length).toEqual(0);
    });

    it('should have a working connected flag', () => {
        const addition = new Addition();
        const addition2 = new Addition();

        expect(addition.outputs.output.connected).toBeFalsy();
        const connection = addition.outputs.output.connect(addition2.inputs.a);
        expect(addition.outputs.output.connected).toBeTruthy();
        connection.dispose();
        expect(addition.outputs.output.connected).toBeFalsy();
    });

    it('should dispose properly', () => {
        const addition = new Addition();

        const spy = jest.fn();
        addition.outputs.output.subscribe(spy);

        const inputARef = addition.inputs.a;
        expect(addition.outputs.output.closed).toBeFalsy();
        expect(addition.outputs.output.subscription.closed).toBeFalsy();

        addition.dispose();

        expect(() => inputARef.next(200)).toThrow();
        expect(spy).not.toHaveBeenCalledWith(200);
        expect(addition.outputs.output.subscription.closed).toBeTruthy();
        expect(addition.outputs.output.closed).toBeTruthy();
    });
});
