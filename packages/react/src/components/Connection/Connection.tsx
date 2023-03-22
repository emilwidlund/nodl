import { Connection as NodlConnection } from '@nodl/core';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { ConnectionProps } from './Connection.types';
import { quadraticCurve } from './Connection.utils';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';

const INPUT_PORT_OFFSET_X = 12;
const INPUT_PORT_OFFSET_Y = 12;

const OUTPUT_PORT_OFFSET_X = 0;
const OUTPUT_PORT_OFFSET_Y = 12;

const defaultPosition = { x: 0, y: 0 };

export const Connection = observer(<T,>({ output, connection }: ConnectionProps<T>) => {
    const [pathString, setPathString] = React.useState('');
    const [fromPos, setFromPos] = React.useState(defaultPosition);
    const [toPos, setToPos] = React.useState(defaultPosition);
    const { store } = React.useContext(StoreContext);

    const outputElement = connection
        ? store.portElements.get(connection.from.id)
        : output
        ? store.portElements.get(output.id)
        : undefined;
    const inputElement = connection && store.portElements.get(connection.to.id);

    React.useEffect(() => {
        if (outputElement && inputElement) {
            return autorun(() => {
                if (connection) {
                    const fromNode = store.getNodeByPortId(connection.from.id);
                    const toNode = store.getNodeByPortId(connection.to.id);

                    const fromPosition = store.nodePositions.get(fromNode?.id || '');
                    const toPosition = store.nodePositions.get(toNode?.id || '');

                    if (!fromPosition || !toPosition) {
                        return;
                    }

                    const fromNodeHalfWidth =
                        (store.nodeElements.get(fromNode?.id || '')?.getBoundingClientRect().width || 0) / 2;
                    const toNodeHalfWidth =
                        (store.nodeElements.get(toNode?.id || '')?.getBoundingClientRect().width || 0) / 2;

                    const outputCartesian = store.fromCanvasCartesianPoint(
                        fromPosition.x + fromNodeHalfWidth,
                        fromPosition.y
                    );

                    const inputCartesian = store.fromCanvasCartesianPoint(toPosition.x - toNodeHalfWidth, toPosition.y);

                    const outputPortPosition = {
                        x: outputCartesian.x,
                        y: outputCartesian.y + outputElement.offsetTop
                    };

                    const inputPortPosition = {
                        x: inputCartesian.x + inputElement.offsetLeft,
                        y: inputCartesian.y + inputElement.offsetTop
                    };

                    const newFromPos = {
                        x: outputPortPosition.x + OUTPUT_PORT_OFFSET_X,
                        y: outputPortPosition.y + OUTPUT_PORT_OFFSET_Y
                    };

                    const newToPos = {
                        x: inputPortPosition.x - INPUT_PORT_OFFSET_X,
                        y: inputPortPosition.y + INPUT_PORT_OFFSET_Y
                    };

                    setFromPos(newFromPos);
                    setToPos(newToPos);

                    setPathString(quadraticCurve(newFromPos, newToPos));
                }
            });
        }
    }, [outputElement, inputElement]);

    React.useEffect(() => {
        if (output && outputElement) {
            return autorun(() => {
                const fromNode = store.getNodeByPortId(output.id);
                const outputPosition = store.nodePositions.get(fromNode?.id || '');

                if (!outputPosition) {
                    return;
                }

                const fromNodeHalfWidth =
                    (store.nodeElements.get(fromNode?.id || '')?.getBoundingClientRect().width || 0) / 2;

                const outputCartesian = store.fromCanvasCartesianPoint(
                    outputPosition.x + fromNodeHalfWidth,
                    outputPosition.y
                );

                const outputPortPosition = {
                    x: outputCartesian.x,
                    y: outputCartesian.y + outputElement.offsetTop
                };

                const newFromPos = {
                    x: outputPortPosition.x + OUTPUT_PORT_OFFSET_X,
                    y: outputPortPosition.y + OUTPUT_PORT_OFFSET_Y
                };

                setFromPos(newFromPos);
                setToPos(store.mousePosition);

                setPathString(quadraticCurve(newFromPos, store.mousePosition));
            });
        }
    }, [output, outputElement]);

    const handleClick = React.useCallback(() => {
        if (connection) {
            connection.dispose();
        }
    }, [connection]);

    const selectedConnection =
        connection &&
        store.selectedNodes?.flatMap(node => node.connections).includes(connection as NodlConnection<unknown>);
    const strokeColor = selectedConnection || output ? '#1e62ff' : '#424763';

    return (
        <g>
            <path
                className="connector"
                d={pathString}
                fill="none"
                strokeWidth="2"
                stroke={strokeColor}
                onClick={handleClick}
            />
            <path
                className="port"
                d={`M${fromPos.x},${fromPos.y},${fromPos.x + 2},${fromPos.y}`}
                fill="none"
                strokeWidth="8"
                stroke={strokeColor}
            />
            <path
                className="port"
                d={`M${toPos.x - 2},${toPos.y},${toPos.x},${toPos.y}`}
                fill="none"
                strokeWidth="8"
                stroke={strokeColor}
            />
        </g>
    );
});
