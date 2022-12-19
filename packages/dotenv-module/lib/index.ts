import * as dotenv from 'dotenv';
dotenv.config();

export { DotenvVar, DotenvPrefix } from './decorators';
export { DotenvPlugin } from './plugin';
export * as Transformers from './transformers';