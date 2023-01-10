import { Type } from '@thi.ng/shader-ast';
import { action, computed, makeObservable, observable } from 'mobx';

import { Connection } from '../Connection/Connection';
import { Node } from '../Node/Node';
import { Port } from '../Port/Port';
import {
    ConnectedInputValue,
    IInputProps,
    IInputSerialized,
    InputValue,
    SerializableInputValue,
    ValidatorFunction
} from './Input.types';

export class Input<TType extends Type, TNode extends Node = Node> extends Port<TType, TNode> {
    /** Port Default Value */
    public defaultValue: SerializableInputValue<TType>;
    /** Port Value */
    public value: InputValue<TType>;
    /** Port Validator */
    public validator: ValidatorFunction<InputValue<TType>>;

    constructor(node: TNode, props: IInputProps<TType>) {
        super(node, props);

        this.defaultValue = props.defaultValue;
        this.value = props.value || this.defaultValue;
        this.validator = props.validator || ((value: unknown): value is InputValue<TType> => true);

        makeObservable(this, {
            defaultValue: observable.ref,
            value: observable.ref,
            connection: computed,
            setValue: action
        });
    }

    /** Sets Input's Value */
    public setValue(value: SerializableInputValue<TType> | ConnectedInputValue<TType>) {
        if (this.validator(value)) {
            this.value = value;
        }
    }

    /** Incoming Connection */
    public get connection(): Connection<TType> | undefined {
        return [...this.node.context.connections.values()].find(connection => connection.to.id === this.id);
    }

    /** Disposes the Input */
    public dispose() {
        if (this.connection) {
            this.node.context.disconnect(this.connection);
        }
    }

    /** Serializes Port */
    public toJSON(): IInputSerialized<TType> {
        return {
            ...super.toJSON(),
            defaultValue: this.defaultValue,
            value:
                'tag' in this.value && this.value.tag !== 'fn' && !this.connected
                    ? this.node.resolveValue(this.value as SerializableInputValue<TType>)
                    : undefined
        };
    }
}
