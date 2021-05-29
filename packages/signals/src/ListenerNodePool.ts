import { ListenerNode } from './ListenerNode';

/**
 * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
 * the overhead from object creation and garbage collection.
 */
export class ListenerNodePool<TArgs extends any[]> {
  private tail:ListenerNode<TArgs> | null = null;

  private cacheTail:ListenerNode<TArgs> | null = null;

  public get():ListenerNode<TArgs> {
    if (this.tail) {
      const node:ListenerNode<TArgs> = this.tail;
      this.tail = this.tail.previous;
      node.previous = null;

      return node;
    }

    return new ListenerNode();
  }

  public dispose(node:ListenerNode<TArgs>):void {
    node.listener = null!;
    node.once = false;
    node.next = null;
    node.previous = this.tail;
    this.tail = node;
  }

  public cache(node:ListenerNode<TArgs>):void {
    node.listener = null!;
    node.previous = this.cacheTail;
    this.cacheTail = node;
  }

  public releaseCache():void {
    while (this.cacheTail) {
      const node:ListenerNode<TArgs> = this.cacheTail;
      this.cacheTail = node.previous;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    }
  }
}
