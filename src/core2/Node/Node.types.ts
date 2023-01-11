import { Type } from '@thi.ng/shader-ast';

import { Input } from '../Input/Input';
import { IInputProps, IInputSerialized } from '../Input/Input.types';
import { Output } from '../Output/Output';
import { IOutputProps, IOutputSerialized } from '../Output/Output.types';

export interface INodePosition {
    x: number;
    y: number;
}

export interface INodeData<TType = Type> {
    position: INodePosition;
    type?: {
        selected: TType;
        options: TType[];
    };
}

export interface INodeInputs {
    [key: string]: Input<any, any>;
}
export interface INodeOutputs {
    [key: string]: Output<any, any>;
}

export interface INodeInputsProps {
    [key: string]: IInputProps<any>;
}
export interface INodeOutputsProps {
    [key: string]: IOutputProps<any>;
}

export interface INodeProps<
    TInputs extends INodeInputsProps = INodeInputsProps,
    TOutputs extends INodeOutputsProps = INodeOutputsProps
> {
    id?: string;
    name?: string;
    data?: INodeData;
    inputs?: TInputs;
    outputs?: TOutputs;
}

export interface INodeSerialized {
    id: string;
    name: string;
    type: string;
    data: INodeData;
    inputs: Record<string, IInputSerialized<any>>;
    outputs: Record<string, IOutputSerialized<any>>;
}
