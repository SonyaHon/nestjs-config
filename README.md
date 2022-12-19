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
### `FetchPlugin`
A plugin to fetch data from the network
#### Installation
```bash
    npm i --save-dev @sonyahon/nestjs-config-fetch
    yarn add @sonyahon/nestjs-config-fetch
```
#### Usage
Inlcuding plugin:
```typescript
// app.module.ts
@Module({
    imports: [
        ConfigModule.register({
            configs: [...Configs],
            plugins: [...OtherPlugins],
            asyncPlugins: [...OtherAsyncPlugins, FetchPlugin.Provider]
        })
    ],
})
export class AppModule {}
```
`FetchPlugin` adds 1 new decorator:
* `@FetchVar(url: string, parser: (data: Response) => Promise<any>, throwIfErrorFetching: boolean = false)`
  * `url` - url to fetch
  * `parser` - a function used to parse `Response` to get the actual data
  * `throwIfErrorFetching` - by default if some error happens during fetching, it will be logged to stdout via `console.warn`, but no error will be thrown and the default value provided in the config will be used. In case you want to stop startup of Nest application and receive the thrown error, set this to `true`  
  Example:
  ```typescript
  import { FileVar } from '@sonyahon/nestjs-config-fetch';

  @Config()
  class FetchConfig{
    @FetchVar('https://swapi.dev/api/people/1', async (resp) => {
        const json = await resp.json();
        return json.name;
    })
    heroName!: string;
  }
  ```
  `GET https://swapi.dev/api/people/1` will return a JSON, containing `{..., name: "Luke Skywalker"}`, so the `heroName` variable will have this value.  
  **NOTE (1)**: NodeJS `fetch` does not throw if there was a valid response from the request e.g. `400` or `500` status is a valid request, so please be sure to handle this requests in the `parser`.  
  **NOTE (2):** `throwIfErrorFetching` will consume errors thrown in the `parser` too. So if set to `false` and thrown an error in the `parser` the config property will just receive the default value. If set to `true` the error thrown in the `parser` will halt startup of NestJS application.
## Writing custom modules
In order to create a custom module several helper utilities are provided in `@sonyahon/nestjs-config` package. There can be 2 types of plugins: `Sync` and `Async`. Below are two examples for both. Also please take a look into the source code of [Available modules](#available-modules) as an example.
### Sync plugins
Sync plugin is just a class which implements the `IPlugin` interface. For this example lets create a plugin that has an ability to multiply a number config value by passed factor
```typescript
// multiplier-plugin.ts
import { IPlugin, makePropertyDecorator } from '@sonyahon/nestjs-config';

const [MultiplyBy, fetchMultiplyByVars] = makePropertyDecorator((factor: number) => {
    return { factor }
});

class MultiplierPlugin implements IPlugin {
    apply(target: any) {
        const props = fetchMultiplyByVars(target);
        props.forEach(({property, value, params: { factor }}) => {
            target[property] = value * factor;
        });
    }
}

// app.config.ts
@Config()
export class AppConfig {
    @MultiplyBy(2)
    value = 10
}
```
Explanation:  
`makePropertyDecorator` - takes in a function that does 2 things
1. Creates a type definition for the decorator function
2. Provivdes a way to convert passed arguments to `params` property  
   
`makePropertyDecorator` returns a decorator (first element of returned array) and function (second element of returned array) to retrieve all properties of config instanse for this decorator.

The task of `apply(target: any)` function, is to modify passed config instance. In this example we are fetching all propeties marked by `@MultiplyBy` decorator and multiplying the default configuration value by passed factor.
### Async plugins
Async plugins are created the same way as sync plugins. The difference is that they need to implement `IAsyncPlugin` interface instead.
```typescript
// multiplier-plugin.ts
import { IAsyncPlugin, makePropertyDecorator } from '@sonyahon/nestjs-config';

const [MultiplyBy, fetchMultiplyByVars] = makePropertyDecorator((factor: number) => {
    return { factor }
});

class MultiplierPlugin implements IAsyncPlugin {
    async apply(target: any) {
        const props = fetchMultiplyByVars(target);
        props.forEach(({property, value, params: { factor }}) => {
            target[property] = value * factor;
        });
    }
}

// app.config.ts
@Config()
export class AppConfig {
    @MultiplyBy(2)
    value = 10
}
```
This allows one to have an async function for the apply method.  
**NOTE:** Async modules are called during `OnApplicationBoostrap` lifecycle event, so if one tries to get a value controlled by an async plugin before this event, they would get the default value or undefined.

## Async plugins and updates
In some cases values in the configuration can change in runtime. For such cases there is a special provider to update configuration values.
```typescript
// update-watcher.ts
import { RequestUpdateProvider } from '@sonyahon/nestjs-config';
import {SomeNestjsPluginThatRequiresUpdate} from 'plugin';

@Injectable()
export class UpdateWatcherService {
    constructor(
        private readonly requestUpdateProvider: RequestUpdateProvider
    ) {}

    updateHappened() {
        // check if update is needed
    }

    async check() {
        if (this.updateHappened()) {
            await this.requestUpdateProvider.requestUpdateFor(SomeNestjsPluginThatRequiresUpdate);
        }
    }
}
```
This call will re-apply passed plugin, so the value could be updated.