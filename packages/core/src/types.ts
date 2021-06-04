import { Node } from './Node';

export interface Class<T> {
  new(...args:any[]):T;
}

export interface NodeClass<TNode extends Node> {
  new():TNode;

  propTypes:Record<string, Class<any>>;
}

export type NodeClassWithProps<TProps extends Record<string, Class<any>>> =
  NodeClass<Node & { [K in keyof TProps]:InstanceType<TProps[K]> }>;
