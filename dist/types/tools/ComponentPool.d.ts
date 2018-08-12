export declare class ComponentPool {
    private static pools;
    private static getPool;
    static get<T>(componentClass: {
        new (): T;
    }): T;
    static dispose<T>(component: T): void;
    static empty(): void;
}
