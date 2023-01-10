
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { Context } from '../Context/Context';
import { Emitter } from '../Emitter/Emitter';
import { Input } from '../Input/Input';
import { InputValue, SerializableInputValue } from '../Input/Input.types';
import { Node } from '../Node/Node';
import { Output } from '../Output/Output';
import { IConnectionProps, IConnectionSerialized } from './Connection.types';

export class Connection<TType extends Type> extends Emitter {
    /** Unique Identifier */
    public id: string;
    /** Associated Artboard */
    public context: Context;
    /** From Output */
    public from: Output<TType, Node>;
    /** To Input */
    public to: Input<TType, Node>;
    /** Previous Input Value */
    public previousInputValue: InputValue<TType>;

    /** Reaction Disposer */
    private reactionDisposer: IReactionDisposer;

    constructor(context: Context, props: IConnectionProps<TType>) {
        const { id } = _.defaults(props, {
            id: uuid()
        });

        this.id = id;
        this.context = context;
        this.from = props.from;
        this.to = props.to;
        this.previousInputValue = props.to.value;

        makeObservable(this, {
            id: observable,
            from: observable,
            to: observable,
            type: computed
        });

        if (this.to.connected) {
            throw new Error(`Input ${this.to.id} is already connected`);
        }

        if (this.from.type !== this.to.type) {
            throw new Error(`Output (${this.from.type}) and Input (${this.to.type}) are of different types`);
        }

        if (!this.to.validator(this.from.value)) {
            throw new Error(`Validation of value from Output ${this.from.id} to Input ${this.to.id} failed`);
        }

        this.context.connections.set(this.id, this);

        this.reactionDisposer = autorun(() => {
            if (this.to.validator(this.from.value)) {
                this.to.setValue(this.from);
            } else {
                throw new Error(`Validation of value from Output ${this.from.id} to Input ${this.to.id} failed`);
            }
        });
    }

    /** Connection Value Type */
    get type(): TType {
        return this.from.type;
    }

    /** Disposes Connection */
    public dispose(): void {
        this.reactionDisposer();

        this.to.setValue(this.previousInputValue as SerializableInputValue<TType>);

        this.context.connections.delete(this.id);
    }

    /** Serializes Connection */
    public toJSON(): IConnectionSerialized<TType> {
        return {
            id: this.id,
            from: this.from.id,
            to: this.to.id
        };
    }
}
