import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';

import { CANVAS_SIZE } from '../../constants';
import { Canvas } from './Canvas';
import { CanvasProps } from './Canvas.types';

const setup = (props?: Partial<CanvasProps>) => {
    return render(<Canvas size={{ width: CANVAS_SIZE, height: CANVAS_SIZE }} {...props} />);
};

describe('Canvas', () => {
    it('should render correctly', () => {
        const result = setup();

        expect(result.asFragment()).toMatchSnapshot();
    });

    it('should scroll to cartesian midpoint on mount', () => {
        const scrollToSpy = jest.spyOn(Element.prototype, 'scrollTo');

        setup();

        expect(scrollToSpy).toHaveBeenNthCalledWith(1, { left: CANVAS_SIZE / 2, top: CANVAS_SIZE / 2 });
    });

    it('should invoke onMouseMove-handler', () => {
        const onMouseMove = jest.fn();

        const { container } = setup({ onMouseMove });
        const innerElement = container.getElementsByClassName('canvas')[0];

        fireEvent.mouseMove(innerElement);

        expect(onMouseMove).toHaveBeenCalled();
    });

    it('should invoke onMouseDown-handler', () => {
        const onMouseDown = jest.fn();

        const { container } = setup({ onMouseDown });

        const innerElement = container.getElementsByClassName('canvas')[0];
        fireEvent.mouseDown(innerElement);

        expect(onMouseDown).toHaveBeenCalledTimes(1);
    });

    it('should invoke onMouseUp-handler', () => {
        const onMouseUp = jest.fn();

        const { container } = setup({ onMouseUp });

        const innerElement = container.getElementsByClassName('canvas')[0];
        fireEvent.mouseUp(innerElement);

        expect(onMouseUp).toHaveBeenCalledTimes(1);
    });

    it('should invoke onClick-handler', () => {
        const onClick = jest.fn();

        const { container } = setup({ onClick });

        const innerElement = container.getElementsByClassName('canvas')[0];
        fireEvent.click(innerElement);

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
