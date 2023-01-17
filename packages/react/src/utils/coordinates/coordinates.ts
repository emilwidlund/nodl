import { CANVAS_SIZE } from '../../constants';

/** Converts cartesian point to absolute coordinate system */
export const fromCartesianPoint = (width: number, height: number, x: number, y: number) => {
    const midWidth = width / 2;
    const midHeight = height / 2;
    const cartesianX = midWidth + x;
    const cartesianY = midHeight + -y;

    return { x: cartesianX, y: cartesianY };
};

/** Converts from absolute coordinate system to a cartesian system */
export const toCartesianPoint = (width: number, height: number, x: number, y: number) => {
    const midWidth = width / 2;
    const midHeight = height / 2;

    return { x: x - midWidth, y: -(y - midHeight) };
};

/** Resolves a cartesian coordinate point to an absolute coordinate, relative to the canvas size */
export const fromCanvasCartesianPoint = (x: number, y: number) => fromCartesianPoint(CANVAS_SIZE, CANVAS_SIZE, x, y);

/** Resolves an absolute coordinate point to a cartesian coordinate, relative to the canvas size */
export const toCanvasCartesianPoint = (x: number, y: number) => toCartesianPoint(CANVAS_SIZE, CANVAS_SIZE, x, y);
