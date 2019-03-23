import { Node, NodeList } from 'ash.ts';

export function toBeNodeList<TNode extends Node<TNode>>(received:NodeList<TNode>, ...expected:TNode[]) {
  let pass = true;
  let index:number = 0;
  for (let node:Node<TNode> | null = received.head; node; node = node.next, ++index) {
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
