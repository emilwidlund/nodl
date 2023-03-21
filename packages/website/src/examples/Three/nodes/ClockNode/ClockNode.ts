import { Node, Output, schema } from '@nodl/core';
import { animationFrameScheduler, interval } from 'rxjs';
import z from 'zod';

export class Clock extends Node {
    name = 'Clock';

    inputs = {};

    outputs = {
        elapsed: new Output({
            name: 'Elapsed',
            type: schema(z.number()),
            observable: interval(0, global.requestAnimationFrame !== undefined ? animationFrameScheduler : undefined)
        })
    };
}
