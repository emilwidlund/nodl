import { KeyboardKey } from '../../types';

export type KeyboardAction = {
    key: KeyboardKey | string;
    modifier?: 'ctrlKey' | 'altKey' | 'metaKey';
    callback: (e: KeyboardEvent) => void;
};
