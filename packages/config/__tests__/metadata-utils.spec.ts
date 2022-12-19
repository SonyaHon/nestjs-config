import { Config } from "../lib/decorators";
import { fetchConfigSymbolMetadata } from "../lib/metadata-utils";

describe('metadata-utils', () => {
    describe('fetch-config-symbol', () => {
        @Config()
        class DemoConfig {}

        class NotDecorated {}

        test('should return when class is passed', () => {
            expect(fetchConfigSymbolMetadata(DemoConfig)).toBe(Symbol.for('@@DemoConfig'));
        });
        
        test('should return when class instance is passed', () => {
            expect(fetchConfigSymbolMetadata(new DemoConfig())).toBe(Symbol.for('@@DemoConfig'));
        });

        test('should return null if something not decorated with @Config is passed', () => {
            expect(fetchConfigSymbolMetadata(null)).toBe(null);
            expect(fetchConfigSymbolMetadata(123)).toBe(null);
            expect(fetchConfigSymbolMetadata(new NotDecorated())).toBe(null);
        });
    });
});