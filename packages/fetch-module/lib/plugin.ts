import { IAsyncPlugin } from "@sonyahon/nestjs-config";
import { fetchFetchVars } from "./decorators";


export class FetchPlugin implements IAsyncPlugin {
    static Provider = {
        provide: FetchPlugin,
        useFactory: () => new FetchPlugin(),
        inject: [],
    }
    
    async apply<T>(target: any): Promise<void> {
        const fetchVars = fetchFetchVars(target);
        for (const { property, params: { url, parser, throwIfErrorFetching } } of fetchVars) {
            if (throwIfErrorFetching) {
                const response = await fetch(url);
                const fetchedValue = await parser(response);
                target[property] = fetchedValue;
            }
            try {
                const response = await fetch(url);
                const fetchedValue = await parser(response);
                target[property] = fetchedValue;
            }
            catch (err) {
                console.warn(`Error while fetching ${url}:\n${err}`);
            }
        }
    }
}