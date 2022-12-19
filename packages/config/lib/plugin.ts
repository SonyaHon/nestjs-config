export interface IPlugin {
    apply<T>(target: T): void;
}

export interface IAsyncPlugin {
    apply<T>(target: T): Promise<void>;
}

export type UseAsyncPlugin = {
    provide: new (...args: any) => any,
    useFactory: (...args: any) => any,
    inject: any[],
}