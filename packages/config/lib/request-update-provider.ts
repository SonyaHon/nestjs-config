import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigModule } from './module';

@Injectable()
export class RequestUpdateProvider {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) { }

    async requestUpdateFor(plugin: any) {
        await ConfigModule.updateConfig(
            this.moduleRef,
            plugin
        )
    }
}