import { Observable } from 'rxjs';

export interface IOutputProps<T> {
    name?: string;
    type?: string;
    compute: Observable<T>;
}
