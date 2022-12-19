import { Config, ConfigModule, getConfigToken } from "@sonyahon/nestjs-config";
import { Test } from '@nestjs/testing';

import { DotenvPlugin, DotenvPrefix, DotenvVar } from "../lib";

describe('dotenv module', () => {
    test('without prefix', async () => {
        @Config()
        class DotenvConfig {
            @DotenvVar('PORT', v => parseInt(v))
            port: number = 9090;

            @DotenvVar('HOST')
            host: string = 'localhost';

            @DotenvVar('MISSING')
            missing: boolean = true;
        }

        process.env.PORT = '1234';
        process.env.HOST = 'example.com';

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [DotenvConfig],
                plugins: [new DotenvPlugin()]
            })]
        }).compile();

        const cfg: DotenvConfig = testingModule.get(getConfigToken(DotenvConfig));

        expect(cfg.port).toBe(1234);
        expect(cfg.host).toBe('example.com');
        expect(cfg.missing).toBe(true);
    });

    test('with prefix', async () => {
        @Config()
        @DotenvPrefix('DEMO')
        class DotenvConfig {
            @DotenvVar('PORT2', v => parseInt(v))
            port: number = 9090;

            @DotenvVar('HOST2')
            host: string = 'localhost';

            @DotenvVar('MISSING2')
            missing: boolean = true;
        }

        process.env.DEMO__PORT2 = '1234';
        process.env.DEMO__HOST2 = 'example.com';

        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [DotenvConfig],
                plugins: [new DotenvPlugin()]
            })]
        }).compile();

        const cfg: DotenvConfig = testingModule.get(getConfigToken(DotenvConfig));

        expect(cfg.port).toBe(1234);
        expect(cfg.host).toBe('example.com');
        expect(cfg.missing).toBe(true);
    });
});