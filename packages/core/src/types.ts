import { Node } from './Node';

export interface ClassType<T> {
  new(...args:any[]):T;
}

export interface NodeClassType<TNode extends Node> {
  new():TNode;
}
