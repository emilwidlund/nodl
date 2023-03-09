import { Addition, NumberSchema } from '../Node/Node.fixture';

describe('Input', () => {
    it('should initialize with correct values', () => {
        const addition = new Addition();

        const input = addition.inputs.a;
        expect(typeof input.id).toEqual('string');
        expect(input.name).toEqual('A');
        expect(input.type).toEqual(NumberSchema);
        expect(input.defaultValue).toEqual(0);
        expect(input.value).toEqual(0);
        expect(input.connected).toBeFalsy();
        expect(input.connection).toBeNull();
    });

    it('should store connection', () => {
        const addition = new Addition();
        const addition2 = new Addition();

        expect(addition2.inputs.a.connection).toBeNull();
        const connection = addition.outputs.output.connect(addition2.inputs.a);
        expect(addition2.inputs.a.connection).toEqual(connection);
        connection.dispose();
        expect(addition2.inputs.a.connection).toBeNull();
    });

    it('should have a working connected flag', () => {
        const addition = new Addition();
        const addition2 = new Addition();

        expect(addition2.inputs.a.connected).toBeFalsy();
        const connection = addition.outputs.output.connect(addition2.inputs.a);
        expect(addition2.inputs.a.connected).toBeTruthy();
        connection.dispose();
        expect(addition2.inputs.a.connected).toBeFalsy();
    });

    it('should dispose properly', () => {
        const addition = new Addition();

        const spy = jest.fn();
        addition.outputs.output.subscribe(spy);

        const inputARef = addition.inputs.a;
        addition.dispose();

        expect(() => inputARef.next(200)).toThrow();
        expect(spy).not.toHaveBeenCalledWith(200);
        expect(addition.inputs.a.closed).toBeTruthy();
    });
});
