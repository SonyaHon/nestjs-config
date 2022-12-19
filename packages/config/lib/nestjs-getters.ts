import { fetchConfigSymbolMetadata } from "./metadata-utils"

export const getConfigToken = (configClass: any) => {
    const token = fetchConfigSymbolMetadata(configClass);
    if (token === null) {
        throw new Error(`${configClass} is not a valid configuration class`);
    }
    return token;
}