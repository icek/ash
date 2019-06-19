import { Node } from '../../src';
import { toBeNodeList } from './toBeNodeList';

expect.extend({ toBeNodeList });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeNodeList<TNode extends Node<TNode>>(...expected:TNode[]):R;
    }
  }
}
