import { Input, Output } from '@nodl/core';

export type PortProps<T> = {
    port: Input<T> | Output<T>;
    isOutput: boolean;
};
