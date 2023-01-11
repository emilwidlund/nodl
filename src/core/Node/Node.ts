import { v4 as uuid } from 'uuid';

import { Context } from '../Context/Context';
import { Input } from '../Input/Input';
import { Output } from '../Output/Output';

export abstract class Node {
    /** Identifier */
    public id: string = uuid();
    /** Node Name */
    public name: string = this.constructor.name;
    /** Associated Context */
    public context: Context;
    /** Node Inputs */
    public inputs: Record<string, Input> = {};
    /** Node Outputs */
    public outputs: Record<string, Output> = {};

    constructor(context: Context) {
        this.context = context;

        this.context.add(this);
    }
}
