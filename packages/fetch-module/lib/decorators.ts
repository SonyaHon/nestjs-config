import { makePropertyDecorator } from "@sonyahon/nestjs-config";

export const [FetchVar, fetchFetchVars] = makePropertyDecorator((url: string, parser: (data: Response) => Promise<any>, throwIfErrorFetching: boolean = false) => ({ url, parser, throwIfErrorFetching }));
