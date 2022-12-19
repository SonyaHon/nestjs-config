import { Config } from "../lib";
import { fetchConfigSymbolMetadata } from "../lib/metadata-utils";
import { getConfigToken } from "../lib/nestjs-getters";

describe('nestjs-getters', () => {
    describe('class tokens', () => {
        test('should return correct config token', () => {
            @Config()
            class DemoConfig { }

            expect(getConfigToken(DemoConfig)).toBe(fetchConfigSymbolMetadata(DemoConfig));
        });

        test('should throw if passed not a configuration', () => {
            expect(() => getConfigToken(123)).toThrow();
        });
    });
});