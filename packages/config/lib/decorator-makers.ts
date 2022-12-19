import 'reflect-metadata';

interface PropertyDecoratorReturns<T> {
    property: string | symbol,
    value?: any,
    params: T
}

export const makePropertyDecorator = <Params, Args extends unknown[]>(
    paramsMaker: (...args: Args) => Params
): [(...args: Args) => PropertyDecorator, (cfgInstance: any) => (PropertyDecoratorReturns<Params>[])] => {
    const decoratorSymbol = Symbol();
    const propDecorator = (...args: Args): PropertyDecorator => {
        return (target, property) => {
            const exisingData = Reflect.getMetadata(decoratorSymbol, target.constructor) || [];
            Reflect.defineMetadata(decoratorSymbol, [...exisingData, {
                property,
                params: paramsMaker(...args)
            } as PropertyDecoratorReturns<Params>], target.constructor);
        };
    }
    const decoratorGetter = (cfgInstance: any): PropertyDecoratorReturns<Params>[] => {
        return (Reflect.getMetadata(decoratorSymbol, cfgInstance.constructor) || []).map((data: PropertyDecoratorReturns<any>) => {
            return {
                ...data,
                value: cfgInstance[data.property]
            };
        });
    };

    return [propDecorator, decoratorGetter];
}

export const makeClassDecorator = <Params, Args extends unknown[]>(
    paramsMaker: (...args: Args) => Params,
): [(...args: Args) => ClassDecorator, (cfgInstance: any) => Params | null] => {
    const decoratorSymbol = Symbol();

    const classDecorator = (...args: Args): ClassDecorator => {
        return (target) => {
            Reflect.defineMetadata(decoratorSymbol, paramsMaker(...args), target);
        }
    }

    const decoratorGetter = (cfgInstance: any) => {
        return Reflect.getMetadata(decoratorSymbol, cfgInstance.constructor) || null;
    }

    return [classDecorator, decoratorGetter];
}