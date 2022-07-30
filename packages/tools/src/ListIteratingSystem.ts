import { Engine, Node, NodeClass, NodeList, System } from '@ash.ts/core';

/**
 * A useful class for systems which simply iterate over a set of nodes, performing the same action on each node. This
 * class removes the need for a lot of boilerplate code in such systems. Extend this class and implement update method.
 * The node update method will be called once per node on the update cycle with the node instance and the frame time as
 * parameters. e.g.
 *
 * @example
 * ```typescript
 * export class MySystem extends ListIteratingSystem<MyNode> {
 *   constructor() {
 *     super(MyNode);
 *   }
 *
 *   updateNode(node:MyNode, time:number):void {
 *     // process the node here
 *   }
 * }
 * ```
 *
 * @typeParam {Node} TNode - Node type to be processed by this System.
 */
export abstract class ListIteratingSystem<TNode extends Node> extends System {
  protected nodeList!:NodeList<TNode>;

  protected nodeClass:NodeClass<TNode>;

  /**
   * When you implement this callback it will be called whenever a new Node is added to the NodeList of this System
   * @type {(node: TNode) => void}
   * @protected
   */
  protected nodeAdded?:(node:TNode) => void;

  /**
   * When you implement this callback it will be called whenever a Node is removed from the NodeList of this System
   * @type {(node: TNode) => void}
   * @protected
   */
  protected nodeRemoved?:(node:TNode) => void;

  protected constructor(nodeClass:NodeClass<TNode>) {
    super();

    this.nodeClass = nodeClass;
  }

  /**
   * @internal
   */
  public addToEngine(engine:Engine):void {
    this.nodeList = engine.getNodeList(this.nodeClass);
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

  /**
   * @internal
   */
  public removeFromEngine():void {
    if (this.nodeAdded) {
      this.nodeList.nodeAdded.remove(this.nodeAdded);
    }
    if (this.nodeRemoved) {
      this.nodeList.nodeRemoved.remove(this.nodeRemoved);
    }
    this.nodeList = null!;
  }

  /**
   * @internal
   */
  public update(time:number):void {
    for (let node:TNode | null = this.nodeList.head; node; node = node.next) {
      this.updateNode(node, time);
    }
  }

  /**
   * @param {TNode} node
   * @param {number} delta
   */
  abstract updateNode(node:TNode, delta:number):void;
}
