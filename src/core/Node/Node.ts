import { combineLatest, map } from 'rxjs';

import { Input } from '../Input/Input';
import { Output } from '../Output/Output';

export class Addition {
    a: Input<number> = new Input({ name: 'A', type: 'Number', defaultValue: 0 });
    b: Input<number> = new Input({ name: 'B', type: 'Number', defaultValue: 0 });

    output: Output<number> = new Output({
        name: 'Output',
        type: 'Number',
        compute: combineLatest([this.a, this.b]).pipe(map(inputs => inputs.reduce((sum, value) => sum + value), 0))
    });
}

const addition = new Addition();
const addition2 = new Addition();

addition2.output.subscribe(console.log);
// addition.output.connect(addition2.a);

addition2.b.next(500);
// addition2.b.next(500);
