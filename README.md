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
### `Dotenv`