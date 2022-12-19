import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { Config, ConfigModule, getConfigToken, IAsyncPlugin, IPlugin } from '../lib';

describe('config-module', () => {
    test('should be gettable', async () => {
        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [],
                plugins: []
            })],
        }).compile();

        expect(testingModule.get(ConfigModule)).toBeInstanceOf(ConfigModule);
    });

    test('should throw if passed a non decorated config', () => {
        class NonDecorated { };
        expect(() => ConfigModule.register({ configs: [NonDecorated], plugins: [] })).toThrow();
    });

    test('should get the config', async () => {
        @Config()
        class DemoConfig { value = 10; }

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [DemoConfig],
                plugins: []
            })]
        }).compile();

        const cfg: DemoConfig = testingModule.get(getConfigToken(DemoConfig));
        expect(cfg).toBeInstanceOf(DemoConfig);
        expect(cfg.value).toBe(10);
    });

    test('should apply plugins', async () => {
        @Config()
        class DemoConfig { value = 10; }

        const DemoPlugin: IPlugin = {
            apply(cfgInstance: any) {
                cfgInstance.value = 42;
            }
        };

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [DemoConfig],
                plugins: [DemoPlugin]
            })]
        }).compile();

        const cfg = testingModule.get(getConfigToken(DemoConfig));
        expect(cfg).toBeInstanceOf(DemoConfig);
        expect(cfg.value).toBe(42);
    });

    test('should apply async plugins', async () => {
        @Config()
        class DemoConfig { coef = 10; }

        @Config()
        class AsyncConfig { value = 6; }

        class AsyncPlugin implements IAsyncPlugin {
            constructor(private readonly demoConfig: DemoConfig) { }

            async apply(target: any) {
                console.debug(this.demoConfig);
                target.value *= this.demoConfig.coef;
            }
        }

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.registerAsync({
                configs: [DemoConfig, AsyncConfig],
                plugins: [],
                asyncPlugins: [{
                    provide: AsyncPlugin,
                    useFactory: (cfg) => new AsyncPlugin(cfg),
                    inject: [getConfigToken(DemoConfig)]
                }]
            })]
        }).compile();
        await testingModule.init();

        const cfg = testingModule.get(getConfigToken(AsyncConfig));
        expect(cfg).toBeInstanceOf(AsyncConfig);
        expect(cfg.value).toBe(60);
    });
});