import { Type } from '@thi.ng/shader-ast';
import _ from 'lodash';
import { action, computed, makeObservable, observable } from 'mobx';
import { v4 as uuid } from 'uuid';

import { Connection } from '../Connection/Connection';
import { Context } from '../Context/Context';
import { Input } from '../Input/Input';
import { ComputedInputValue, IInputSerialized, InputValue, SerializableInputValue } from '../Input/Input.types';
import { Output } from '../Output/Output';
import { IOutputSerialized } from '../Output/Output.types';
import { INodeData, INodeInputs, INodeOutputs, INodePosition, INodeProps, INodeSerialized } from './Node.types';

export abstract class Node {
    /** Associated Context */
    public context: Context;
    /** Unique Identifier */
    public id: string;
    /** Node Name */
    public name: string;
    /** Node Type */
    public abstract type: string;
    /** Node Inputs */
    public inputs: INodeInputs;
    /** Node Outputs */
    public outputs: INodeOutputs;
    /** Node Data */
    public data: INodeData;

    constructor(context: Context, props: INodeProps) {
        this.context = context;

        const { id, name, data } = _.defaultsDeep(props, {
            id: uuid(),
            // @ts-ignore
            name: this.constructor.nodeName || 'Untitled',
            inputs: {},
            outputs: {},
            data: {
                position: {
                    x: 0,
                    y: 0
                }
            }
        }) as Required<INodeProps>;

        this.id = id;
        this.name = name;
        this.data = data;
        this.inputs = {};
        this.outputs = {};

        makeObservable(this, {
            id: observable,
            name: observable,
            data: observable,
            inputs: observable,
            outputs: observable,
            ports: computed,
            setPosition: action
        });

        this.context.add(this);
    }

    /** Resolves a value from given port */
    public resolveValue<TType extends Type, T extends InputValue<TType>>(
        value: T
    ): SerializableInputValue<TType> | ComputedInputValue<TType> {
        if (value instanceof Output) {
            const output = value;
            return this.resolveValue(output.value);
        } else if (_.isFunction(value)) {
            return value();
        } else {
            return value;
        }
    }

    /** Associated ports */
    public get ports() {
        return [...Object.values(this.inputs || {}), ...Object.values(this.outputs || {})];
    }

    /** Associated connections */
    public get connections(): Connection<any>[] {
        return this.ports
            .flatMap(port => (port instanceof Input ? [port.connection] : port.connections))
            .filter((connection): connection is Connection<any> => Boolean(connection));
    }

    /** Sets Position in Node Data */
    public setPosition(position: INodePosition) {
        this.data.position = position;
    }

    /** Disposes the Node */
    public dispose(): void {
        for (const port of this.ports) {
            port.dispose();
        }

        this.context.remove(this);
    }

    /** Serializes Node */
    public toJSON(): INodeSerialized {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            data: this.data,
            inputs: this.inputs as Record<string, IInputSerialized<any>>,
            outputs: this.outputs as Record<string, IOutputSerialized<any>>
        };
    }
}
