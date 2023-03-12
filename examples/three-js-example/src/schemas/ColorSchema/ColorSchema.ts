import { schema } from '@nodl/core';
import * as color from 'color';
import { z } from 'zod';

export const ColorSchema = schema(
    'Color',
    z.custom((data: any) => color(data))
);
