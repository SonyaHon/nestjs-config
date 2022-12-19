import { makePropertyDecorator } from "@sonyahon/nestjs-config";

export const [FileVar, fetchFileVars] = makePropertyDecorator((filePath: string, throwIfErrorReading: boolean = false) => ({ filePath, throwIfErrorReading }));
