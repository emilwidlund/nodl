import { Modulo } from './Modulo';

describe('Modulo', () => {
    it('should initialize with correct values', () => {
        const modulo = new Modulo();

        expect(typeof modulo.id).toEqual('string');
        expect(modulo.name).toEqual('Modulo');
        expect(modulo.inputs.a).toBeDefined();
        expect(modulo.inputs.b).toBeDefined();
        expect(modulo.outputs.output).toBeDefined();
    });

    it('should compute properly', () => {
        const modulo = new Modulo();

        const spy = jest.fn();
        modulo.outputs.output.subscribe(spy);

        expect(spy).toHaveBeenCalledWith(0);

        modulo.inputs.a.next(2);
        expect(spy).toHaveBeenCalledWith(0);

        modulo.inputs.b.next(11);
        expect(spy).toHaveBeenCalledWith(2);
    });
});
