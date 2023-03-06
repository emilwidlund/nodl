import { Connection } from '@nodl/core';
import { act, render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import { CircuitStore, StoreContext } from '../../stores/CircuitStore/CircuitStore';
import { Connection as ConnectionComponent } from './Connection';
import { Addition } from './Connection.fixture';
import { ConnectionProps } from './Connection.types';

const setup = (store: CircuitStore, props?: Partial<ConnectionProps<unknown>>) => {
    return render(
        <StoreContext.Provider value={{ store: store }}>
            <svg width={2000} height={2000}>
                <ConnectionComponent {...props} />
            </svg>
        </StoreContext.Provider>
    );
};

describe('Connection', () => {
    let store: CircuitStore;
    let addition1: Addition;
    let addition2: Addition;
    let connection: Connection<any>;

    beforeEach(() => {
        addition1 = new Addition();
        addition2 = new Addition();

        connection = addition1.outputs.output.connect(addition2.inputs.a);

        store = new CircuitStore();

        store.setNodes([
            [addition1, { x: -400, y: 100 }],
            [addition2, { x: 400, y: 300 }]
        ]);

        // Create dummy elements so the Connection-component can compute their positions

        const node1Element = document.createElement('div');
        const node2Element = document.createElement('div');
        const outputElement = document.createElement('div');
        const inputElement = document.createElement('div');

        node1Element.style.transform = 'translate2D(-400px, 200px)';
        outputElement.style.transform = 'translate2D(-160px, 200px)';
        node2Element.style.transform = 'translate2D(400px, -200px)';
        inputElement.style.transform = 'translate2D(400px, -200px)';

        store.setNodeElement(addition1.id, node1Element);
        store.setPortElement(connection.from.id, outputElement);
        store.setNodeElement(addition2.id, node2Element);
        store.setPortElement(connection.to.id, inputElement);
    });

    it('should render correctly', () => {
        const result = setup(store, { connection });

        expect(result.asFragment()).toMatchSnapshot();
    });

    it('should dispose connection when clicked', () => {
        const result = setup(store, { connection });
        const spy = jest.spyOn(connection, 'dispose');

        expect(spy).toHaveBeenCalledTimes(0);
        expect(connection.closed).toBeFalsy();

        fireEvent.click(result.container.getElementsByTagName('path')[0]);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(connection.closed).toBeTruthy();
    });

    it('should render a different color when part of selected connections', () => {
        const result = setup(store, { connection });

        expect(result.container.getElementsByClassName('connector')[0] as SVGPathElement).toHaveAttribute(
            'stroke',
            '#424763'
        );

        act(() => {
            store.selectNodes([addition1]);
        });

        const newResult = setup(store, { connection });

        expect(newResult.container.getElementsByClassName('connector')[0] as SVGPathElement).toHaveAttribute(
            'stroke',
            '#1e62ff'
        );
    });
});
