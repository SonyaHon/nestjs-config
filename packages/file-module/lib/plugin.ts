import { IPlugin } from "@sonyahon/nestjs-config";
import { readFileSync } from "fs";
import { fetchFileVars } from "./decorators";

export class FilesPlugin implements IPlugin {
    apply<T>(target: any): void {
        const fileVars = fetchFileVars(target);
        fileVars.forEach(({ property, params: { filePath, throwIfErrorReading } }) => {
            if (throwIfErrorReading) {
                const fileContents = readFileSync(filePath, 'utf-8');
                target[property] = fileContents;
                return;
            }
            try {
                const fileContents = readFileSync(filePath, 'utf-8');
                target[property] = fileContents;
            } catch (err) {
                console.warn(`Error reading file <${filePath}>:\n${err}.`);
            }
        });
    }
}