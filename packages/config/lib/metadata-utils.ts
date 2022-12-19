import 'reflect-metadata';
import { CONFIG_SYMBOL } from "./metadata-keys"

export const fetchConfigSymbolMetadata = (target: any): string | null => {
    if (typeof target === 'function') {
        return Reflect.getMetadata(CONFIG_SYMBOL, target) || null;
    }
    if (target && target.constructor) {
        return Reflect.getMetadata(CONFIG_SYMBOL, target.constructor) || null;
    }
    return null;
}