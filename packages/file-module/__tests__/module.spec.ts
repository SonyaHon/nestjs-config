import { Config, ConfigModule, getConfigToken } from "@sonyahon/nestjs-config";
import { Test } from '@nestjs/testing';
import { writeFile } from "fs/promises";
import { join } from "path";
import os from 'os';
import { FilesPlugin, FileVar } from "../lib";


describe('dotenv module', () => {
    let tempFilePath = join(os.tmpdir(), 'file-module-test-file.txt');

    @Config()
    class DemoConfig {
        @FileVar('not-existing-file.txt')
        failedFile = 'not-existing';

        @FileVar(tempFilePath)
        secureFileVar!: string;
    }

    let cfg: DemoConfig;

    beforeAll(async () => {
        await writeFile(tempFilePath, 'hello, world');
        const testingModule = await Test.createTestingModule({
            imports: [ConfigModule.register({
                configs: [DemoConfig],
                plugins: [new FilesPlugin()]
            })]
        }).compile();
        cfg = testingModule.get(getConfigToken(DemoConfig));
    });

    test('should work ok with existing file', () => {
        expect(cfg.secureFileVar).toBe('hello, world');
    });

    test('should leave default value if reading of file failed', () => {
        expect(cfg.failedFile).toBe('not-existing');
    });

    test('should throw if a fail property is set to true', async () => {
        @Config()
        class ThrowingConfig {
            @FileVar('not-existing-file', true)
            variable: string = 'asd';
        }
        await expect(async () => {
            await Test.createTestingModule({
                imports: [ConfigModule.register({
                    configs: [ThrowingConfig],
                    plugins: [new FilesPlugin()]
                })]
            }).compile();
        }).rejects.toBeDefined();
    });
});