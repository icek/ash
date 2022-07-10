import { Node } from './Node';

/**
 * Interface representing a Class
 * @typeParam T type of object created by a Class
 */
export interface Class<T> {
  new(...args:any[]):T;
}

/**
 * Interface representing a NodeClass
 * @typeParam TNode type of node
 */
export interface NodeClass<TNode extends Node> {
  new():TNode;

  /**
   * Record holding mapping of property names to component classes.
   */
  propTypes:Record<string, Class<any>>;
}
