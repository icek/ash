export type ClassType<T> = { new(...args:any[]):T };
export type NodeClassType<TNode> = { new():TNode };
export type NativeType = string | number | boolean;
