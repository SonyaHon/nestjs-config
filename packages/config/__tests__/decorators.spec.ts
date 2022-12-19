import { Config } from "../lib/decorators";
import { CONFIG_SYMBOL } from "../lib/metadata-keys";

describe('decorators', () => {
    describe('config', () => {
        @Config()
        class DemoConfig {}

        test('should define correct metadata', () => {
            expect(Reflect.getMetadata(CONFIG_SYMBOL, DemoConfig)).toBe(Symbol.for('@@DemoConfig'));
        });
    });
});