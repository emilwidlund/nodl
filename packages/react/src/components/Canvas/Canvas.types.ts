import * as React from 'react';

export type CanvasProps = React.PropsWithChildren<{
    className?: string;
    size: { width: number; height: number };
    onMouseMove?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    onMouseUp?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    onMouseDown?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    onClick?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    onContextMenu?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}>;
