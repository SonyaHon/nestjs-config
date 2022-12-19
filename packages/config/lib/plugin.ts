export interface IPlugin {
    apply<T>(target: T): void;
}