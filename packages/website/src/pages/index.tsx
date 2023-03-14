import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Circuit, CircuitStore } from '@nodl/react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import color from 'color';
import { LevaPanel } from 'leva';
import * as React from 'react';

import { useNodeControls } from '../hooks/useNodeControls';
import { useNodeWindowResolver } from '../hooks/useNodeWindowResolver';
import { Color } from '../nodes/ColorNode/ColorNode';
import { Mesh } from '../nodes/MeshNode/MeshNode';
import { Mix } from '../nodes/MixNode/MixNode';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="/docs/intro">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

/** Declare 3 nodes */
const colorNode = new Color();
const colorNode2 = new Color();
const mixNode = new Mix();
const meshNode = new Mesh();

/** Connect them together */
colorNode.outputs.rgb.connect(mixNode.inputs.a);
colorNode2.outputs.rgb.connect(mixNode.inputs.b);
mixNode.outputs.output.connect(meshNode.inputs.color);

/** Push color node's initial values */
colorNode.inputs.color.next(color('#0070ff'));
colorNode2.inputs.color.next(color('#ff0048'));

const store = new CircuitStore();

store.setNodes([
    [colorNode, { x: -220, y: 200 }],
    [colorNode2, { x: -220, y: 0 }],
    [mixNode, { x: 220, y: 100 }]
]);

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const nodeWindowResolver = useNodeWindowResolver();
    const { levaStore, onSelection } = useNodeControls();

    React.useEffect(() => {
        store.setNodes([
            [colorNode, { x: -420, y: 350 }],
            [colorNode2, { x: -420, y: -50 }],
            [mixNode, { x: 0, y: 50 }],
            [meshNode, { x: 400, y: 50 }]
        ]);

        return () => {
            store.dispose();
        };
    }, []);

    return (
        <BrowserOnly>
            {() => (
                <Layout description={siteConfig.tagline}>
                    <HomepageHeader />
                    <div style={{ position: 'relative', height: '100vh' }}>
                        <LevaPanel store={levaStore} titleBar={{ position: { x: -20, y: 80 } }} />
                        <Circuit
                            className={styles.circuit}
                            store={store}
                            nodeWindowResolver={nodeWindowResolver}
                            onSelectionChanged={onSelection}
                        />
                    </div>
                </Layout>
            )}
        </BrowserOnly>
    );
}
