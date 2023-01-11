import { TaggedFn0, Term, Type } from '@thi.ng/shader-ast';

import { Node } from '../Node/Node';
import { Output } from '../Output/Output';
import { IPortProps, IPortSerialized } from '../Port/Port.types';

export type SerializableInputValue<TType extends Type> = Term<TType>;
export type ComputedInputValue<TType extends Type> = TaggedFn0<TType>;
export type ConnectedInputValue<TType extends Type, TNode extends Node = Node> = Output<TType, TNode>;
export type InputValue<TType extends Type> =
    | ConnectedInputValue<TType>
    | SerializableInputValue<TType>
    | ComputedInputValue<TType>;

export type ValidatorFunction<TValue> = (value: unknown) => value is TValue;
export interface IInputProps<TType extends Type> extends IPortProps<TType> {
    defaultValue: SerializableInputValue<TType>;
    validator?: ValidatorFunction<InputValue<TType>>;
    value?: SerializableInputValue<TType>;
}

export interface IInputSerialized<TType extends Type> extends IPortSerialized<TType> {
    defaultValue: SerializableInputValue<TType>;
    value?: SerializableInputValue<TType>;
}

export type FloatInputProps = IInputProps<'float'>;
export type Vector2InputProps = IInputProps<'vec2'>;
export type Vector3InputProps = IInputProps<'vec3'>;
export type Vector4InputProps = IInputProps<'vec4'>;
