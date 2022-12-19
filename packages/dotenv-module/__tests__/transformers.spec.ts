import { Transformers } from "../lib";

describe('transformers', () => {
    test('into int', () => {
        expect(Transformers.IntoInteger('10')).toBe(10);
    });

    test('into number', () => {
        expect(Transformers.IntoNumber('10.5')).toBe(10.5);
    });

    test('into boolean', () => {
        expect(Transformers.IntoBoolean('true')).toBe(true);
        expect(Transformers.IntoBoolean('false')).toBe(false);
    });

    test('into comma seperated list', () => {
        expect(Transformers.IntoCommaSeperatedStringList()('a,b,c,d')).toEqual(['a', 'b', 'c', 'd']);
        expect(Transformers.IntoCommaSeperatedStringList(Transformers.IntoInteger)('1,2,3,4')).toEqual([1, 2, 3, 4]);
    });
});