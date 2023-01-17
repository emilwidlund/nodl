import { Connection, Output } from '@nodl/core';

export type ConnectionTargetPoint = {
    x: number;
    y: number;
};

export type ConnectionProps<T> = {
    output?: Output<T>;
    point?: ConnectionTargetPoint;
    connection?: Connection<T>;
};
