import { Observable } from 'rxjs';
import { Mesh } from 'three';

export type SceneWindowProps = {
    observable: Observable<Mesh>;
};
