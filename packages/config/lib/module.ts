import { Module, DynamicModule, OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { fetchConfigSymbolMetadata } from './metadata-utils';
import { IPlugin, UseAsyncPlugin } from './plugin';

export interface IConfigModuleRegisterOptions {
    configs: (new () => any)[],
    plugins: IPlugin[],
}

export interface IConfigModuleRegisterAsyncOptions extends IConfigModuleRegisterOptions {
    asyncPlugins: UseAsyncPlugin[],
}

@Module({})
export class ConfigModule implements OnApplicationBootstrap {
    constructor(private readonly moduleRef: ModuleRef) { }

    private static registeredAsAsync = false;
    private static asyncProvidersTokens: any[] = [];
    private static configTokens: any[] = [];

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

            ConfigModule.configTokens.push(cfgProvideToken);
            providers.push({ provide: cfgProvideToken, useValue: cfgInstance })
        }

        return {
            module: ConfigModule,
            global: true,
            providers,
        }
    }

    static registerAsync(options: IConfigModuleRegisterAsyncOptions): DynamicModule {
        const result = ConfigModule.register(options);
        ConfigModule.registeredAsAsync = true;
        for (const asyncPlugin of options.asyncPlugins) {
            ConfigModule.asyncProvidersTokens.push(asyncPlugin.provide);
            result.providers?.push(asyncPlugin);
        }
        return result;
    }

    async onApplicationBootstrap() {
        if (!ConfigModule.registeredAsAsync) {
            return;
        }
        for (const asyncProviderToken of ConfigModule.asyncProvidersTokens) {
            const providerInstance = await this.moduleRef.resolve(asyncProviderToken);
            for (const configToken of ConfigModule.configTokens) {
                const configInstance = await this.moduleRef.resolve(configToken);
                await providerInstance.apply(configInstance);
            }
        }
    }
}