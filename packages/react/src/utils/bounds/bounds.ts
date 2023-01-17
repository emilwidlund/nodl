import { Bounds } from './bounds.types';

/** Normalizes bounds from negative to absolute values */
export const normalizeBounds = ({ x, y, width, height }: Bounds) => {
    return {
        x: width < 0 ? x + width : x,
        y: height < 0 ? y + height : y,
        width: Math.abs(width),
        height: Math.abs(height)
    };
};

/** Predicate to determine if a point is within the given normalized bounds */
export const withinBounds = (a: Bounds, b: Bounds) => {
    const aLeftOfB = a.x + a.width < b.x;
    const aRightOfB = a.x > b.x + b.width;
    const aAboveB = a.y > b.y + b.height;
    const aBelowB = a.y + a.height < b.y;

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
};
