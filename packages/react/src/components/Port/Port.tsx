import { Input, Output } from '@nodl/core';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { useHover } from '../../hooks/useHover/useHover';
import { store as canvasStore } from '../../stores/CanvasStore/CanvasStore';
import { Tooltip } from '../Tooltip/Tooltip';
import { TooltipPosition } from '../Tooltip/Tooltip.types';
import { portTypeStyles, portWrapperStyles } from './Port.styles';
import { PortProps } from './Port.types';

export const Port = observer(<T,>({ port }: PortProps<T>) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const { onMouseEnter, onMouseLeave, isHovered } = useHover();
    const { onMouseEnter: onPortTypeEnter, onMouseLeave: onPortTypeLeave, isHovered: isPortTypeHovered } = useHover();

    const isOutput = React.useMemo(() => port.constructor.name === 'Output', [port]);
    const tooltipPosition = React.useMemo(() => (isOutput ? TooltipPosition.RIGHT : TooltipPosition.LEFT), [isOutput]);
    const visuallyDisabled = React.useMemo(() => {
        const isOccupied = !isOutput && port.connected;
        const hasDifferentValueType = canvasStore.draftConnectionSource?.type !== port.type;
        const hasSharedNode = canvasStore.draftConnectionSource
            ? canvasStore.getNodeByPortId(canvasStore.draftConnectionSource.id) === canvasStore.getNodeByPortId(port.id)
            : false;
        // const isUnrelatedToConnectionDraft = canvasStore.draftConnectionSource !== port;

        return canvasStore.draftConnectionSource
            ? isOccupied || hasDifferentValueType || isOutput || hasSharedNode
            : false;
    }, [isOutput]);

    React.useEffect(() => {
        if (ref.current) {
            canvasStore.setPortElement(port.id, ref.current);

            return () => {
                canvasStore.removePortElement(port.id);
            };
        }
    }, []);

    const onMouseDown = React.useCallback(() => {
        if (isOutput) {
            canvasStore.setDraftConnectionSource(port as Output<any>);
        }
    }, [isOutput]);

    const onMouseUp = React.useCallback(() => {
        if (!isOutput && canvasStore.draftConnectionSource) {
            canvasStore.commitDraftConnection(port as Input<any>);
        }
    }, [isOutput]);

    const onClick = React.useCallback(() => {
        if (port.connected) {
            const connections = 'connection' in port ? [port.connection] : port.connections;

            for (const connection of connections) {
                if (connection) {
                    connection.dispose();
                    canvasStore.disconnect(connection);
                }
            }
        }
    }, [port]);

    return (
        <Tooltip text={port.type.constructor.name.toUpperCase()} position={tooltipPosition}>
            <div
                ref={ref}
                className={portWrapperStyles(
                    port.connected ||
                        (!canvasStore.draftConnectionSource && isHovered) ||
                        (!!canvasStore.draftConnectionSource && !visuallyDisabled),
                    isOutput,
                    visuallyDisabled
                )}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
            >
                <div
                    className={portTypeStyles(
                        port.connected,
                        isOutput,
                        isHovered && !visuallyDisabled,
                        isPortTypeHovered && !visuallyDisabled
                    )}
                    onMouseEnter={onPortTypeEnter}
                    onMouseLeave={onPortTypeLeave}
                    onClick={onClick}
                >
                    {port.connected && isPortTypeHovered && !visuallyDisabled ? (
                        <span>x</span>
                    ) : (
                        <span>{port.type.constructor.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span>{port.name}</span>
            </div>
        </Tooltip>
    );
});
