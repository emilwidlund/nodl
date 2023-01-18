import * as React from 'react';

export enum TooltipPosition {
    TOP,
    TOP_RIGHT,
    RIGHT,
    BOTTOM_RIGHT,
    BOTTOM,
    BOTTOM_LEFT,
    LEFT,
    TOP_LEFT
}

export interface ITooltipNodeProps {
    text: string;
    position: TooltipPosition;
    offset?: { x: number; y: number };
}

export interface ITooltipProps {
    text: string;
    position: TooltipPosition;
    children: React.ReactNode;
    offset?: { x: number; y: number };
    className?: string;
}
