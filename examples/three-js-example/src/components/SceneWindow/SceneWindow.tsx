import { Canvas, useFrame } from '@react-three/fiber';
import * as React from 'react';
import { Mesh } from 'three';

import { SceneWindowProps } from './SceneWindow.types';

const MeshComponent = ({ mesh }: { mesh: Mesh }) => {
    const meshRef = React.useRef<Mesh>();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime();
            meshRef.current.rotation.y = clock.getElapsedTime();
        }
    });
    return <primitive ref={meshRef} object={mesh} position={[0, 0, 2]} />;
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
        <Canvas style={{ height: 200 }} gl={{ alpha: false }}>
            <pointLight position={[0, 0, 10]} />
            {mesh ? <MeshComponent mesh={mesh} /> : undefined}
        </Canvas>
    );
};
