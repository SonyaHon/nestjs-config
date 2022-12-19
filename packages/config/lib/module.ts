import { Module, DynamicModule } from '@nestjs/common';
import { fetchConfigSymbolMetadata } from './metadata-utils';
import { IPlugin } from './plugin';

export interface IConfigModuleRegisterOptions {
    configs: (new () => any)[],
    plugins: IPlugin[],
}

@Module({})
export class ConfigModule {
    static register(options: IConfigModuleRegisterOptions): DynamicModule {
        const providers = [];

        for (const config of options.configs) {
            const cfgInstance = new config();
            const cfgProvideToken = fetchConfigSymbolMetadata(cfgInstance);
            if (cfgProvideToken === null) {
                throw new Error(`All configs passed to ConfigModule must be decorated with @Config decorator. Passed: ${config}`);
            }

            for (const plugin of options.plugins) {
                plugin.apply(cfgInstance);
            }
            providers.push({ provide: cfgProvideToken, useValue: cfgInstance })
        }

        return {
            module: ConfigModule,
            global: true,
            providers,
        }
    }
}