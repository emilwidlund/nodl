import { Node } from '@nodl/core';
import color from 'color';
import { folder, useControls, useCreateStore } from 'leva';
import { Schema } from 'leva/dist/declarations/src/types';
import React from 'react';

export const useNodeControls = () => {
    const [inputs, setInputs] = React.useState<Schema>({});
    const levaStore = useCreateStore();

    const [controls, set] = useControls(() => inputs, { store: levaStore }, [inputs]);

    const onSelection = React.useCallback(
        (nodes: Node[]) => {
            const inputs = nodes.reduce<any>((acc, node) => {
                const schema = Object.values(node.inputs).reduce<any>((acc, input) => {
                    if (input.value instanceof color && !input.connected) {
                        return {
                            ...acc,
                            [`${input.name}: ${input.id}`]: {
                                r: input.value.red(),
                                g: input.value.green(),
                                b: input.value.blue(),
                                a: input.value.alpha(),
                                onChange: ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
                                    input.next(color([r, g, b, a]));
                                }
                            }
                        };
                    } else if (typeof input.value === 'number' && !input.connected) {
                        return {
                            ...acc,
                            [`${input.name}: ${input.id}`]: {
                                value: input.value,
                                step: 1,
                                onChange: value => {
                                    input.next(value);
                                }
                            }
                        };
                    } else {
                        return acc;
                    }
                }, {});

                return { ...acc, [`${node.name}: ${node.id}`]: folder(schema) };
            }, {});

            setInputs(inputs);
        },
        [set]
    );

    return {
        levaStore,
        controls,
        onSelection
    };
};
