import 'reflect-metadata';
import { CONFIG_SYMBOL } from './metadata-keys';

export const Config = (): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata(CONFIG_SYMBOL, Symbol.for(`@@${target.name}`), target);
    }
}