import { IPlugin } from "@sonyahon/nestjs-config";
import { fetchDotenvPrefix, fetchDotenvVars } from "./decorators";

export class DotenvPlugin implements IPlugin {
    apply(target: any): void {
        const prefix = fetchDotenvPrefix(target);
        const props = fetchDotenvVars(target);
        props.forEach(({ property, params: { name, transformer } }) => {
            const envPath = prefix ? `${prefix.prefix}__${name}` : name;
            const envValue = process.env[envPath];
            if (envValue !== undefined) {
                const transformedValue = transformer ? transformer(envValue) : envValue;
                target[property] = transformedValue;
            }
        })
    }
}