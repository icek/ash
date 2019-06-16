import { Node, NodeList } from '../../src';

// eslint-disable-next-line max-len
export default function toBeNodeList<TNode extends Node<TNode>>(received:NodeList<TNode>, ...expected:TNode[]):{ pass:boolean; message:string } {
  let pass = true;
  let index = 0;
  for (let node:Node<TNode> | null = received.head; node; node = node.next, index += 1) {
    if (index >= expected.length) {
      pass = false;
      break;
    }
    if (expected[index] !== node) {
      pass = false;
      break;
    }
  }

  return {
    pass,
    message: `Expected NodeList to ${pass ? '' : 'not'}contain same Nodes as provided`,
  };
}
