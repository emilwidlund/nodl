import { Node } from '@nodl/core';
import React from 'react';

import { ColorWindow } from '../components/ColorWindow/ColorWindow';
import { SceneWindow } from '../components/SceneWindow/SceneWindow';
import { Color } from '../nodes/ColorNode/ColorNode';
import { Mesh } from '../nodes/MeshNode/MeshNode';
import { Mix } from '../nodes/MixNode/MixNode';

export const useNodeWindowResolver = () => {
    return React.useCallback((node: Node) => {
        if (node instanceof Mix) {
            return <ColorWindow observable={node.outputs.output} />;
        } else if (node instanceof Color) {
            return <ColorWindow observable={node.inputs.color} />;
        } else if (node instanceof Mesh) {
            return <SceneWindow observable={node.mesh} />;
        }
    }, []);
};
