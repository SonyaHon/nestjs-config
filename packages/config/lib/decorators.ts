import 'reflect-metadata';
import { Inject } from '@nestjs/common';
import { CONFIG_SYMBOL } from './metadata-keys';
import { getConfigToken } from './nestjs-getters';

export const Config = (): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(CONFIG_SYMBOL, Symbol.for(`@@${target.name}`), target);
    }
}

export const InjectConfig = (cfgClass: new () => any) => {
    return Inject(getConfigToken(cfgClass));
}