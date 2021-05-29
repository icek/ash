/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */

import { ListenerNode } from './ListenerNode';
import { ListenerNodePool } from './ListenerNodePool';

/**
 * The base class for all the signal classes.
 */
export class Signal<TArgs extends any[] = []> {
  private head:ListenerNode<TArgs> | null = null;

  private tail:ListenerNode<TArgs> | null = null;

  private nodes:Map<(...args:TArgs) => void, ListenerNode<TArgs>>;

  private listenerNodePool:ListenerNodePool<TArgs>;

  private toAddHead:ListenerNode<TArgs> | null = null;

  private toAddTail:ListenerNode<TArgs> | null = null;

  private dispatching = false;

  private _numListeners = 0;

  public constructor() {
    this.nodes = new Map();
    this.listenerNodePool = new ListenerNodePool();
  }

  public dispatch(...args:TArgs):void {
    this.dispatching = true;

    for (let node = this.head; node; node = node.next) {
      node.listener(...args);
      if (node.once) {
        this.remove(node.listener);
      }
    }

    this.dispatching = false;

    if (this.toAddHead) {
      if (!this.head) {
        this.head = this.toAddHead;
        this.tail = this.toAddTail;
      } else {
        this.tail!.next = this.toAddHead;
        this.toAddHead.previous = this.tail;
        this.tail = this.toAddTail;
      }
      this.toAddHead = null;
      this.toAddTail = null;
    }
    this.listenerNodePool.releaseCache();
  }

  public get numListeners():number {
    return this._numListeners;
  }

  public add(listener:(...args:TArgs) => void):void {
    if (this.nodes.has(listener)) {
      return;
    }

    const node:ListenerNode<TArgs> = this.listenerNodePool.get();
    node.listener = listener;
    this.nodes.set(listener, node);
    this.addNode(node);
  }

  public addOnce(listener:(...args:TArgs) => void):void {
    if (this.nodes.has(listener)) {
      return;
    }

    const node:ListenerNode<TArgs> = this.listenerNodePool.get();
    node.listener = listener;
    node.once = true;
    this.nodes.set(listener, node);
    this.addNode(node);
  }

  private addNode(node:ListenerNode<TArgs>):void {
    if (this.dispatching) {
      if (!this.toAddHead) {
        this.toAddHead = node;
        this.toAddTail = node;
      } else {
        this.toAddTail!.next = node;
        node.previous = this.toAddTail;
        this.toAddTail = node;
      }
    } else if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.previous = this.tail;
      this.tail = node;
    }

    this._numListeners += 1;
  }

  public remove(listener:(...args:TArgs) => void):void {
    const node:ListenerNode<TArgs> | null = this.nodes.get(listener) || null;
    if (node) {
      if (this.head === node) {
        this.head = this.head.next;
      }
      if (this.tail === node) {
        this.tail = this.tail.previous;
      }
      if (this.toAddHead === node) {
        this.toAddHead = this.toAddHead.next;
      }
      if (this.toAddTail === node) {
        this.toAddTail = this.toAddTail.previous;
      }
      if (node.previous) {
        node.previous.next = node.next;
      }
      if (node.next) {
        node.next.previous = node.previous;
      }
      this.nodes.delete(listener);
      if (this.dispatching) {
        this.listenerNodePool.cache(node);
      } else {
        this.listenerNodePool.dispose(node);
      }
      this._numListeners -= 1;
    }
  }

  public removeAll():void {
    while (this.head) {
      const node:ListenerNode<TArgs> = this.head;
      this.head = this.head.next;
      this.nodes.delete(node.listener);
      this.listenerNodePool.dispose(node);
    }
    this.tail = null;
    this.toAddHead = null;
    this.toAddTail = null;
    this._numListeners = 0;
  }
}
