import React from 'react';

import { ColorWindowProps } from './ColorWindow.types';

export const ColorWindow = ({ observable }: ColorWindowProps) => {
    const [color, setColor] = React.useState<number[]>([0, 0, 0]);

    React.useEffect(() => {
        const sub = observable.subscribe(value => {
            setColor(value.array());
        });

        return () => {
            sub.unsubscribe();
        };
    }, [observable]);

    const rgb = React.useMemo(() => `rgb(${color[0]}, ${color[1]}, ${color[2]})`, [color]);

    return <div style={{ height: 200, backgroundColor: rgb }} />;
};
