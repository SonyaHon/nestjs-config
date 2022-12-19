# @sonyahon/nestjs-config
A [NestJS](https://github.com/nestjs/nest) module to manage runtime configuration

## Installation
Install the core package
```bash
    npm install --save-dev @sonyahon/nestjs-config
    yarn add @sonyahon/nestjs-config
```

Install required additional modules
```bash
    npm install --save-dev @sonyahon/nestjs-config-dotenv
    yarn add @sonyahon/nestjs-config-dotenv
```
The list of available official modules can be found [here](#available-modules)

## Usage
General usage:
```typescript
// app.config.ts
import { Config } from '@sonyahon/nestjs-config';
@Config()
export class AppConfig {
    public appPort: number = 9090;
    public appHost: string = '0.0.0.0';
}

// app.module.ts
import { ConfigModule } from '@sonyahon/nestjs-config';

@Module({
    imports: [
        ConfigModule.register({
            configs: [AppConfig],
            plugins: []
        }),
        // rest of your imports
    ],
    // rest of your configuration for the main app module
})
export class AppModule {}

// some-provider.service.ts
@Injectable() 
export class SomeProvider {
    constructor(
        @InjectConfig(AppConfig)
        private readonly appConfig: AppConfig
    ) {}

    getAppUrl() {
        return `http://${this.appConfig.appHost}:${this.appConfig.appPort}`; // http://0.0.0.0:9090
    }
}
```
The core as is does not provide much features. All of them are provided via plugins.
Please see documentation for a concrete module [here](#available-modules). Here is an example for [dotenv-module](#dotenv)
```typescript
// app.config.ts
@Config()
@DotenvPrefix('APP')
export class AppConfig {
    @DotenvVar('PORT', Transform.Number)
    appPort: number = 9090;

    @DotenvVar('HOST')
    appHost: string = '0.0.0.0';
}

// .env
APP__PORT=6969
APP__HOST=127.0.0.1

// app.module.ts
@Module({
    imports: [
        ConfigModule.register({
            configs: [AppConfig],
            plugins: [new DotenvPlugin()]
        }),
        // rest of your imports
    ],
    // rest of your configuration for the main app module
})
export class AppModule {}
```

## Available modules
### `DotenvPlugin`
A plugin to fetch enviroment variables
#### Installation
```bash
    npm i --save-dev @sonyahon/nestjs-config-dotenv
    yarn add @sonyahon/nestjs-config-dotenv
```
#### Usage
Inlcuding plugin:
```typescript
// app.module.ts
@Module({
    imports: [
        ConfigModule.register({
            configs: [...Configs],
            plugins: [...OtherPlugins, new DotenvPlugin()]
        })
    ],
})
export class AppModule {}
```
Dotenv plugin adds 2 decorators for the you to use:
* `@DotenvVar(name: string, transofmer?: (value: string) => any)`
  * `name` - environemt variable name e.g. `HOST` or `PORT`
  * `trasnformer` - optional transformer function, to turn env string into something else, see [included transformers](#inlcuded-transformers)  
  Example:
  ```typescript
  import { DotenvVar } from '@sonyahon/nestjs-config-dotenv';

  @Config()
  class EnvConfig{
    @DotenvVar('HOST')
    appHost: string = 'localhost';

    @DotenvVar('PORT', v => parseInt(v))
    appPort: number = 9090;
  }
  ```
  As a result of this plugin transformation, props decorated with `DotenvVar` will get the value of `process.env.[name]`.
* `@DotenvPrefx(name: string)`
  * `name` - prefix name to use  
  In some cases we want to use prefixes like `APP__[NAME]` for out env variables.
  Example:
  ```typescript
  import { DotenvVar, DotenvPrefix } from '@sonyahon/nestjs-config-dotenv';

  @Config()
  @DotenvPrefix('ENV')
  class EnvConfig{
    @DotenvVar('PROP')
    prop: string = 'value';
  }
  ```
  In the example above `prop` property will get the value of `process.env.ENV__PROP` enviroment variable
#### Inlcuded transformers
There is a handfull of ready to use transformers already available:
* `Transformers.IntoInteger` - string -> int conversion e.g. `'123' -> 123`  
* `Transformers.IntoNumber` - string -> float conversion e.g. `'10.2' -> 10.2`
* `Transformers.IntoBoolean` - string -> boolean conversion `'true' -> true` `'false' -> false`
* `Transformers.IntoCommaSeperatedStringList(innerTransformer?: (v: string) => any))`
a transformer generator functions that splits passed string by comma, to get an array of data and applies `innerTransformer` to each of them if needed e.g. `Transformers.CommaSeperatedStringList(Transformers.IntoInteger)` will produce `'123,234,456' -> [123, 234, 456]`
### `FilesPlugin`
A plugin to fetch files as config prop values
#### Installation
```bash
    npm i --save-dev @sonyahon/nestjs-config-files
    yarn add @sonyahon/nestjs-config-files
```
#### Usage
Inlcuding plugin:
```typescript
// app.module.ts
@Module({
    imports: [
        ConfigModule.register({
            configs: [...Configs],
            plugins: [...OtherPlugins, new FilesPlugin()]
        })
    ],
})
export class AppModule {}
```
`FilesPlugin` adds 1 new decorator:
* `@FileVar(filePath: string, throwIfErrorReading: boolean = false)`
  * `filePath` - file path to read file from
  * `throwIfErrorReading` - by default if some error happens during reading of a file, it will be logged to stdout via `console.warn`, but no error will be thrown and the default value provided in the config will be used. In case you want to stop startup of Nest application and receive the thrown error, set this to `true`  
  Example:
  ```typescript
  import { FileVar } from '@sonyahon/nestjs-config-files';

  @Config()
  class EnvConfig{
    @FileVar('app/resources/certificate.crt')
    cert: string = 'demo-certificate-text-here'; 

    @FileVar('app/resources/another-file.txt', true)
    anotherFile: string; 
  }
  ```
  In the exampel above, `cert` will have the contents of the `app/resources/certificate.crt` file the `'demo-certificate-text-here'` if the file was not found. `anotherFile` will have the `app/resources/another-file.txt` file contents and will throw if this file is not presented.
