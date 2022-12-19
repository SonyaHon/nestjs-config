import { Test } from '@nestjs/testing';
import { Config, ConfigModule, getConfigToken } from "@sonyahon/nestjs-config";
import { FetchPlugin, FetchVar } from "../lib";

describe('fetch module', () => {
    const url = 'https://swapi.dev/api/people/1';
    const failingUrl = 'https://swapi.dev/api/people/not-exising-id';

    test('should fetch correctly', async () => {
        @Config()
        class DemoConfig {
            @FetchVar(url, async (resp) => {
                return (await resp.json()).name;
            })
            heroName!: string;
        }

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.registerAsync(
                configs: [DemoConfig],
                plugins: [],
                asyncPlugins: [FetchPlugin.Provider]
            )]
        }).compile();
        await testingModule.init();
        const cfg: DemoConfig = testingModule.get(getConfigToken(DemoConfig));
        expect(cfg.heroName).toBe("Luke Skywalker");
    });
});