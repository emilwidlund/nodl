/** @jsxImportSource @emotion/react */
import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { portTypeStyles, portWrapperStyles } from './Port.styles';
import { PortProps } from './Port.types';
import { useHover } from '../../hooks/useHover/useHover';
import { usePort } from '../../hooks/usePort/usePort';
import { StoreContext } from '../../stores/CircuitStore/CircuitStore';
import { Tooltip } from '../Tooltip/Tooltip';
import { TooltipPosition } from '../Tooltip/Tooltip.types';

export const Port = observer(<T,>({ port }: PortProps<T>) => {
    const { ref, onMouseUp, onMouseDown, onClick } = usePort(port);
    const isOutput = React.useMemo(() => 'connect' in port, [port]);

    const { onMouseEnter, onMouseLeave, isHovered } = useHover();
    const { onMouseEnter: onPortTypeEnter, onMouseLeave: onPortTypeLeave, isHovered: isPortTypeHovered } = useHover();
    const { store } = React.useContext(StoreContext);

    const tooltipPosition = React.useMemo(() => (isOutput ? TooltipPosition.RIGHT : TooltipPosition.LEFT), [isOutput]);
    const visuallyDisabled = React.useMemo(() => {
        const isOccupied = !isOutput && port.connected;
        const hasDifferentValueType = store.draftConnectionSource?.type !== port.type;
        const hasSharedNode = store.draftConnectionSource
            ? store.getNodeByPortId(store.draftConnectionSource.id) === store.getNodeByPortId(port.id)
            : false;
        // const isUnrelatedToConnectionDraft = store.draftConnectionSource !== port;

        return store.draftConnectionSource ? isOccupied || hasDifferentValueType || isOutput || hasSharedNode : false;
    }, [isOutput]);

    return (
        <Tooltip text={port.type.name} position={tooltipPosition}>
            <div
                ref={ref}
                css={portWrapperStyles(
                    port.connected ||
                        (!store.draftConnectionSource && isHovered) ||
                        (!!store.draftConnectionSource && !visuallyDisabled),
                    isOutput,
                    visuallyDisabled
                )}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
            >
                <div
                    css={portTypeStyles(
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
                        <span>{port.type.name.charAt(0)}</span>
                    )}
                </div>
                <span>{port.name}</span>
            </div>
        </Tooltip>
    );
});
