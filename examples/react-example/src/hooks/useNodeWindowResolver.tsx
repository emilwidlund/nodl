import { Node } from '@nodl/core';
import * as React from 'react';

import { ColorWindow } from '../components/ColorWindow/ColorWindow';
import { Color } from '../nodes/ColorNode/ColorNode';
import { Mix } from '../nodes/MixNode/MixNode';

export const useNodeWindowResolver = () => {
    return React.useCallback((node: Node) => {
        if (node instanceof Mix) {
            return <ColorWindow observable={node.outputs.output} />;
        } else if (node instanceof Color) {
            return <ColorWindow observable={node.inputs.color} />;
        }
    }, []);
};
