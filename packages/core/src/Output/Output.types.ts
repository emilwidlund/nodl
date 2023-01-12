import { Observable } from 'rxjs';
import { z } from 'zod';

export interface IOutputProps<T> {
    name?: string;
    type: z.Schema;
    observable: Observable<T>;
}
