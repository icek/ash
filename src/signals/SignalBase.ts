/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */

import { ListenerNode } from './ListenerNode';
import { ListenerNodePool } from './ListenerNodePool';

/**
 * The base class for all the signal classes.
 */
export abstract class SignalBase<TListener> {
  protected head:ListenerNode<TListener> | null = null;

  protected tail:ListenerNode<TListener> | null = null;

  private nodes:Map<TListener, ListenerNode<TListener>>;

  private listenerNodePool:ListenerNodePool<TListener>;

  private toAddHead:ListenerNode<TListener> | null = null;

  private toAddTail:ListenerNode<TListener> | null = null;

  private dispatching:boolean = false;

  private pNumListeners:number = 0;

  public constructor() {
    this.nodes = new Map<TListener, ListenerNode<TListener>>();
    this.listenerNodePool = new ListenerNodePool<TListener>();
  }

  protected startDispatch():void {
    this.dispatching = true;
  }

  protected endDispatch():void {
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
    return this.pNumListeners;
  }

  public add(listener:TListener):void {
    if (this.nodes.has(listener)) {
      return;
    }

    const node:ListenerNode<TListener> = this.listenerNodePool.get();
    node.listener = listener;
    this.nodes.set(listener, node);
    this.addNode(node);
  }

  public addOnce(listener:TListener):void {
    if (this.nodes.has(listener)) {
      return;
    }

    const node:ListenerNode<TListener> = this.listenerNodePool.get();
    node.listener = listener;
    node.once = true;
    this.nodes.set(listener, node);
    this.addNode(node);
  }

  protected addNode(node:ListenerNode<TListener>):void {
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

    this.pNumListeners += 1;
  }

  public remove(listener:TListener):void {
    const node:ListenerNode<TListener> | null = this.nodes.get(listener) || null;
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
      this.pNumListeners -= 1;
    }
  }

  public removeAll():void {
    while (this.head) {
      const node:ListenerNode<TListener> = this.head;
      this.head = this.head.next;
      this.nodes.delete(node.listener!);
      this.listenerNodePool.dispose(node);
    }
    this.tail = null;
    this.toAddHead = null;
    this.toAddTail = null;
    this.pNumListeners = 0;
  }
}
