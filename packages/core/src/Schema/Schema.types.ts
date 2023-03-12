import { z } from 'zod';

export type Schema = {
    name: string;
    validator: z.Schema;
};
