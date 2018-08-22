import { ListenerNode } from './ListenerNode';

/**
 * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
 * the overhead from object creation and garbage collection.
 */
export class ListenerNodePool<TListener> {
  private tail:ListenerNode<TListener> | null = null;
  private cacheTail:ListenerNode<TListener> | null = null;

  public get():ListenerNode<TListener> {
    if(this.tail) {
      const node:ListenerNode<TListener> = this.tail;
      this.tail = this.tail.previous;
      node.previous = null;
      return node;
    }

    return new ListenerNode<TListener>();
  }

  public dispose(node:ListenerNode<TListener>):void {
    node.listener = null;
    node.once = false;
    node.next = null;
    node.previous = this.tail;
    this.tail = node;
  }

  public cache(node:ListenerNode<TListener>):void {
    node.listener = null;
    node.previous = this.cacheTail;
    this.cacheTail = node;
  }

  public releaseCache():void {
    while(this.cacheTail) {
      const node:ListenerNode<TListener> = this.cacheTail;
      this.cacheTail = node.previous;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    }
  }
}
