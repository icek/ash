import { Node } from 'ash.ts';
import { toBeNodeList } from './toBeNodeList';


expect.extend({ toBeNodeList });

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNodeList<TNode extends Node<TNode>>(...expected:TNode[]):R;
    }
  }
}
