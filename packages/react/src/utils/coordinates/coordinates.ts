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
