import { Connection as NodlConnection } from '@nodl/core';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { NODE_POSITION_OFFSET_X } from '../../constants';
import { store as canvasStore } from '../../stores/CanvasStore/CanvasStore';
import { fromCanvasCartesianPoint } from '../../utils/coordinates/coordinates';
import { ConnectionProps } from './Connection.types';
import { quadraticCurve } from './Connection.utils';

const INPUT_PORT_OFFSET_X = 12;
const INPUT_PORT_OFFSET_Y = 12;

const OUTPUT_PORT_OFFSET_X = 0;
const OUTPUT_PORT_OFFSET_Y = 12;

const defaultPosition = { x: 0, y: 0 };

export const Connection = observer(<T,>({ output, connection }: ConnectionProps<T>) => {
    const [pathString, setPathString] = React.useState('');
    const [fromPos, setFromPos] = React.useState(defaultPosition);
    const [toPos, setToPos] = React.useState(defaultPosition);

    const outputElement = connection
        ? canvasStore.portElements.get(connection.from.id)
        : output
        ? canvasStore.portElements.get(output.id)
        : undefined;
    const inputElement = connection && canvasStore.portElements.get(connection.to.id);

    React.useEffect(() => {
        if (outputElement && inputElement) {
            return autorun(() => {
                if (connection) {
                    const fromPosition = canvasStore.getNodeByPortId(connection.from.id)?.data.position;
                    const toPosition = canvasStore.getNodeByPortId(connection.to.id)?.data.position;

                    if (!fromPosition || !toPosition) {
                        return;
                    }

                    const outputCartesian = fromCanvasCartesianPoint(
                        fromPosition.x + NODE_POSITION_OFFSET_X,
                        fromPosition.y
                    );

                    const inputCartesian = fromCanvasCartesianPoint(
                        toPosition.x - NODE_POSITION_OFFSET_X,
                        toPosition.y
                    );

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
            const outputPosition = canvasStore.getNodeByPortId(output.id)?.data.position;

            if (!outputPosition) {
                return;
            }

            const outputCartesian = fromCanvasCartesianPoint(
                outputPosition.x + NODE_POSITION_OFFSET_X,
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
            setToPos(canvasStore.mousePosition);

            setPathString(quadraticCurve(newFromPos, canvasStore.mousePosition));
        }
    }, [output, outputElement]);

    const handleClick = React.useCallback(() => {
        if (connection) {
            connection.dispose();
        }
    }, [connection]);

    const selectedConnection =
        connection &&
        canvasStore.selectedNodes?.flatMap(node => node.connections).includes(connection as NodlConnection<unknown>);
    const strokeColor =
        selectedConnection || output
            ? getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
            : getComputedStyle(document.documentElement).getPropertyValue('--connection-color');

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
