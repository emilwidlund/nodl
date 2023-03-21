import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Mesh } from 'three';

import { SceneWindowProps } from './SceneWindow.types';

const MeshComponent = ({ mesh }: { mesh: Mesh }) => {
    const meshRef = React.useRef<Mesh>();

    return <primitive ref={meshRef} object={mesh} />;
};

export const SceneWindow = ({ observable }: SceneWindowProps) => {
    const [mesh, setMesh] = React.useState<Mesh>();

    React.useEffect(() => {
        const sub = observable.subscribe(value => {
            setMesh(value);
        });

        return () => {
            sub.unsubscribe();
        };
    }, [observable]);

    return (
        <Canvas style={{ height: 200 }} gl={{ alpha: false }} camera={{ fov: 35 }}>
            <pointLight position={[0, 0, 10]} />
            {mesh ? <MeshComponent mesh={mesh} /> : undefined}
        </Canvas>
    );
};
