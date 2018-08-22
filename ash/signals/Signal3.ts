/*
 * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
 */

import { SignalBase } from './SignalBase';
import { ListenerNode } from './ListenerNode';

/**
 * Provides a fast signal for use where three parameters are dispatched with the signal.
 */
export class Signal3<T1, T2, T3> extends SignalBase<(a:T1, b:T2, c:T3) => void> {
  public dispatch(object1:T1, object2:T2, object3:T3):void {
    this.startDispatch();
    let node:ListenerNode<(a:T1, b:T2, c:T3) => void> | null;
    for(node = this.head; node; node = node.next) {
      node.listener!.call(node, object1, object2, object3);
      if(node.once) {
        this.remove(node.listener!);
      }
    }
    this.endDispatch();
  }
}
