import { schema } from '@nodl/core';
import { Scene } from 'three';
import { z } from 'zod';

export const SceneSchema = schema('Scene', z.instanceof(Scene));
