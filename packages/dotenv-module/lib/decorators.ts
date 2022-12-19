import { makeClassDecorator, makePropertyDecorator } from '@sonyahon/nestjs-config';

export const [DotenvVar, fetchDotenvVars] = makePropertyDecorator((name: string, transformer?: (value: string) => any) => ({
    name,
    transformer
}));
export const [DotenvPrefix, fetchDotenvPrefix] = makeClassDecorator((prefix: string) => ({ prefix }));