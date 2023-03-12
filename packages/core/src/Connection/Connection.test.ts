import { Observable } from 'rxjs';
import { z } from 'zod';

import { Input } from '../Input/Input';
import { Addition } from '../Node/Node.fixture';
import { Output } from '../Output/Output';
import { schema } from '../Schema/Schema';

describe('Connection', () => {
    it('should transfer values', () => {
        const node1 = new Addition();
        const node2 = new Addition();

        const spy = jest.fn();
        node2.outputs.output.subscribe(spy);

        node1.outputs.output.connect(node2.inputs.a);
        node1.inputs.a.next(500);
        node1.inputs.b.next(500);

        expect(spy).toHaveBeenCalledWith(1000);
    });

    it('should dispose properly', () => {
        const node1 = new Addition();
        const node2 = new Addition();

        const connection = node1.outputs.output.connect(node2.inputs.a);

        const spy = jest.fn();
        node2.outputs.output.subscribe(spy);

        node1.inputs.a.next(200);

        expect(node2.inputs.a.value).toBe(200);

        connection.dispose();

        expect(node2.inputs.a.value).toBe(0);

        node1.inputs.a.next(500);

        expect(spy).not.toHaveBeenCalledWith(500);
        expect(connection.closed).toBeTruthy();
        expect(connection.subscription.closed).toBeTruthy();
        expect(node1.outputs.output.connections.includes(connection)).toBeFalsy();
        expect(node2.inputs.a.connection === connection).toBeFalsy();
    });

    it('should allow attempted connections on occupied inputs', () => {
        const node1 = new Addition();
        const node2 = new Addition();
        const node3 = new Addition();

        const connection = node1.outputs.output.connect(node3.inputs.a);
        const spy = jest.spyOn(connection, 'dispose');

        expect(() => node2.outputs.output.connect(node3.inputs.a)).not.toThrow();
        expect(spy).toBeCalled();
    });

    it('should throw when schemas are different', () => {
        const observable = new Observable();
        const a = new Output({ name: 'A', type: schema('Number', z.number()), observable });
        const b = new Input({ name: 'B', type: schema('String', z.string()), defaultValue: 'Hello' });

        // @ts-ignore
        expect(() => a.connect(b)).toThrow();
    });
});
