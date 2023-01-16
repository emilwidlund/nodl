import { v4 as uuid } from 'uuid';

import { Input } from '../Input/Input';
import { Output } from '../Output/Output';

export abstract class Node {
    /** Identifier */
    public id: string = uuid();
    /** Node Name */
    public name: string = this.constructor.name;
    /** Node Inputs */
    public inputs: Record<string, Input> = {};
    /** Node Outputs */
    public outputs: Record<string, Output> = {};
    /** Arbitrary Data Store */
    public data: Record<string, unknown> = {};

    /** Disposes the Node */
    public dispose(): void {
        for (const input of Object.values(this.inputs)) {
            input.dispose();
        }

        for (const output of Object.values(this.outputs)) {
            output.dispose();
        }
    }
}
