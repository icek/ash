import { Engine, Node, NodeClassType, NodeList, System } from '@ash.ts/core';

/**
 * A useful class for systems which simply iterate over a set of nodes, performing the same action on each node. This
 * class removes the need for a lot of boilerplate code in such systems. Extend this class and implement update method.
 * The node update method will be called once per node on the update cycle with the node instance and the frame time as
 * parameters. e.g.
 *
 * @example
 * ```typescript
 *
 * export class MySystem extends ListIteratingSystem {
 *   constructor() {
 *     super(MyNode);
 *   }
 *
 *   updateNode(node:MyNode, time:number):void {
 *     // process the node here
 *   }
 * }
 * ```
 */

export abstract class ListIteratingSystem<TNode extends Node<TNode>> extends System {
  protected nodeList:NodeList<TNode> | null = null;

  protected nodeClass:NodeClassType<TNode>;

  protected nodeAdded?:(node:TNode) => void;

  protected nodeRemoved?:(node:TNode) => void;

  public constructor(nodeClass:NodeClassType<TNode>) {
    super();

    this.nodeClass = nodeClass;
  }

  public addToEngine(engine:Engine):void {
    this.nodeList = engine.getNodeList<TNode>(this.nodeClass);
    if (this.nodeAdded) {
      for (let node:TNode | null = this.nodeList.head; node; node = node.next) {
        this.nodeAdded(node);
      }
      this.nodeList.nodeAdded.add(this.nodeAdded);
    }
    if (this.nodeRemoved) {
      this.nodeList.nodeRemoved.add(this.nodeRemoved);
    }
  }

  public removeFromEngine():void {
    if (this.nodeAdded) {
      this.nodeList!.nodeAdded.remove(this.nodeAdded);
    }
    if (this.nodeRemoved) {
      this.nodeList!.nodeRemoved.remove(this.nodeRemoved);
    }
    this.nodeList = null;
  }

  public update(time:number):void {
    for (let node:TNode | null = this.nodeList!.head; node; node = node.next) {
      this.updateNode(node, time);
    }
  }

  abstract updateNode(node:TNode, delta:number):void;
}
