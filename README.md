# nodl

A library for node-based applications.

### Getting Started

```jsx
import * as React from 'react';
import {Canvas, Node} from 'nodl';

export const App = () => {
    return (
        <Canvas size={{width: 5000, height: 5000}}>
            <Node
                headerComponent={<MyHeader />}
                windowComponent={<MyWindow />}
                bodyComponent={<MyBody />}
                options={{
                    bounds: 'parent'
                }}
            />
        </Canvas>
    );
}
```