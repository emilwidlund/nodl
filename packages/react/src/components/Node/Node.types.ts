import {DraggableProps} from 'react-draggable';

export type NodeProps = {
    headerComponent?: JSX.Element;
    windowComponent?: JSX.Element;
    bodyComponent?: JSX.Element;
    options?: DraggableProps;
}