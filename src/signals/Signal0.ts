/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */
import { ListenerNode } from './ListenerNode';
import { SignalBase } from './SignalBase';

/**
 * Provides a fast signal for use where no parameters are dispatched with the signal.
 */
export class Signal0 extends SignalBase<() => void> {
  public dispatch():void {
    this.startDispatch();
    let node:ListenerNode<() => void> | null;
    for(node = this.head; node; node = node.next) {
      node.listener!.call(node);
      if(node.once) {
        this.remove(node.listener!);
      }
    }
    this.endDispatch();
  }
}
