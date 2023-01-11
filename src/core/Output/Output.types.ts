import { Observable } from 'rxjs';

export interface IOutputProps<T> {
    name?: string;
    type: object;
    observable: Observable<T>;
}
