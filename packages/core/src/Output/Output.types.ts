import { Observable } from 'rxjs';

import { Schema } from '../Schema/Schema.types';

export interface IOutputProps<T> {
    name?: string;
    type: Schema;
    observable: Observable<T>;
}
