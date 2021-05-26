import { Node } from './Node';

export interface ClassType<T> {
  new(...args:any[]):T;
}

export interface NodeClassType<TNode extends Node> {
  new():TNode;
}

export type NodeClassWithProps<TProps extends Record<string, ClassType<any>>> =
  NodeClassType<Node & { [K in keyof TProps]:InstanceType<TProps[K]> }>;
