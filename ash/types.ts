export type ClassType<T> = { new( ...args:any[] ):T };
export type ClassMap = { [key:string]:ClassType<any> };
export type NodeClassType<TNode> = { new():TNode };
export type NativeType = string | number | boolean;
