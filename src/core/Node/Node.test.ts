import { combineLatest, map } from 'rxjs';

import { Context } from '../Context/Context';
import { Input } from '../Input/Input';
import { Output } from '../Output/Output';
import { Node } from './Node';

describe('Node', () => {
    it('should compute properly', () => {
        class Addition extends Node {
            inputs = {
                a: new Input({ name: 'A', type: Number, defaultValue: 0 }),
                b: new Input({ name: 'B', type: Number, defaultValue: 0 })
            };

            outputs = {
                output: new Output({
                    name: 'Output',
                    type: Number,
                    observable: combineLatest([this.inputs.a, this.inputs.b]).pipe(
                        map(inputs => inputs.reduce((sum, value) => sum + value), 0)
                    )
                })
            };
        }

        const context = new Context();
        const addition = new Addition(context);

        const spy = jest.fn();
        addition.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        addition.inputs.a.next(100);

        expect(spy).toHaveBeenCalledWith(100);

        addition.inputs.b.next(100);

        expect(spy).toHaveBeenCalledWith(200);
    });
});
