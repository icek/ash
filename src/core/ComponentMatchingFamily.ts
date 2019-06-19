import { ClassType, NodeClassType } from '../types';
import { Engine } from './Engine';
import { Entity } from './Entity';
import { Family } from './Family';
import { Node } from './Node';
import { NodeList } from './NodeList';
import { NodePool } from './NodePool';

const ashProp = '__ash_types__';

/**
 * The default class for managing a NodeList. This class creates the NodeList and adds and removes
 * nodes to/from the list as the entities and the components in the engine change.
 *
 * It uses the basic entity matching pattern of an entity system - entities are added to the list if
 * they contain components matching all the public properties of the node class.
 */
export class ComponentMatchingFamily<TNode extends Node<TNode>> implements Family<TNode> {
  private nodes:NodeList<TNode>;

  private entities:Map<Entity, TNode>;

  private nodeClass:NodeClassType<TNode>;

  public components:Map<ClassType<any>, string>;

  private nodePool:NodePool<TNode>;

  private engine:Engine;

  /**
   * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
   * given node class.
   *
   * @param nodeClass The type of node to create and manage a NodeList for.
   * @param engine The engine that this family is managing teh NodeList for.
   */
  public constructor(nodeClass:NodeClassType<TNode>, engine:Engine) {
    this.nodeClass = nodeClass;
    this.engine = engine;
    this.nodes = new NodeList<TNode>();
    this.entities = new Map<Entity, TNode>();
    this.components = new Map<ClassType<any>, string>();
    this.nodePool = new NodePool<TNode>(this.nodeClass, this.components);

    const dummyNode:TNode = this.nodePool.get();
    this.nodePool.dispose(dummyNode);

    const types:Map<string, ClassType<any>> = (dummyNode.constructor as any)[ashProp];

    for (const [className, classType] of types) {
      this.components.set(classType, className);
    }
  }

  /**
   * The nodelist managed by this family. This is a reference that remains valid always
   * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
   * we always modify it in place.
   */
  public get nodeList():NodeList<TNode> {
    return this.nodes;
  }

  /**
   * Called by the engine when an entity has been added to it. We check if the entity should be in
   * this family's NodeList and add it if appropriate.
   */
  public newEntity(entity:Entity):void {
    this.addIfMatch(entity);
  }

  /**
   * Called by the engine when a component has been added to an entity. We check if the entity is not in
   * this family's NodeList and should be, and add it if appropriate.
   */
  public componentAddedToEntity(entity:Entity, componentClass:ClassType<any>):void {
    this.addIfMatch(entity);
  }

  /**
   * Called by the engine when a component has been removed from an entity. We check if the removed component
   * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
   * remove it if so.
   */
  public componentRemovedFromEntity(entity:Entity, componentClass:ClassType<any>):void {
    if (this.components.has(componentClass)) {
      this.removeIfMatch(entity);
    }
  }

  /**
   * Called by the engine when an entity has been rmoved from it. We check if the entity is in
   * this family's NodeList and remove it if so.
   */
  public removeEntity(entity:Entity):void {
    this.removeIfMatch(entity);
  }

  /**
   * If the entity is not in this family's NodeList, tests the components of the entity to see
   * if it should be in this NodeList and adds it if so.
   */
  private addIfMatch(entity:Entity):void {
    if (!this.entities.has(entity)) {
      for (const componentClass of this.components.keys()) {
        if (!entity.has(componentClass)) {
          return;
        }
      }

      const node:TNode = this.nodePool.get();
      node.entity = entity;

      for (const componentClass of this.components.keys()) {
        const key = this.components.get(componentClass)! as keyof TNode;
        node[key] = entity.get(componentClass);
      }

      this.entities.set(entity, node);
      this.nodes.add(node);
    }
  }

  /**
   * Removes the entity if it is in this family's NodeList.
   */
  private removeIfMatch(entity:Entity):void {
    if (this.entities.has(entity)) {
      const node:TNode = this.entities.get(entity)!;
      this.entities.delete(entity);
      this.nodes.remove(node);
      if (this.engine.updating) {
        this.nodePool.cache(node);
        this.engine.updateComplete.add(this.releaseNodePoolCache);
      } else {
        this.nodePool.dispose(node);
      }
    }
  }

  /**
   * Releases the nodes that were added to the node pool during this engine update, so they can
   * be reused.
   */
  private releaseNodePoolCache = () => {
    this.engine.updateComplete.remove(this.releaseNodePoolCache);
    this.nodePool.releaseCache();
  };

  /**
   * Removes all nodes from the NodeList.
   */
  public cleanUp():void {
    for (let node:Node<TNode> | null = this.nodes.head; node; node = node.next) {
      this.entities.delete(node.entity);
    }
    this.nodes.removeAll();
  }
}

export function keep(type:ClassType<any>):PropertyDecorator {
  return (target:Record<string, any>, propertyKey:string | symbol) => {
    const ctor = target.constructor;
    let map:Map<string | symbol, ClassType<any>>;
    // eslint-disable-next-line no-prototype-builtins
    if (ctor.hasOwnProperty(ashProp)) {
      map = (ctor as any)[ashProp];
    } else {
      map = new Map();
      Object.defineProperty(ctor, ashProp, {
        enumerable: true,
        get: () => map,
      });
    }

    map.set(propertyKey, type);
  };
}
