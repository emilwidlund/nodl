import { IConnectionSerialized } from '../Connection/Connection.types';
import { INodeSerialized } from '../Node/Node.types';

export interface IContextProps {
    id?: string;
    name?: string;
    root?: INodeSerialized;
    nodes?: [string, INodeSerialized][];
    connections?: [string, IConnectionSerialized<any>][];
}

export interface IContextSerialized {
    id: string;
    name: string;
    nodes: [string, INodeSerialized][];
    connections: [string, IConnectionSerialized<any>][];
}
