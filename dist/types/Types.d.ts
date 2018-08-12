export declare type ClassType<T> = {
    new (...args: any[]): T;
};
export declare type ClassMap = {
    [key: string]: ClassType<any>;
};
export declare type NativeType = string | number | boolean;
