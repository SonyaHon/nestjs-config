import { makeClassDecorator, makePropertyDecorator } from "../lib";

describe('decorator makers', () => {
    test('should return a decorator and a function to retrieve it for a property', () => {
        const [Deco, fetchDeco] = makePropertyDecorator((isValid: boolean) => ({ isValid }));
        class Demo {
            @Deco(true)
            valueX = 10;
        }

        expect(fetchDeco(new Demo())).toEqual([{ property: 'valueX', value: 10, params: { isValid: true } }])
    });

    test('should return a decorator and a function to retrieve it for a class', () => {
        const [Deco, fetchDeco] = makeClassDecorator((isValid: boolean) => ({ isValid }));

        @Deco(true)
        class Demo {

        }

        expect(fetchDeco(new Demo())).toEqual({ isValid: true });
    })
});