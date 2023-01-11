import { add, float, FloatTerm } from '@thi.ng/shader-ast';
import _ from 'lodash';

import { Context } from '../Context/Context';
import { Input } from '../Input/Input';
import { IInputProps } from '../Input/Input.types';
import { Output } from '../Output/Output';
import { IOutputProps } from '../Output/Output.types';
import { Node } from './Node';
import { INodeInputs, INodeOutputs, INodeProps } from './Node.types';

export type IExtededNodeProps = INodeProps<
    { input?: IInputProps<'float'> },
    {
        output?: IOutputProps<'float'>;
    }
>;

export class ExtendedNode extends Node {
    type = '';
    inputs: INodeInputs;
    outputs: INodeOutputs;

    constructor(context: Context, props: IExtededNodeProps = {}) {
        super(context, props);

        this.inputs = {
            input: new Input(
                this,
                _.defaults(props.inputs?.input, {
                    defaultValue: float(0)
                })
            )
        };

        this.outputs = {
            output: new Output(
                this,
                _.defaults(props.outputs?.output, {
                    value: () => {
                        return add(
                            float(10),
                            this.resolveValue<'float', FloatTerm>(this.inputs.input.value as FloatTerm)
                        );
                    }
                })
            )
        };
    }
}
