export type ClassType<T> = { new( ...args:any[] ):T };
export type ClassMap = { [key:string]:ClassType<any> };
