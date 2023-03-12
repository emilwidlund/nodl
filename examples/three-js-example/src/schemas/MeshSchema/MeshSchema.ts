import { schema } from '@nodl/core';
import { Mesh } from 'three';
import { z } from 'zod';

export const MeshSchema = schema('Mesh', z.instanceof(Mesh));
