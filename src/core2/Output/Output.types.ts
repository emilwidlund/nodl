import { TaggedFn0, Term, Type } from '@thi.ng/shader-ast';

import { IPortProps, IPortSerialized } from '../Port/Port.types';

export type SerializableOutputValue<TType extends Type> = Term<TType>;
export type ComputedOutputValue<TType extends Type> = TaggedFn0<TType>;
export type OutputValue<TType extends Type> = SerializableOutputValue<TType> | ComputedOutputValue<TType>;

export interface IOutputProps<TType extends Type> extends IPortProps<TType> {
    value: () => OutputValue<TType>;
}

export type IOutputSerialized<TType extends Type> = IPortSerialized<TType>;

export type FloatOutputProps = IOutputProps<'float'>;
export type Vector2OutputProps = IOutputProps<'vec2'>;
export type Vector3OutputProps = IOutputProps<'vec3'>;
export type Vector4OutputProps = IOutputProps<'vec4'>;
