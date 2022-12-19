import { Test } from '@nestjs/testing';
import { Config, ConfigModule, getConfigToken, IPlugin } from '../lib';

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
});