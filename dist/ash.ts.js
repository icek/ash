(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self), factory((global.ash = {})));
})(this, function(exports) {
  'use strict';

  /**
   * A node in the list of listeners in a signal.
   */
  class ListenerNode {
    constructor() {
      this.previous = null;
      this.next = null;
      this.listener = null;
      this.once = false;
    }
  }

  /**
   * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
   * the overhead from object creation and garbage collection.
   */
  class ListenerNodePool {
    constructor() {
      this.tail = null;
      this.cacheTail = null;
    }
    get() {
      if (this.tail) {
        const node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new ListenerNode();
    }
    dispose(node) {
      node.listener = null;
      node.once = false;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    }
    cache(node) {
      node.listener = null;
      node.previous = this.cacheTail;
      this.cacheTail = node;
    }
    releaseCache() {
      while (this.cacheTail) {
        const node = this.cacheTail;
        this.cacheTail = node.previous;
        node.next = null;
        node.previous = this.tail;
        this.tail = node;
      }
    }
  }

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * The base class for all the signal classes.
   */
  class SignalBase {
    constructor() {
      this.head = null;
      this.tail = null;
      this.toAddHead = null;
      this.toAddTail = null;
      this.dispatching = false;
      this.pNumListeners = 0;
      this.nodes = new Map();
      this.listenerNodePool = new ListenerNodePool();
    }
    startDispatch() {
      this.dispatching = true;
    }
    endDispatch() {
      this.dispatching = false;
      if (this.toAddHead) {
        if (!this.head) {
          this.head = this.toAddHead;
          this.tail = this.toAddTail;
        } else {
          this.tail.next = this.toAddHead;
          this.toAddHead.previous = this.tail;
          this.tail = this.toAddTail;
        }
        this.toAddHead = null;
        this.toAddTail = null;
      }
      this.listenerNodePool.releaseCache();
    }
    get numListeners() {
      return this.pNumListeners;
    }
    add(listener) {
      if (this.nodes.has(listener)) {
        return;
      }
      const node = this.listenerNodePool.get();
      node.listener = listener;
      this.nodes.set(listener, node);
      this.addNode(node);
    }
    addOnce(listener) {
      if (this.nodes.has(listener)) {
        return;
      }
      const node = this.listenerNodePool.get();
      node.listener = listener;
      node.once = true;
      this.nodes.set(listener, node);
      this.addNode(node);
    }
    addNode(node) {
      if (this.dispatching) {
        if (!this.toAddHead) {
          this.toAddHead = this.toAddTail = node;
        } else {
          this.toAddTail.next = node;
          node.previous = this.toAddTail;
          this.toAddTail = node;
        }
      } else {
        if (!this.head) {
          this.head = this.tail = node;
        } else {
          this.tail.next = node;
          node.previous = this.tail;
          this.tail = node;
        }
      }
      this.pNumListeners += 1;
    }
    remove(listener) {
      const node = this.nodes.get(listener) || null;
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
    removeAll() {
      while (this.head) {
        const node = this.head;
        this.head = this.head.next;
        this.nodes.delete(node.listener);
        this.listenerNodePool.dispose(node);
      }
      this.tail = null;
      this.toAddHead = null;
      this.toAddTail = null;
      this.pNumListeners = 0;
    }
  }

  /**
   * Provides a fast signal for use where no parameters are dispatched with the signal.
   */
  class Signal0 extends SignalBase {
    dispatch() {
      this.startDispatch();
      let node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    }
  }

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where one parameter is dispatched with the signal.
   */
  class Signal1 extends SignalBase {
    dispatch(object) {
      this.startDispatch();
      let node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    }
  }

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where two parameters are dispatched with the signal.
   */
  class Signal2 extends SignalBase {
    dispatch(object1, object2) {
      this.startDispatch();
      let node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object1, object2);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    }
  }

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where three parameters are dispatched with the signal.
   */
  class Signal3 extends SignalBase {
    dispatch(object1, object2, object3) {
      this.startDispatch();
      let node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object1, object2, object3);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    }
  }

  /**
   * A collection of nodes.
   *
   * <p>Systems within the engine access the components of entities via NodeLists. A NodeList contains
   * a node for each Entity in the engine that has all the components required by the node. To iterate
   * over a NodeList, start from the head and step to the next on each loop, until the returned value
   * is null.</p>
   *
   * ```typescript
   * for(let node:Node = nodeList.head; node; node = node.next) {
   *   // do stuff
   * }
   * ```
   *
   * <p>It is safe to remove items from a nodelist during the loop. When a Node is removed form the
   * NodeList it's previous and next properties still point to the nodes that were before and after
   * it in the NodeList just before it was removed.</p>
   */
  class NodeList {
    constructor() {
      /**
       * The first item in the node list, or null if the list contains no nodes.
       */
      this.head = null;
      /**
       * The last item in the node list, or null if the list contains no nodes.
       */
      this.tail = null;
      this.nodeAdded = new Signal1();
      this.nodeRemoved = new Signal1();
    }
    add(node) {
      if (!this.head) {
        this.head = this.tail = node;
        node.next = node.previous = null;
      } else {
        this.tail.next = node;
        node.previous = this.tail;
        node.next = null;
        this.tail = node;
      }
      this.nodeAdded.dispatch(node);
    }
    remove(node) {
      if (this.head === node) {
        this.head = this.head.next;
      }
      if (this.tail === node) {
        this.tail = this.tail.previous;
      }
      if (node.previous) {
        node.previous.next = node.next;
      }
      if (node.next) {
        node.next.previous = node.previous;
      }
      this.nodeRemoved.dispatch(node);
      // N.B. Don't set node.next and node.previous to null because that
      // will break the list iteration if node is the current node in the iteration.
    }
    removeAll() {
      while (this.head) {
        const node = this.head;
        this.head = node.next;
        node.previous = null;
        node.next = null;
        this.nodeRemoved.dispatch(node);
      }
      this.tail = null;
    }
    /**
     * true if the list is empty, false otherwise.
     */
    get empty() {
      return this.head == null;
    }
    /**
     * Swaps the positions of two nodes in the list. Useful when sorting a list.
     */
    swap(node1, node2) {
      if (node1.previous === node2) {
        node1.previous = node2.previous;
        node2.previous = node1;
        node2.next = node1.next;
        node1.next = node2;
      } else if (node2.previous === node1) {
        node2.previous = node1.previous;
        node1.previous = node2;
        node1.next = node2.next;
        node2.next = node1;
      } else {
        let temp = node1.previous;
        node1.previous = node2.previous;
        node2.previous = temp;
        temp = node1.next;
        node1.next = node2.next;
        node2.next = temp;
      }
      if (this.head === node1) {
        this.head = node2;
      } else if (this.head === node2) {
        this.head = node1;
      }
      if (this.tail === node1) {
        this.tail = node2;
      } else if (this.tail === node2) {
        this.tail = node1;
      }
      if (node1.previous) {
        node1.previous.next = node1;
      }
      if (node2.previous) {
        node2.previous.next = node2;
      }
      if (node1.next) {
        node1.next.previous = node1;
      }
      if (node2.next) {
        node2.next.previous = node2;
      }
    }
    /**
     * Performs an insertion sort on the node list. In general, insertion sort is very efficient with short lists
     * and with lists that are mostly sorted, but is inefficient with large lists that are randomly ordered.
     *
     * <p>The sort function takes two nodes and returns a Number.</p>
     *
     * ```typescript
     * function sortFunction(node1:MockNode, node2:MockNode):number
     * ```
     *
     * <p>If the returned number is less than zero, the first node should be before the second. If it is greater
     * than zero the second node should be before the first. If it is zero the order of the nodes doesn't matter
     * and the original order will be retained.</p>
     *
     * <p>This insertion sort implementation runs in place so no objects are created during the sort.</p>
     */
    insertionSort(sortFunction) {
      if (!this.head || !this.tail || this.head === this.tail) {
        return;
      }
      let remains = this.head.next;
      for (let node = remains; node; node = remains) {
        let other;
        remains = node.next;
        for (other = node.previous; other; other = other.previous) {
          if (sortFunction(node, other) >= 0) {
            // move node to after other
            if (node !== other.next) {
              // remove from place
              if (this.tail === node) {
                this.tail = node.previous;
              }
              node.previous.next = node.next;
              if (node.next) {
                node.next.previous = node.previous;
              }
              // insert after other
              node.next = other.next;
              node.previous = other;
              node.next.previous = node;
              other.next = node;
            }
            break; // exit the inner for loop
          }
        }
        if (!other) {
          // the node belongs at the start of the list
          // remove from place
          if (this.tail === node) {
            this.tail = node.previous;
          }
          node.previous.next = node.next;
          if (node.next) {
            node.next.previous = node.previous;
          }
          // insert at head
          node.next = this.head;
          this.head.previous = node;
          node.previous = null;
          this.head = node;
        }
      }
    }
    /**
     * Performs a merge sort on the node list. In general, merge sort is more efficient than insertion sort
     * with long lists that are very unsorted.
     *
     * <p>The sort function takes two nodes and returns a Number.</p>
     *
     * ```typescript
     * function sortFunction(node1:MockNode, node2:MockNode):number
     * ```
     *
     * <p>If the returned number is less than zero, the first node should be before the second. If it is greater
     * than zero the second node should be before the first. If it is zero the order of the nodes doesn't matter.</p>
     *
     * <p>This merge sort implementation creates and uses a single array during the sort operation.</p>
     */
    mergeSort(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      const lists = [];
      // disassemble the list
      let start = this.head;
      let end;
      while (start) {
        end = start;
        while (end.next && sortFunction(end, end.next) <= 0) {
          end = end.next;
        }
        const next = end.next;
        start.previous = end.next = null;
        lists[lists.length] = start;
        start = next;
      }
      // reassemble it in order
      while (lists.length > 1) {
        lists.push(this.merge(lists.shift(), lists.shift(), sortFunction));
      }
      // find the tail
      this.tail = this.head = lists[0];
      while (this.tail.next) {
        this.tail = this.tail.next;
      }
    }
    merge(head1, head2, sortFunction) {
      let node;
      let head;
      if (sortFunction(head1, head2) <= 0) {
        head = node = head1;
        head1 = head1.next;
      } else {
        head = node = head2;
        head2 = head2.next;
      }
      while (head1 && head2) {
        if (sortFunction(head1, head2) <= 0) {
          node.next = head1;
          head1.previous = node;
          node = head1;
          head1 = head1.next;
        } else {
          node.next = head2;
          head2.previous = node;
          node = head2;
          head2 = head2.next;
        }
      }
      if (head1) {
        node.next = head1;
        head1.previous = node;
      } else {
        node.next = head2;
        head2.previous = node;
      }
      return head;
    }
  }

  /**
   * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
   * from object creation and garbage collection.
   *
   * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
   * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
   * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
   */
  class NodePool {
    /**
     * Creates a pool for the given node class.
     */
    constructor(nodeClass, components) {
      this.tail = null;
      this.cacheTail = null;
      this.nodeClass = nodeClass;
      this.components = components;
    }
    /**
     * Fetches a node from the pool.
     */
    get() {
      if (this.tail) {
        const node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new this.nodeClass();
    }
    /**
     * Adds a node to the pool.
     */
    dispose(node) {
      for (const val of this.components.values()) {
        node[val] = null;
      }
      node.entity = null;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    }
    /**
     * Adds a node to the cache
     */
    cache(node) {
      node.previous = this.cacheTail;
      this.cacheTail = node;
    }
    /**
     * Releases all nodes from the cache into the pool
     */
    releaseCache() {
      while (this.cacheTail) {
        const node = this.cacheTail;
        this.cacheTail = node.previous;
        this.dispose(node);
      }
    }
  }

  const ashProp = '__ash_types__';
  /**
   * The default class for managing a NodeList. This class creates the NodeList and adds and removes
   * nodes to/from the list as the entities and the components in the engine change.
   *
   * It uses the basic entity matching pattern of an entity system - entities are added to the list if
   * they contain components matching all the public properties of the node class.
   */
  class ComponentMatchingFamily {
    /**
     * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
     * given node class.
     *
     * @param nodeClass The type of node to create and manage a NodeList for.
     * @param engine The engine that this family is managing teh NodeList for.
     */
    constructor(nodeClass, engine) {
      /**
       * Releases the nodes that were added to the node pool during this engine update, so they can
       * be reused.
       */
      this.releaseNodePoolCache = () => {
        this.engine.updateComplete.remove(this.releaseNodePoolCache);
        this.nodePool.releaseCache();
      };
      this.nodeClass = nodeClass;
      this.engine = engine;
      this.nodes = new NodeList();
      this.entities = new Map();
      this.components = new Map();
      this.nodePool = new NodePool(this.nodeClass, this.components);
      const dummyNode = this.nodePool.get();
      this.nodePool.dispose(dummyNode);
      const types = dummyNode.constructor[ashProp];
      for (const [className, classType] of types) {
        this.components.set(classType, className);
      }
    }
    /**
     * The nodelist managed by this family. This is a reference that remains valid always
     * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
     * we always modify it in place.
     */
    get nodeList() {
      return this.nodes;
    }
    /**
     * Called by the engine when an entity has been added to it. We check if the entity should be in
     * this family's NodeList and add it if appropriate.
     */
    newEntity(entity) {
      this.addIfMatch(entity);
    }
    /**
     * Called by the engine when a component has been added to an entity. We check if the entity is not in
     * this family's NodeList and should be, and add it if appropriate.
     */
    componentAddedToEntity(entity, componentClass) {
      this.addIfMatch(entity);
    }
    /**
     * Called by the engine when a component has been removed from an entity. We check if the removed component
     * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
     * remove it if so.
     */
    componentRemovedFromEntity(entity, componentClass) {
      if (this.components.has(componentClass)) {
        this.removeIfMatch(entity);
      }
    }
    /**
     * Called by the engine when an entity has been rmoved from it. We check if the entity is in
     * this family's NodeList and remove it if so.
     */
    removeEntity(entity) {
      this.removeIfMatch(entity);
    }
    /**
     * If the entity is not in this family's NodeList, tests the components of the entity to see
     * if it should be in this NodeList and adds it if so.
     */
    addIfMatch(entity) {
      if (!this.entities.has(entity)) {
        for (const componentClass of this.components.keys()) {
          if (!entity.has(componentClass)) {
            return;
          }
        }
        const node = this.nodePool.get();
        node.entity = entity;
        for (const componentClass of this.components.keys()) {
          const key = this.components.get(componentClass);
          node[key] = entity.get(componentClass);
        }
        this.entities.set(entity, node);
        this.nodes.add(node);
      }
    }
    /**
     * Removes the entity if it is in this family's NodeList.
     */
    removeIfMatch(entity) {
      if (this.entities.has(entity)) {
        const node = this.entities.get(entity);
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
     * Removes all nodes from the NodeList.
     */
    cleanUp() {
      for (let node = this.nodes.head; node; node = node.next) {
        this.entities.delete(node.entity);
      }
      this.nodes.removeAll();
    }
  }
  function keep(type) {
    return (target, propertyKey) => {
      const ctor = target.constructor;
      let map;
      if (ctor.hasOwnProperty(ashProp)) {
        map = ctor[ashProp];
      } else {
        map = new Map();
        Object.defineProperty(ctor, ashProp, {
          enumerable: true,
          get: () => map
        });
      }
      map.set(propertyKey, type);
    };
  }

  /**
   * An internal class for a linked list of entities. Used inside the framework for
   * managing the entities.
   */
  class EntityList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    add(entity) {
      if (!this.head) {
        this.head = this.tail = entity;
        entity.next = entity.previous = null;
      } else {
        this.tail.next = entity;
        entity.previous = this.tail;
        entity.next = null;
        this.tail = entity;
      }
    }
    remove(entity) {
      if (this.head === entity) {
        this.head = this.head.next;
      }
      if (this.tail === entity) {
        this.tail = this.tail.previous;
      }
      if (entity.previous) {
        entity.previous.next = entity.next;
      }
      if (entity.next) {
        entity.next.previous = entity.previous;
      }
      // N.B. Don't set entity.next and entity.previous to null because that
      // will break the list iteration if node is the current node in the iteration.
    }
    removeAll() {
      while (this.head) {
        const entity = this.head;
        this.head = this.head.next;
        entity.previous = null;
        entity.next = null;
      }
      this.tail = null;
    }
  }

  /**
   * Used internally, this is an ordered list of Systems for use by the engine update loop.
   */
  class SystemList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    add(system) {
      if (!this.head) {
        this.head = this.tail = system;
        system.next = system.previous = null;
      } else {
        let node;
        for (node = this.tail; node; node = node.previous) {
          if (node.priority <= system.priority) {
            break;
          }
        }
        if (node === this.tail) {
          this.tail.next = system;
          system.previous = this.tail;
          system.next = null;
          this.tail = system;
        } else if (!node) {
          system.next = this.head;
          system.previous = null;
          this.head.previous = system;
          this.head = system;
        } else {
          system.next = node.next;
          system.previous = node;
          node.next.previous = system;
          node.next = system;
        }
      }
    }
    remove(system) {
      if (this.head === system) {
        this.head = this.head.next;
      }
      if (this.tail === system) {
        this.tail = this.tail.previous;
      }
      if (system.previous) {
        system.previous.next = system.next;
      }
      if (system.next) {
        system.next.previous = system.previous;
      }
      // N.B. Don't set system.next and system.previous to null because
      // that will break the list iteration if node is the current node in the iteration.
    }
    removeAll() {
      while (this.head) {
        const system = this.head;
        this.head = this.head.next;
        system.previous = null;
        system.next = null;
      }
      this.tail = null;
    }
    get(type) {
      for (let system = this.head; system; system = system.next) {
        if (system instanceof type) {
          return system;
        }
      }
      return null;
    }
  }

  /**
   * The Engine class is the central point for creating and managing your game state. Add
   * entities and systems to the engine, and fetch families of nodes from the engine.
   */
  class Engine {
    constructor() {
      /**
       * Indicates if the engine is currently in its update loop.
       */
      this.updating = false;
      /**
       * The class used to manage node lists. In most cases the default class is sufficient
       * but it is exposed here so advanced developers can choose to create and use a
       * different implementation.
       *
       * The class must implement the Family interface.
       */
      this.familyClass = ComponentMatchingFamily;
      this.entityNameChanged = (entity, oldName) => {
        if (this.entityNames.get(oldName) === entity) {
          this.entityNames.delete(oldName);
          this.entityNames.set(entity.name, entity);
        }
      };
      /**
       * @private
       */
      this.componentAdded = (entity, componentClass) => {
        for (const family of this.families.values()) {
          family.componentAddedToEntity(entity, componentClass);
        }
      };
      /**
       * @private
       */
      this.componentRemoved = (entity, componentClass) => {
        for (const family of this.families.values()) {
          family.componentRemovedFromEntity(entity, componentClass);
        }
      };
      this.entityList = new EntityList();
      this.entityNames = new Map();
      this.systemList = new SystemList();
      this.families = new Map();
      this.updateComplete = new Signal0();
    }
    /**
     * Add an entity to the engine.
     *
     * @param entity The entity to add.
     */
    addEntity(entity) {
      if (this.entityNames.has(entity.name)) {
        throw new Error('The entity name ' + entity.name + ' is already in use by another entity.');
      }
      this.entityList.add(entity);
      this.entityNames.set(entity.name, entity);
      entity.componentAdded.add(this.componentAdded);
      entity.componentRemoved.add(this.componentRemoved);
      entity.nameChanged.add(this.entityNameChanged);
      for (const family of this.families.values()) {
        family.newEntity(entity);
      }
    }
    /**
     * Remove an entity from the engine.
     *
     * @param entity The entity to remove.
     */
    removeEntity(entity) {
      entity.componentAdded.remove(this.componentAdded);
      entity.componentRemoved.remove(this.componentRemoved);
      entity.nameChanged.remove(this.entityNameChanged);
      for (const family of this.families.values()) {
        family.removeEntity(entity);
      }
      this.entityNames.delete(entity.name);
      this.entityList.remove(entity);
    }
    /**
     * Get an entity based n its name.
     *
     * @param name The name of the entity
     * @return The entity, or null if no entity with that name exists on the engine
     */
    getEntityByName(name) {
      return this.entityNames.get(name) || null;
    }
    /**
     * Remove all entities from the engine.
     */
    removeAllEntities() {
      while (this.entityList.head) {
        this.removeEntity(this.entityList.head);
      }
    }
    /**
     * Returns an array containing all the entities in the engine.
     */
    get entities() {
      const entities = [];
      for (let entity = this.entityList.head; entity; entity = entity.next) {
        entities[entities.length] = entity;
      }
      return entities;
    }
    /**
     * Get a collection of nodes from the engine, based on the type of the node required.
     *
     * <p>The engine will create the appropriate NodeList if it doesn't already exist and
     * will keep its contents up to date as entities are added to and removed from the
     * engine.</p>
     *
     * <p>If a NodeList is no longer required, release it with the releaseNodeList method.</p>
     *
     * @param nodeClass The type of node required.
     * @return A linked list of all nodes of this type from all entities in the engine.
     */
    getNodeList(nodeClass) {
      if (this.families.has(nodeClass)) {
        return this.families.get(nodeClass).nodeList;
      }
      const family = new this.familyClass(nodeClass, this);
      this.families.set(nodeClass, family);
      for (let entity = this.entityList.head; entity; entity = entity.next) {
        family.newEntity(entity);
      }
      return family.nodeList;
    }
    /**
     * If a NodeList is no longer required, this method will stop the engine updating
     * the list and will release all references to the list within the framework
     * classes, enabling it to be garbage collected.
     *
     * <p>It is not essential to release a list, but releasing it will free
     * up memory and processor resources.</p>
     *
     * @param nodeClass The type of the node class if the list to be released.
     */
    releaseNodeList(nodeClass) {
      if (this.families.has(nodeClass)) {
        this.families.get(nodeClass).cleanUp();
      }
      this.families.delete(nodeClass);
    }
    /**
     * Add a system to the engine, and set its priority for the order in which the
     * systems are updated by the engine update loop.
     *
     * <p>The priority dictates the order in which the systems are updated by the engine update
     * loop. Lower numbers for priority are updated first. i.e. a priority of 1 is
     * updated before a priority of 2.</p>
     *
     * @param system The system to add to the engine.
     * @param priority The priority for updating the systems during the engine loop. A
     * lower number means the system is updated sooner.
     */
    addSystem(system, priority) {
      system.priority = priority;
      system.addToEngine(this);
      this.systemList.add(system);
    }
    /**
     * Get the system instance of a particular type from within the engine.
     *
     * @param type The type of system
     * @return The instance of the system type that is in the engine, or
     * null if no systems of this type are in the engine.
     */
    getSystem(type) {
      return this.systemList.get(type);
    }
    /**
     * Returns an array containing all the systems in the engine.
     */
    get systems() {
      const systems = [];
      for (let system = this.systemList.head; system; system = system.next) {
        systems[systems.length] = system;
      }
      return systems;
    }
    /**
     * Remove a system from the engine.
     *
     * @param system The system to remove from the engine.
     */
    removeSystem(system) {
      this.systemList.remove(system);
      system.removeFromEngine(this);
    }
    /**
     * Remove all systems from the engine.
     */
    removeAllSystems() {
      while (this.systemList.head) {
        const system = this.systemList.head;
        this.systemList.head = this.systemList.head.next;
        system.previous = null;
        system.next = null;
        system.removeFromEngine(this);
      }
      this.systemList.tail = null;
    }
    /**
     * Update the engine. This causes the engine update loop to run, calling update on all the
     * systems in the engine.
     *
     * <p>The package net.richardlord.ash.tick contains classes that can be used to provide
     * a steady or variable tick that calls this update method.</p>
     *
     * @time The duration, in seconds, of this update step.
     */
    update(time) {
      this.updating = true;
      for (let system = this.systemList.head; system; system = system.next) {
        system.update(time);
      }
      this.updating = false;
      this.updateComplete.dispatch();
    }
  }

  /**
   * An entity is composed from components. As such, it is essentially a collection object for components.
   * Sometimes, the entities in a game will mirror the actual characters and objects in the game, but this
   * is not necessary.
   *
   * <p>Components are simple value objects that contain data relevant to the entity. Entities
   * with similar functionality will have instances of the same components. So we might have
   * a position component</p>
   *
   * @example
   * ```typescript
   *
   * class PositionComponent {
   *   public x:number;
   *   public y:number;
   * }
   * ```
   *
   * <p>All entities that have a position in the game world, will have an instance of the
   * position component. Systems operate on entities based on the components they have.</p>
   */
  class Entity {
    /**
     * The constructor
     *
     * @param name The name for the entity. If left blank, a default name is assigned with the form _entityN where N is an integer.
     */
    constructor(name = '') {
      this.previous = null;
      this.next = null;
      this.componentAdded = new Signal2();
      this.componentRemoved = new Signal2();
      this.nameChanged = new Signal2();
      this.components = new Map();
      if (name) {
        this.pName = name;
      } else {
        Entity.nameCount += 1;
        this.pName = '_entity' + Entity.nameCount;
      }
    }
    /**
     * All entities have a name. If no name is set, a default name is used. Names are used to
     * fetch specific entities from the engine, and can also help to identify an entity when debugging.
     */
    get name() {
      return this.pName;
    }
    set name(value) {
      if (this.pName !== value) {
        const previous = this.pName;
        this.pName = value;
        this.nameChanged.dispatch(this, previous);
      }
    }
    /**
     * Add a component to the entity.
     *
     * @param component The component object to add.
     * @param componentClass The class of the component. This is only necessary if the component
     * extends another component class and you want the framework to treat the component as of
     * the base class type. If not set, the class type is determined directly from the component.
     *
     * @return A reference to the entity. This enables the chaining of calls to add, to make
     * creating and configuring entities cleaner. e.g.
     *
     * @example
     * ```typescript
     *
     * const entity:Entity = new Entity()
     *   .add<Position>(new Position(100, 200)
     *   .add<Display>(new Display(new PlayerClip());
     * ```
     */
    add(component, componentClass = null) {
      if (!componentClass) {
        componentClass = component.constructor.prototype.constructor;
      }
      if (!componentClass) {
        throw new Error(`Unable to get type of component: ${component}`);
      }
      if (this.components.has(componentClass)) {
        this.remove(componentClass);
      }
      this.components.set(componentClass, component);
      this.componentAdded.dispatch(this, componentClass);
      return this;
    }
    /**
     * Remove a component from the entity.
     *
     * @param componentClass The class of the component to be removed.
     * @return the component, or null if the component doesn't exist in the entity
     */
    remove(componentClass) {
      const component = this.components.get(componentClass);
      if (component) {
        this.components.delete(componentClass);
        this.componentRemoved.dispatch(this, componentClass);
        return component;
      }
      return null;
    }
    /**
     * Get a component from the entity.
     *
     * @param componentClass The class of the component requested.
     * @return The component, or null if none was found.
     */
    get(componentClass) {
      return this.components.get(componentClass) || null;
    }
    /**
     * Get all components from the entity.
     *
     * @return An array containing all the components that are on the entity.
     */
    getAll() {
      const componentArray = [];
      for (const value of this.components.values()) {
        componentArray.push(value);
      }
      return componentArray;
    }
    /**
     * Does the entity have a component of a particular type.
     *
     * @param componentClass The class of the component sought.
     * @return true if the entity has a component of the type, false if not.
     */
    has(componentClass) {
      return this.components.has(componentClass);
    }
  }
  Entity.nameCount = 0;

  /**
   * The base class for a node.
   *
   * <p>A node is a set of different components that are required by a system.
   * A system can request a collection of nodes from the engine. Subsequently the Engine object creates
   * a node for every entity that has all of the components in the node class and adds these nodes
   * to the list obtained by the system. The engine keeps the list up to date as entities are added
   * to and removed from the engine and as the components on entities change.</p>
   */
  class Node {
    constructor() {
      /**
       * Used by the NodeList class. The previous node in a node list.
       */
      this.previous = null;
      /**
       * Used by the NodeList class. The next node in a node list.
       */
      this.next = null;
    }
  }

  /**
   * The base class for a system.
   *
   * <p>A system is part of the core functionality of the game. After a system is added to the engine, its
   * update method will be called on every frame of the engine. When the system is removed from the engine,
   * the update method is no longer called.</p>
   *
   * <p>The aggregate of all systems in the engine is the functionality of the game, with the update
   * methods of those systems collectively constituting the engine update loop. Systems generally operate on
   * node lists - collections of nodes. Each node contains the components from an entity in the engine
   * that match the node.</p>
   */
  class System {
    constructor() {
      /**
       * Used internally to manage the list of systems within the engine. The previous system in the list.
       */
      this.previous = null;
      /**
       * Used internally to manage the list of systems within the engine. The next system in the list.
       */
      this.next = null;
      /**
       * Used internally to hold the priority of this system within the system list. This is
       * used to order the systems so they are updated in the correct order.
       */
      this.priority = 0;
    }
  }

  /**
   * This component provider always returns the same instance of the component. The instance
   * is passed to the provider at initialisation.
   */
  class ComponentInstanceProvider {
    /**
     * Constructor
     *
     * @param instance The instance to return whenever a component is requested.
     */
    constructor(instance) {
      this.instance = instance;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance
     */
    getComponent() {
      return this.instance;
    }
    /**
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */
    get identifier() {
      return this.instance;
    }
  }

  /**
   * This component provider always returns the same instance of the component. The instance
   * is created when first required and is of the type passed in to the constructor.
   */
  class ComponentSingletonProvider {
    /**
     * Constructor
     *
     * @param type The type of the single instance
     */
    constructor(type) {
      this.componentType = type;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The single instance
     */
    getComponent() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    }
    /**
     * Used to compare this provider with others. Any provider that returns the same single
     * instance will be regarded as equivalent.
     *
     * @return The single instance
     */
    get identifier() {
      return this.getComponent();
    }
  }

  /**
   * This component provider always returns a new instance of a component. An instance
   * is created when requested and is of the type passed in to the constructor.
   */
  class ComponentTypeProvider {
    /**
     * Constructor
     *
     * @param type The type of the instances to be created
     */
    constructor(type) {
      this.componentType = type;
    }
    /**
     * Used to request a component from this provider
     *
     * @return A new instance of the type provided in the constructor
     */
    getComponent() {
      return new this.componentType();
    }
    /**
     * Used to compare this provider with others. Any ComponentTypeProvider that returns
     * the same type will be regarded as equivalent.
     *
     * @return The type of the instances created
     */
    get identifier() {
      return this.componentType;
    }
  }

  /**
   * This component provider calls a function to get the component instance. The function must
   * return a single component of the appropriate type.
   */
  class DynamicComponentProvider {
    /**
     * Constructor
     *
     * @param closure The function that will return the component instance when called.
     */
    constructor(closure) {
      this.closure = closure;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance returned by calling the function
     */
    getComponent() {
      return this.closure();
    }
    /**
     * Used to compare this provider with others. Any provider that uses the function or method
     * closure to provide the instance is regarded as equivalent.
     *
     * @return The function
     */
    get identifier() {
      return this.closure;
    }
  }

  /**
   * Used by the EntityState class to create the mappings of components to providers via a fluent interface.
   */
  class StateComponentMapping {
    /**
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a ComponentTypeProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The EntityState that the mapping will belong to
     * @param type The component type for the mapping
     */
    constructor(creatingState, type) {
      this.creatingState = creatingState;
      this.componentType = type;
      this.withType(type);
    }
    /**
     * Creates a mapping for the component type to a specific component instance. A
     * ComponentInstanceProvider is used for the mapping.
     *
     * @param component The component instance to use for the mapping
     * @return This ComponentMapping, so more modifications can be applied
     */
    withInstance(component) {
      this.setProvider(new ComponentInstanceProvider(component));
      return this;
    }
    /**
     * Creates a mapping for the component type to new instances of the provided type.
     * The type should be the same as or extend the type for this mapping. A ComponentTypeProvider
     * is used for the mapping.
     *
     * @param type The type of components to be created by this mapping
     * @return This ComponentMapping, so more modifications can be applied
     */
    withType(type) {
      this.setProvider(new ComponentTypeProvider(type));
      return this;
    }
    /**
     * Creates a mapping for the component type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A ComponentSingletonProvider is used for
     * the mapping.
     *
     * @param type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This ComponentMapping, so more modifications can be applied
     */
    withSingleton(type) {
      if (!type) {
        type = this.componentType;
      }
      this.setProvider(new ComponentSingletonProvider(type));
      return this;
    }
    /**
     * Creates a mapping for the component type to a method call. A
     * DynamicComponentProvider is used for the mapping.
     *
     * @param method The method to return the component instance
     * @return This ComponentMapping, so more modifications can be applied
     */
    withMethod(method) {
      this.setProvider(new DynamicComponentProvider(method));
      return this;
    }
    /**
     * Creates a mapping for the component type to any ComponentProvider.
     *
     * @param provider The component provider to use.
     * @return This ComponentMapping, so more modifications can be applied.
     */
    withProvider(provider) {
      this.setProvider(provider);
      return this;
    }
    /**
     * Maps through to the add method of the EntityState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param type The type of component to add a mapping to the state for
     * @return The new ComponentMapping for that type
     */
    add(type) {
      return this.creatingState.add(type);
    }
    setProvider(provider) {
      this.provider = provider;
      this.creatingState.providers.set(this.componentType, provider);
    }
  }

  /**
   * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
   * are used to add components to the entity when this state is entered.
   */
  class EntityState {
    constructor() {
      /**
       * @private
       */
      this.providers = new Map();
    }
    /**
     * Add a new ComponentMapping to this state. The mapping is a utility class that is used to
     * map a component type to the provider that provides the component.
     *
     * @param type The type of component to be mapped
     * @return The component mapping to use when setting the provider for the component
     */
    add(type) {
      return new StateComponentMapping(this, type);
    }
    /**
     * Get the ComponentProvider for a particular component type.
     *
     * @param type The type of component to get the provider for
     * @return The ComponentProvider
     */
    get(type) {
      return this.providers.get(type) || null;
    }
    /**
     * To determine whether this state has a provider for a specific component type.
     *
     * @param type The type of component to look for a provider for
     * @return true if there is a provider for the given type, false otherwise
     */
    has(type) {
      return this.providers.has(type);
    }
  }

  /**
   * This is a state machine for an entity. The state machine manages a set of states,
   * each of which has a set of component providers. When the state machine changes the state, it removes
   * components associated with the previous state and adds components associated with the new state.
   */
  class EntityStateMachine {
    /**
     * Constructor. Creates an EntityStateMachine.
     */
    constructor(entity) {
      this.entity = entity;
      this.states = new Map();
    }
    /**
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */
    addState(name, state) {
      this.states.set(name, state);
      return this;
    }
    /**
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */
    createState(name) {
      const state = new EntityState();
      this.states.set(name, state);
      return state;
    }
    /**
     * Change to a new state. The components from the old state will be removed and the components
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */
    changeState(name) {
      const newState = this.states.get(name);
      if (!newState) {
        throw new Error(`Entity state ${name} doesn't exist`);
      }
      if (newState === this.currentState) {
        return;
      }
      let toAdd;
      if (this.currentState) {
        toAdd = new Map();
        for (const type of newState.providers.keys()) {
          toAdd.set(type, newState.providers.get(type));
        }
        for (const type of this.currentState.providers.keys()) {
          const other = toAdd.get(type) || null;
          if (other && other.identifier === this.currentState.providers.get(type).identifier) {
            toAdd.delete(type);
          } else {
            this.entity.remove(type);
          }
        }
      } else {
        toAdd = newState.providers;
      }
      for (const type of toAdd.keys()) {
        this.entity.add(toAdd.get(type).getComponent(), type);
      }
      this.currentState = newState;
    }
    getStateNames() {
      return Object.keys(this.states);
    }
  }

  /**
   * This System provider returns results of a method call. The method
   * is passed to the provider at initialisation.
   */
  class DynamicSystemProvider {
    /**
     * Constructor
     *
     * @param method The method that returns the System instance;
     */
    constructor(method) {
      this.systemPriority = 0;
      this.method = method;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance of the System
     */
    getSystem() {
      return this.method();
    }
    /**
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The method used to call the System instances
     */
    get identifier() {
      return this.method;
    }
    /**
     * The priority at which the System should be added to the Engine
     */
    get priority() {
      return this.systemPriority;
    }
    set priority(value) {
      this.systemPriority = value;
    }
  }

  class StateSystemMapping {
    /**
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a SystemSingletonProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The SystemState that the mapping will belong to
     * @param provider The System type for the mapping
     */
    constructor(creatingState, provider) {
      this.creatingState = creatingState;
      this.provider = provider;
    }
    /**
     * Applies the priority to the provider that the System will be.
     *
     * @param priority The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    withPriority(priority) {
      this.provider.priority = priority;
      return this;
    }
    /**
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */
    addInstance(system) {
      return this.creatingState.addInstance(system);
    }
    /**
     * Creates a mapping for the System type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A SystemSingletonProvider is used for
     * the mapping.
     *
     * @param type The type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This StateSystemMapping, so more modifications can be applied
     */
    addSingleton(type) {
      return this.creatingState.addSingleton(type);
    }
    /**
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    addMethod(method) {
      return this.creatingState.addMethod(method);
    }
    /**
     * Maps through to the addProvider method of the SystemState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    addProvider(provider) {
      return this.creatingState.addProvider(provider);
    }
  }

  /**
   * This System provider always returns the same instance of the component. The system
   * is passed to the provider at initialisation.
   */
  class SystemInstanceProvider {
    /**
     * Constructor
     *
     * @param instance The instance to return whenever a System is requested.
     */
    constructor(instance) {
      this.systemPriority = 0;
      this.instance = instance;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance of the System
     */
    getSystem() {
      return this.instance;
    }
    /**
     * Used to compare this provider with others. Any provider that returns the same component
     * instance will be regarded as equivalent.
     *
     * @return The instance
     */
    get identifier() {
      return this.instance;
    }
    /**
     * The priority at which the System should be added to the Engine
     */
    get priority() {
      return this.systemPriority;
    }
    /**
     * @private
     */
    set priority(value) {
      this.systemPriority = value;
    }
  }

  /**
   * This System provider always returns the same instance of the System. The instance
   * is created when first required and is of the type passed in to the constructor.
   */
  class SystemSingletonProvider {
    /**
     * Constructor
     *
     * @param type The type of the single System instance
     */
    constructor(type) {
      this.systemPriority = 0;
      this.componentType = type;
    }
    /**
     * Used to request a System from this provider
     *
     * @return The single instance
     */
    getSystem() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    }
    /**
     * Used to compare this provider with others. Any provider that returns the same single
     * instance will be regarded as equivalent.
     *
     * @return The single instance
     */
    get identifier() {
      return this.getSystem();
    }
    /**
     * The priority at which the System should be added to the Engine
     */
    get priority() {
      return this.systemPriority;
    }
    /**
     * @private
     */
    set priority(value) {
      this.systemPriority = value;
    }
  }

  /**
   * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
   * are used to add Systems to the Engine when this state is entered.
   */
  class EngineState {
    constructor() {
      this.providers = [];
    }
    /**
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */
    addInstance(system) {
      return this.addProvider(new SystemInstanceProvider(system));
    }
    /**
     * Creates a mapping for the System type to a single instance of the provided type.
     * The instance is not created until it is first requested. The type should be the same
     * as or extend the type for this mapping. A SystemSingletonProvider is used for
     * the mapping.
     *
     * @param type The type of the single instance to be created. If omitted, the type of the
     * mapping is used.
     * @return This StateSystemMapping, so more modifications can be applied
     */
    addSingleton(type) {
      return this.addProvider(new SystemSingletonProvider(type));
    }
    /**
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    addMethod(method) {
      return this.addProvider(new DynamicSystemProvider(method));
    }
    /**
     * Adds any SystemProvider.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    addProvider(provider) {
      const mapping = new StateSystemMapping(this, provider);
      this.providers[this.providers.length] = provider;
      return mapping;
    }
  }

  /**
   * This is a state machine for the Engine. The state machine manages a set of states,
   * each of which has a set of System providers. When the state machine changes the state, it removes
   * Systems associated with the previous state and adds Systems associated with the new state.
   */
  class EngineStateMachine {
    /**
     * Constructor. Creates an SystemStateMachine.
     */
    constructor(engine) {
      this.engine = engine;
      this.states = new Map();
    }
    /**
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */
    addState(name, state) {
      this.states.set(name, state);
      return this;
    }
    /**
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */
    createState(name) {
      const state = new EngineState();
      this.states.set(name, state);
      return state;
    }
    /**
     * Change to a new state. The Systems from the old state will be removed and the Systems
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */
    changeState(name) {
      const newState = this.states.get(name);
      if (!newState) {
        throw new Error(`Engine state ${name} doesn't exist`);
      }
      if (newState === this.currentState) {
        return;
      }
      const toAdd = [];
      let id;
      for (const provider of newState.providers) {
        id = provider.identifier;
        toAdd[id] = provider;
      }
      if (this.currentState) {
        for (const provider of this.currentState.providers) {
          id = provider.identifier;
          const other = toAdd[id];
          if (other) {
            delete toAdd[id];
          } else {
            this.engine.removeSystem(provider.getSystem());
          }
        }
      }
      for (const provider of toAdd) {
        this.engine.addSystem(provider.getSystem(), provider.priority);
      }
      this.currentState = newState;
    }
    getStateNames() {
      return Object.keys(this.states);
    }
  }

  class RAFTickProvider extends Signal1 {
    constructor() {
      super(...arguments);
      this.rafId = 0;
      this.previousTime = 0;
      this.update = () => {
        this.rafId = window.requestAnimationFrame(this.update);
        const time = Date.now();
        const second = 1000;
        this.dispatch((time - this.previousTime) / second);
        this.previousTime = time;
      };
    }
    start() {
      this.previousTime = Date.now();
      this.rafId = window.requestAnimationFrame(this.update);
    }
    stop() {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    get playing() {
      return !!this.rafId;
    }
  }

  class IntervalTickProvider extends Signal1 {
    constructor(interval) {
      super();
      this.intervalId = 0;
      this.previousTime = 0;
      this.pInterval = 33;
      this.update = () => {
        const time = Date.now();
        const second = 1000;
        this.dispatch((time - this.previousTime) / second);
        this.previousTime = time;
      };
      if (interval) {
        this.pInterval = interval;
      }
    }
    start() {
      this.previousTime = Date.now();
      this.intervalId = window.setInterval(this.update, this.pInterval);
    }
    stop() {
      window.clearInterval(this.intervalId);
      this.intervalId = 0;
    }
    set interval(interval) {
      this.pInterval = interval;
      if (this.intervalId !== 0) {
        window.clearInterval(this.intervalId);
        this.intervalId = window.setInterval(this.update, interval);
      }
    }
    get inteval() {
      return this.pInterval;
    }
    get playing() {
      return !!this.intervalId;
    }
  }

  class ComponentPool {
    static getPool(componentClass) {
      if (ComponentPool.pools.has(componentClass)) {
        return ComponentPool.pools.get(componentClass);
      }
      const ret = [];
      ComponentPool.pools.set(componentClass, ret);
      return ret;
    }
    /**
     * Get an object from the pool.
     *
     * @param componentClass The type of component wanted.
     * @return The component.
     */
    static get(componentClass) {
      const pool = ComponentPool.getPool(componentClass);
      if (pool.length > 0) {
        return pool.pop();
      }
      return new componentClass();
    }
    /**
     * Return an object to the pool for reuse.
     *
     * @param component The component to return to the pool.
     */
    static dispose(component) {
      if (component) {
        const type = component.constructor.prototype.constructor;
        const pool = ComponentPool.getPool(type);
        pool[pool.length] = component;
      }
    }
    /**
     * Dispose of all pooled resources, freeing them for garbage collection.
     */
    static empty() {
      ComponentPool.pools = new Map();
    }
  }
  ComponentPool.pools = new Map();

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
  class ListIteratingSystem extends System {
    constructor(nodeClass) {
      super();
      this.nodeList = null;
      this.nodeClass = nodeClass;
    }
    addToEngine(engine) {
      this.nodeList = engine.getNodeList(this.nodeClass);
      if (this.nodeAdded) {
        for (let node = this.nodeList.head; node; node = node.next) {
          this.nodeAdded(node);
        }
        this.nodeList.nodeAdded.add(this.nodeAdded);
      }
      if (this.nodeRemoved) {
        this.nodeList.nodeRemoved.add(this.nodeRemoved);
      }
    }
    removeFromEngine(engine) {
      if (this.nodeAdded) {
        this.nodeList.nodeAdded.remove(this.nodeAdded);
      }
      if (this.nodeRemoved) {
        this.nodeList.nodeRemoved.remove(this.nodeRemoved);
      }
      this.nodeList = null;
    }
    update(time) {
      for (let node = this.nodeList.head; node; node = node.next) {
        this.updateNode(node, time);
      }
    }
  }

  exports.ComponentMatchingFamily = ComponentMatchingFamily;
  exports.ComponentPool = ComponentPool;
  exports.Engine = Engine;
  exports.EngineStateMachine = EngineStateMachine;
  exports.Entity = Entity;
  exports.EntityStateMachine = EntityStateMachine;
  exports.IntervalTickProvider = IntervalTickProvider;
  exports.ListIteratingSystem = ListIteratingSystem;
  exports.Node = Node;
  exports.NodeList = NodeList;
  exports.NodePool = NodePool;
  exports.RAFTickProvider = RAFTickProvider;
  exports.Signal0 = Signal0;
  exports.Signal1 = Signal1;
  exports.Signal2 = Signal2;
  exports.Signal3 = Signal3;
  exports.System = System;
  exports.keep = keep;

  Object.defineProperty(exports, '__esModule', { value: true });
});
