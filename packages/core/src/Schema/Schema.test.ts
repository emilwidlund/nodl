import { z } from 'zod';

import { schema } from './Schema';

describe('Schema', () => {
    it('should work with a single argument', () => {
        const validator = z.number();

        expect(schema(validator)).toMatchObject({
            name: 'Number',
            validator
        });
    });

    it('should work with two arguments', () => {
        const validator = z.number();

        expect(schema('Test', validator)).toMatchObject({
            name: 'Test',
            validator
        });
    });

    it('should work with custom validators', () => {
        const validator = z.custom(value => (value as string).length === 3);
        const typeSchema = schema('String with 3 chars', validator);

        expect(typeSchema).toMatchObject({
            name: 'String with 3 chars',
            validator
        });

        expect(() => typeSchema.validator.parse(12)).toThrow();
        expect(() => typeSchema.validator.parse('123')).not.toThrow();
    });

    it('should trim Zod-prefix', () => {
        const validator = z.number();

        expect(validator.constructor.name).toEqual('ZodNumber');
        expect(schema(validator).name).toEqual('Number');
    });
});
