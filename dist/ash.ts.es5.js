(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self), factory((global.ash = {})));
})(this, function(exports) {
  'use strict';

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };

  function __extends(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  function __values(o) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator],
      i = 0;
    if (m) return m.call(o);
    return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  }

  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }

  /**
   * A node in the list of listeners in a signal.
   */
  var ListenerNode = /** @class */ (function() {
    function ListenerNode() {
      this.previous = null;
      this.next = null;
      this.listener = null;
      this.once = false;
    }
    return ListenerNode;
  })();

  /**
   * This internal class maintains a pool of deleted listener nodes for reuse by framework. This reduces
   * the overhead from object creation and garbage collection.
   */
  var ListenerNodePool = /** @class */ (function() {
    function ListenerNodePool() {
      this.tail = null;
      this.cacheTail = null;
    }
    ListenerNodePool.prototype.get = function() {
      if (this.tail) {
        var node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new ListenerNode();
    };
    ListenerNodePool.prototype.dispose = function(node) {
      node.listener = null;
      node.once = false;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    };
    ListenerNodePool.prototype.cache = function(node) {
      node.listener = null;
      node.previous = this.cacheTail;
      this.cacheTail = node;
    };
    ListenerNodePool.prototype.releaseCache = function() {
      while (this.cacheTail) {
        var node = this.cacheTail;
        this.cacheTail = node.previous;
        node.next = null;
        node.previous = this.tail;
        this.tail = node;
      }
    };
    return ListenerNodePool;
  })();

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * The base class for all the signal classes.
   */
  var SignalBase = /** @class */ (function() {
    function SignalBase() {
      this.head = null;
      this.tail = null;
      this.toAddHead = null;
      this.toAddTail = null;
      this.dispatching = false;
      this.pNumListeners = 0;
      this.nodes = new Map();
      this.listenerNodePool = new ListenerNodePool();
    }
    SignalBase.prototype.startDispatch = function() {
      this.dispatching = true;
    };
    SignalBase.prototype.endDispatch = function() {
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
    };
    Object.defineProperty(SignalBase.prototype, 'numListeners', {
      get: function() {
        return this.pNumListeners;
      },
      enumerable: true,
      configurable: true
    });
    SignalBase.prototype.add = function(listener) {
      if (this.nodes.has(listener)) {
        return;
      }
      var node = this.listenerNodePool.get();
      node.listener = listener;
      this.nodes.set(listener, node);
      this.addNode(node);
    };
    SignalBase.prototype.addOnce = function(listener) {
      if (this.nodes.has(listener)) {
        return;
      }
      var node = this.listenerNodePool.get();
      node.listener = listener;
      node.once = true;
      this.nodes.set(listener, node);
      this.addNode(node);
    };
    SignalBase.prototype.addNode = function(node) {
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
    };
    SignalBase.prototype.remove = function(listener) {
      var node = this.nodes.get(listener) || null;
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
    };
    SignalBase.prototype.removeAll = function() {
      while (this.head) {
        var node = this.head;
        this.head = this.head.next;
        this.nodes.delete(node.listener);
        this.listenerNodePool.dispose(node);
      }
      this.tail = null;
      this.toAddHead = null;
      this.toAddTail = null;
      this.pNumListeners = 0;
    };
    return SignalBase;
  })();

  /**
   * Provides a fast signal for use where no parameters are dispatched with the signal.
   */
  var Signal0 = /** @class */ (function(_super) {
    __extends(Signal0, _super);
    function Signal0() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Signal0.prototype.dispatch = function() {
      this.startDispatch();
      var node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    };
    return Signal0;
  })(SignalBase);

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where one parameter is dispatched with the signal.
   */
  var Signal1 = /** @class */ (function(_super) {
    __extends(Signal1, _super);
    function Signal1() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Signal1.prototype.dispatch = function(object) {
      this.startDispatch();
      var node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    };
    return Signal1;
  })(SignalBase);

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where two parameters are dispatched with the signal.
   */
  var Signal2 = /** @class */ (function(_super) {
    __extends(Signal2, _super);
    function Signal2() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Signal2.prototype.dispatch = function(object1, object2) {
      this.startDispatch();
      var node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object1, object2);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    };
    return Signal2;
  })(SignalBase);

  /*
   * Based on ideas used in Robert Penner's AS3-signals - https://github.com/robertpenner/as3-signals
   */
  /**
   * Provides a fast signal for use where three parameters are dispatched with the signal.
   */
  var Signal3 = /** @class */ (function(_super) {
    __extends(Signal3, _super);
    function Signal3() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }
    Signal3.prototype.dispatch = function(object1, object2, object3) {
      this.startDispatch();
      var node;
      for (node = this.head; node; node = node.next) {
        node.listener.call(node, object1, object2, object3);
        if (node.once) {
          this.remove(node.listener);
        }
      }
      this.endDispatch();
    };
    return Signal3;
  })(SignalBase);

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
  var NodeList = /** @class */ (function() {
    function NodeList() {
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
    NodeList.prototype.add = function(node) {
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
    };
    NodeList.prototype.remove = function(node) {
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
    };
    NodeList.prototype.removeAll = function() {
      while (this.head) {
        var node = this.head;
        this.head = node.next;
        node.previous = null;
        node.next = null;
        this.nodeRemoved.dispatch(node);
      }
      this.tail = null;
    };
    Object.defineProperty(NodeList.prototype, 'empty', {
      /**
       * true if the list is empty, false otherwise.
       */
      get: function() {
        return this.head == null;
      },
      enumerable: true,
      configurable: true
    });
    /**
     * Swaps the positions of two nodes in the list. Useful when sorting a list.
     */
    NodeList.prototype.swap = function(node1, node2) {
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
        var temp = node1.previous;
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
    };
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
    NodeList.prototype.insertionSort = function(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      var remains = this.head.next;
      for (var node = remains; node; node = remains) {
        var other = void 0;
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
    };
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
    NodeList.prototype.mergeSort = function(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      var lists = [];
      // disassemble the list
      var start = this.head;
      var end;
      while (start) {
        end = start;
        while (end.next && sortFunction(end, end.next) <= 0) {
          end = end.next;
        }
        var next = end.next;
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
    };
    NodeList.prototype.merge = function(head1, head2, sortFunction) {
      var node;
      var head;
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
    };
    return NodeList;
  })();

  /**
   * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
   * from object creation and garbage collection.
   *
   * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
   * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
   * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
   */
  var NodePool = /** @class */ (function() {
    /**
     * Creates a pool for the given node class.
     */
    function NodePool(nodeClass, components) {
      this.tail = null;
      this.cacheTail = null;
      this.nodeClass = nodeClass;
      this.components = components;
    }
    /**
     * Fetches a node from the pool.
     */
    NodePool.prototype.get = function() {
      if (this.tail) {
        var node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new this.nodeClass();
    };
    /**
     * Adds a node to the pool.
     */
    NodePool.prototype.dispose = function(node) {
      var e_1, _a;
      try {
        for (var _b = __values(this.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var val = _c.value;
          node[val] = null;
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      node.entity = null;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    };
    /**
     * Adds a node to the cache
     */
    NodePool.prototype.cache = function(node) {
      node.previous = this.cacheTail;
      this.cacheTail = node;
    };
    /**
     * Releases all nodes from the cache into the pool
     */
    NodePool.prototype.releaseCache = function() {
      while (this.cacheTail) {
        var node = this.cacheTail;
        this.cacheTail = node.previous;
        this.dispose(node);
      }
    };
    return NodePool;
  })();

  var ashProp = '__ash_types__';
  /**
   * The default class for managing a NodeList. This class creates the NodeList and adds and removes
   * nodes to/from the list as the entities and the components in the engine change.
   *
   * It uses the basic entity matching pattern of an entity system - entities are added to the list if
   * they contain components matching all the public properties of the node class.
   */
  var ComponentMatchingFamily = /** @class */ (function() {
    /**
     * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
     * given node class.
     *
     * @param nodeClass The type of node to create and manage a NodeList for.
     * @param engine The engine that this family is managing teh NodeList for.
     */
    function ComponentMatchingFamily(nodeClass, engine) {
      var _this = this;
      /**
       * Releases the nodes that were added to the node pool during this engine update, so they can
       * be reused.
       */
      this.releaseNodePoolCache = function() {
        _this.engine.updateComplete.remove(_this.releaseNodePoolCache);
        _this.nodePool.releaseCache();
      };
      this.nodeClass = nodeClass;
      this.engine = engine;
      this.init();
    }
    /**
     * Initialises the class. Creates the nodelist and other tools. Analyses the node to determine
     * what component types the node requires.
     */
    ComponentMatchingFamily.prototype.init = function() {
      var e_1, _a;
      this.nodes = new NodeList();
      this.entities = new Map();
      this.components = new Map();
      this.nodePool = new NodePool(this.nodeClass, this.components);
      var dummyNode = this.nodePool.get();
      this.nodePool.dispose(dummyNode);
      var types = dummyNode.constructor[ashProp];
      try {
        for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
          var _b = __read(types_1_1.value, 2),
            className = _b[0],
            classType = _b[1];
          this.components.set(classType, className);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (types_1_1 && !types_1_1.done && (_a = types_1.return)) _a.call(types_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    };
    Object.defineProperty(ComponentMatchingFamily.prototype, 'nodeList', {
      /**
       * The nodelist managed by this family. This is a reference that remains valid always
       * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
       * we always modify it in place.
       */
      get: function() {
        return this.nodes;
      },
      enumerable: true,
      configurable: true
    });
    /**
     * Called by the engine when an entity has been added to it. We check if the entity should be in
     * this family's NodeList and add it if appropriate.
     */
    ComponentMatchingFamily.prototype.newEntity = function(entity) {
      this.addIfMatch(entity);
    };
    /**
     * Called by the engine when a component has been added to an entity. We check if the entity is not in
     * this family's NodeList and should be, and add it if appropriate.
     */
    ComponentMatchingFamily.prototype.componentAddedToEntity = function(entity, componentClass) {
      this.addIfMatch(entity);
    };
    /**
     * Called by the engine when a component has been removed from an entity. We check if the removed component
     * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
     * remove it if so.
     */
    ComponentMatchingFamily.prototype.componentRemovedFromEntity = function(entity, componentClass) {
      if (this.components.has(componentClass)) {
        this.removeIfMatch(entity);
      }
    };
    /**
     * Called by the engine when an entity has been rmoved from it. We check if the entity is in
     * this family's NodeList and remove it if so.
     */
    ComponentMatchingFamily.prototype.removeEntity = function(entity) {
      this.removeIfMatch(entity);
    };
    /**
     * If the entity is not in this family's NodeList, tests the components of the entity to see
     * if it should be in this NodeList and adds it if so.
     */
    ComponentMatchingFamily.prototype.addIfMatch = function(entity) {
      var e_2, _a, e_3, _b;
      if (!this.entities.has(entity)) {
        try {
          for (var _c = __values(this.components.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var componentClass = _d.value;
            if (!entity.has(componentClass)) {
              return;
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
        var node = this.nodePool.get();
        node.entity = entity;
        try {
          for (var _e = __values(this.components.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var componentClass = _f.value;
            node[this.components.get(componentClass)] = entity.get(componentClass);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
        this.entities.set(entity, node);
        this.nodes.add(node);
      }
    };
    /**
     * Removes the entity if it is in this family's NodeList.
     */
    ComponentMatchingFamily.prototype.removeIfMatch = function(entity) {
      if (this.entities.has(entity)) {
        var node = this.entities.get(entity);
        this.entities.delete(entity);
        this.nodes.remove(node);
        if (this.engine.updating) {
          this.nodePool.cache(node);
          this.engine.updateComplete.add(this.releaseNodePoolCache);
        } else {
          this.nodePool.dispose(node);
        }
      }
    };
    /**
     * Removes all nodes from the NodeList.
     */
    ComponentMatchingFamily.prototype.cleanUp = function() {
      for (var node = this.nodes.head; node; node = node.next) {
        this.entities.delete(node.entity);
      }
      this.nodes.removeAll();
    };
    return ComponentMatchingFamily;
  })();
  function keep(type) {
    return function(target, propertyKey) {
      var ctor = target.constructor;
      var map;
      if (ctor.hasOwnProperty(ashProp)) {
        map = ctor[ashProp];
      } else {
        map = new Map();
        Object.defineProperty(ctor, ashProp, {
          enumerable: true,
          get: function() {
            return map;
          }
        });
      }
      map.set(propertyKey, type);
    };
  }

  /**
   * An internal class for a linked list of entities. Used inside the framework for
   * managing the entities.
   */
  var EntityList = /** @class */ (function() {
    function EntityList() {
      this.head = null;
      this.tail = null;
    }
    EntityList.prototype.add = function(entity) {
      if (!this.head) {
        this.head = this.tail = entity;
        entity.next = entity.previous = null;
      } else {
        this.tail.next = entity;
        entity.previous = this.tail;
        entity.next = null;
        this.tail = entity;
      }
    };
    EntityList.prototype.remove = function(entity) {
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
    };
    EntityList.prototype.removeAll = function() {
      while (this.head) {
        var entity = this.head;
        this.head = this.head.next;
        entity.previous = null;
        entity.next = null;
      }
      this.tail = null;
    };
    return EntityList;
  })();

  /**
   * Used internally, this is an ordered list of Systems for use by the engine update loop.
   */
  var SystemList = /** @class */ (function() {
    function SystemList() {
      this.head = null;
      this.tail = null;
    }
    SystemList.prototype.add = function(system) {
      if (!this.head) {
        this.head = this.tail = system;
        system.next = system.previous = null;
      } else {
        var node = void 0;
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
    };
    SystemList.prototype.remove = function(system) {
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
    };
    SystemList.prototype.removeAll = function() {
      while (this.head) {
        var system = this.head;
        this.head = this.head.next;
        system.previous = null;
        system.next = null;
      }
      this.tail = null;
    };
    SystemList.prototype.get = function(type) {
      for (var system = this.head; system; system = system.next) {
        if (system instanceof type) {
          return system;
        }
      }
      return null;
    };
    return SystemList;
  })();

  /**
   * The Engine class is the central point for creating and managing your game state. Add
   * entities and systems to the engine, and fetch families of nodes from the engine.
   */
  var Engine = /** @class */ (function() {
    function Engine() {
      var _this = this;
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
      this.entityNameChanged = function(entity, oldName) {
        if (_this.entityNames.get(oldName) === entity) {
          _this.entityNames.delete(oldName);
          _this.entityNames.set(entity.name, entity);
        }
      };
      /**
       * @private
       */
      this.componentAdded = function(entity, componentClass) {
        var e_1, _a;
        try {
          for (var _b = __values(_this.families.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var family = _c.value;
            family.componentAddedToEntity(entity, componentClass);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      };
      /**
       * @private
       */
      this.componentRemoved = function(entity, componentClass) {
        var e_2, _a;
        try {
          for (var _b = __values(_this.families.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var family = _c.value;
            family.componentRemovedFromEntity(entity, componentClass);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_2) throw e_2.error;
          }
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
    Engine.prototype.addEntity = function(entity) {
      var e_3, _a;
      if (this.entityNames.has(entity.name)) {
        throw new Error('The entity name ' + entity.name + ' is already in use by another entity.');
      }
      this.entityList.add(entity);
      this.entityNames.set(entity.name, entity);
      entity.componentAdded.add(this.componentAdded);
      entity.componentRemoved.add(this.componentRemoved);
      entity.nameChanged.add(this.entityNameChanged);
      try {
        for (var _b = __values(this.families.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var family = _c.value;
          family.newEntity(entity);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
    };
    /**
     * Remove an entity from the engine.
     *
     * @param entity The entity to remove.
     */
    Engine.prototype.removeEntity = function(entity) {
      var e_4, _a;
      entity.componentAdded.remove(this.componentAdded);
      entity.componentRemoved.remove(this.componentRemoved);
      entity.nameChanged.remove(this.entityNameChanged);
      try {
        for (var _b = __values(this.families.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var family = _c.value;
          family.removeEntity(entity);
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
      this.entityNames.delete(entity.name);
      this.entityList.remove(entity);
    };
    /**
     * Get an entity based n its name.
     *
     * @param name The name of the entity
     * @return The entity, or null if no entity with that name exists on the engine
     */
    Engine.prototype.getEntityByName = function(name) {
      return this.entityNames.get(name) || null;
    };
    /**
     * Remove all entities from the engine.
     */
    Engine.prototype.removeAllEntities = function() {
      while (this.entityList.head) {
        this.removeEntity(this.entityList.head);
      }
    };
    Object.defineProperty(Engine.prototype, 'entities', {
      /**
       * Returns an array containing all the entities in the engine.
       */
      get: function() {
        var entities = [];
        for (var entity = this.entityList.head; entity; entity = entity.next) {
          entities[entities.length] = entity;
        }
        return entities;
      },
      enumerable: true,
      configurable: true
    });
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
    Engine.prototype.getNodeList = function(nodeClass) {
      if (this.families.has(nodeClass)) {
        return this.families.get(nodeClass).nodeList;
      }
      var family = new this.familyClass(nodeClass, this);
      this.families.set(nodeClass, family);
      for (var entity = this.entityList.head; entity; entity = entity.next) {
        family.newEntity(entity);
      }
      return family.nodeList;
    };
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
    Engine.prototype.releaseNodeList = function(nodeClass) {
      if (this.families.has(nodeClass)) {
        this.families.get(nodeClass).cleanUp();
      }
      this.families.delete(nodeClass);
    };
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
    Engine.prototype.addSystem = function(system, priority) {
      system.priority = priority;
      system.addToEngine(this);
      this.systemList.add(system);
    };
    /**
     * Get the system instance of a particular type from within the engine.
     *
     * @param type The type of system
     * @return The instance of the system type that is in the engine, or
     * null if no systems of this type are in the engine.
     */
    Engine.prototype.getSystem = function(type) {
      return this.systemList.get(type);
    };
    Object.defineProperty(Engine.prototype, 'systems', {
      /**
       * Returns an array containing all the systems in the engine.
       */
      get: function() {
        var systems = [];
        for (var system = this.systemList.head; system; system = system.next) {
          systems[systems.length] = system;
        }
        return systems;
      },
      enumerable: true,
      configurable: true
    });
    /**
     * Remove a system from the engine.
     *
     * @param system The system to remove from the engine.
     */
    Engine.prototype.removeSystem = function(system) {
      this.systemList.remove(system);
      system.removeFromEngine(this);
    };
    /**
     * Remove all systems from the engine.
     */
    Engine.prototype.removeAllSystems = function() {
      while (this.systemList.head) {
        var system = this.systemList.head;
        this.systemList.head = this.systemList.head.next;
        system.previous = null;
        system.next = null;
        system.removeFromEngine(this);
      }
      this.systemList.tail = null;
    };
    /**
     * Update the engine. This causes the engine update loop to run, calling update on all the
     * systems in the engine.
     *
     * <p>The package net.richardlord.ash.tick contains classes that can be used to provide
     * a steady or variable tick that calls this update method.</p>
     *
     * @time The duration, in seconds, of this update step.
     */
    Engine.prototype.update = function(time) {
      this.updating = true;
      for (var system = this.systemList.head; system; system = system.next) {
        system.update(time);
      }
      this.updating = false;
      this.updateComplete.dispatch();
    };
    return Engine;
  })();

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
  var Entity = /** @class */ (function() {
    /**
     * The constructor
     *
     * @param name The name for the entity. If left blank, a default name is assigned with the form _entityN where N is an integer.
     */
    function Entity(name) {
      if (name === void 0) {
        name = '';
      }
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
    Object.defineProperty(Entity.prototype, 'name', {
      /**
       * All entities have a name. If no name is set, a default name is used. Names are used to
       * fetch specific entities from the engine, and can also help to identify an entity when debugging.
       */
      get: function() {
        return this.pName;
      },
      set: function(value) {
        if (this.pName !== value) {
          var previous = this.pName;
          this.pName = value;
          this.nameChanged.dispatch(this, previous);
        }
      },
      enumerable: true,
      configurable: true
    });
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
    Entity.prototype.add = function(component, componentClass) {
      if (componentClass === void 0) {
        componentClass = null;
      }
      if (!componentClass) {
        componentClass = component.constructor.prototype.constructor; // weird but works!
      }
      componentClass = componentClass;
      if (this.components.has(componentClass)) {
        this.remove(componentClass);
      }
      this.components.set(componentClass, component);
      this.componentAdded.dispatch(this, componentClass);
      return this;
    };
    /**
     * Remove a component from the entity.
     *
     * @param componentClass The class of the component to be removed.
     * @return the component, or null if the component doesn't exist in the entity
     */
    Entity.prototype.remove = function(componentClass) {
      var component = this.components.get(componentClass);
      if (component) {
        this.components.delete(componentClass);
        this.componentRemoved.dispatch(this, componentClass);
        return component;
      }
      return null;
    };
    /**
     * Get a component from the entity.
     *
     * @param componentClass The class of the component requested.
     * @return The component, or null if none was found.
     */
    Entity.prototype.get = function(componentClass) {
      return this.components.get(componentClass) || null;
    };
    /**
     * Get all components from the entity.
     *
     * @return An array containing all the components that are on the entity.
     */
    Entity.prototype.getAll = function() {
      var e_1, _a;
      var componentArray = [];
      try {
        for (var _b = __values(this.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var value = _c.value;
          componentArray.push(value);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return componentArray;
    };
    /**
     * Does the entity have a component of a particular type.
     *
     * @param componentClass The class of the component sought.
     * @return true if the entity has a component of the type, false if not.
     */
    Entity.prototype.has = function(componentClass) {
      return this.components.has(componentClass);
    };
    Entity.nameCount = 0;
    return Entity;
  })();

  /**
   * The base class for a node.
   *
   * <p>A node is a set of different components that are required by a system.
   * A system can request a collection of nodes from the engine. Subsequently the Engine object creates
   * a node for every entity that has all of the components in the node class and adds these nodes
   * to the list obtained by the system. The engine keeps the list up to date as entities are added
   * to and removed from the engine and as the components on entities change.</p>
   */
  var Node = /** @class */ (function() {
    function Node() {
      /**
       * Used by the NodeList class. The previous node in a node list.
       */
      this.previous = null;
      /**
       * Used by the NodeList class. The next node in a node list.
       */
      this.next = null;
    }
    return Node;
  })();

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
  var System = /** @class */ (function() {
    function System() {
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
    return System;
  })();

  /**
   * This component provider always returns the same instance of the component. The instance
   * is passed to the provider at initialisation.
   */
  var ComponentInstanceProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param instance The instance to return whenever a component is requested.
     */
    function ComponentInstanceProvider(instance) {
      this.instance = instance;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance
     */
    ComponentInstanceProvider.prototype.getComponent = function() {
      return this.instance;
    };
    Object.defineProperty(ComponentInstanceProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that returns the same component
       * instance will be regarded as equivalent.
       *
       * @return The instance
       */
      get: function() {
        return this.instance;
      },
      enumerable: true,
      configurable: true
    });
    return ComponentInstanceProvider;
  })();

  /**
   * This component provider always returns the same instance of the component. The instance
   * is created when first required and is of the type passed in to the constructor.
   */
  var ComponentSingletonProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param type The type of the single instance
     */
    function ComponentSingletonProvider(type) {
      this.componentType = type;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The single instance
     */
    ComponentSingletonProvider.prototype.getComponent = function() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };
    Object.defineProperty(ComponentSingletonProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that returns the same single
       * instance will be regarded as equivalent.
       *
       * @return The single instance
       */
      get: function() {
        return this.getComponent();
      },
      enumerable: true,
      configurable: true
    });
    return ComponentSingletonProvider;
  })();

  /**
   * This component provider always returns a new instance of a component. An instance
   * is created when requested and is of the type passed in to the constructor.
   */
  var ComponentTypeProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param type The type of the instances to be created
     */
    function ComponentTypeProvider(type) {
      this.componentType = type;
    }
    /**
     * Used to request a component from this provider
     *
     * @return A new instance of the type provided in the constructor
     */
    ComponentTypeProvider.prototype.getComponent = function() {
      return new this.componentType();
    };
    Object.defineProperty(ComponentTypeProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any ComponentTypeProvider that returns
       * the same type will be regarded as equivalent.
       *
       * @return The type of the instances created
       */
      get: function() {
        return this.componentType;
      },
      enumerable: true,
      configurable: true
    });
    return ComponentTypeProvider;
  })();

  /**
   * This component provider calls a function to get the component instance. The function must
   * return a single component of the appropriate type.
   */
  var DynamicComponentProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param closure The function that will return the component instance when called.
     */
    function DynamicComponentProvider(closure) {
      this.closure = closure;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance returned by calling the function
     */
    DynamicComponentProvider.prototype.getComponent = function() {
      return this.closure();
    };
    Object.defineProperty(DynamicComponentProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that uses the function or method
       * closure to provide the instance is regarded as equivalent.
       *
       * @return The function
       */
      get: function() {
        return this.closure;
      },
      enumerable: true,
      configurable: true
    });
    return DynamicComponentProvider;
  })();

  /**
   * Used by the EntityState class to create the mappings of components to providers via a fluent interface.
   */
  var StateComponentMapping = /** @class */ (function() {
    /**
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a ComponentTypeProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The EntityState that the mapping will belong to
     * @param type The component type for the mapping
     */
    function StateComponentMapping(creatingState, type) {
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
    StateComponentMapping.prototype.withInstance = function(component) {
      this.setProvider(new ComponentInstanceProvider(component));
      return this;
    };
    /**
     * Creates a mapping for the component type to new instances of the provided type.
     * The type should be the same as or extend the type for this mapping. A ComponentTypeProvider
     * is used for the mapping.
     *
     * @param type The type of components to be created by this mapping
     * @return This ComponentMapping, so more modifications can be applied
     */
    StateComponentMapping.prototype.withType = function(type) {
      this.setProvider(new ComponentTypeProvider(type));
      return this;
    };
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
    StateComponentMapping.prototype.withSingleton = function(type) {
      if (!type) {
        type = this.componentType;
      }
      this.setProvider(new ComponentSingletonProvider(type));
      return this;
    };
    /**
     * Creates a mapping for the component type to a method call. A
     * DynamicComponentProvider is used for the mapping.
     *
     * @param method The method to return the component instance
     * @return This ComponentMapping, so more modifications can be applied
     */
    StateComponentMapping.prototype.withMethod = function(method) {
      this.setProvider(new DynamicComponentProvider(method));
      return this;
    };
    /**
     * Creates a mapping for the component type to any ComponentProvider.
     *
     * @param provider The component provider to use.
     * @return This ComponentMapping, so more modifications can be applied.
     */
    StateComponentMapping.prototype.withProvider = function(provider) {
      this.setProvider(provider);
      return this;
    };
    /**
     * Maps through to the add method of the EntityState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param type The type of component to add a mapping to the state for
     * @return The new ComponentMapping for that type
     */
    StateComponentMapping.prototype.add = function(type) {
      return this.creatingState.add(type);
    };
    StateComponentMapping.prototype.setProvider = function(provider) {
      this.provider = provider;
      this.creatingState.providers.set(this.componentType, provider);
    };
    return StateComponentMapping;
  })();

  /**
   * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
   * are used to add components to the entity when this state is entered.
   */
  var EntityState = /** @class */ (function() {
    function EntityState() {
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
    EntityState.prototype.add = function(type) {
      return new StateComponentMapping(this, type);
    };
    /**
     * Get the ComponentProvider for a particular component type.
     *
     * @param type The type of component to get the provider for
     * @return The ComponentProvider
     */
    EntityState.prototype.get = function(type) {
      return this.providers.get(type) || null;
    };
    /**
     * To determine whether this state has a provider for a specific component type.
     *
     * @param type The type of component to look for a provider for
     * @return true if there is a provider for the given type, false otherwise
     */
    EntityState.prototype.has = function(type) {
      return this.providers.has(type);
    };
    return EntityState;
  })();

  /**
   * This is a state machine for an entity. The state machine manages a set of states,
   * each of which has a set of component providers. When the state machine changes the state, it removes
   * components associated with the previous state and adds components associated with the new state.
   */
  var EntityStateMachine = /** @class */ (function() {
    /**
     * Constructor. Creates an EntityStateMachine.
     */
    function EntityStateMachine(entity) {
      this.entity = entity;
      this.states = {};
    }
    /**
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */
    EntityStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };
    /**
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */
    EntityStateMachine.prototype.createState = function(name) {
      var state = new EntityState();
      this.states[name] = state;
      return state;
    };
    /**
     * Change to a new state. The components from the old state will be removed and the components
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */
    EntityStateMachine.prototype.changeState = function(name) {
      var e_1, _a, e_2, _b, e_3, _c;
      var newState = this.states[name];
      if (!newState) {
        throw new Error('Entity state ' + name + " doesn't exist");
      }
      if (newState === this.currentState) {
        newState = null;
        return;
      }
      var toAdd;
      if (this.currentState) {
        toAdd = new Map();
        try {
          for (var _d = __values(newState.providers.keys()), _e = _d.next(); !_e.done; _e = _d.next()) {
            var type = _e.value;
            toAdd.set(type, newState.providers.get(type));
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        try {
          for (var _f = __values(this.currentState.providers.keys()), _g = _f.next(); !_g.done; _g = _f.next()) {
            var type = _g.value;
            var other = toAdd.get(type) || null;
            if (other && other.identifier === this.currentState.providers.get(type).identifier) {
              toAdd.delete(type);
            } else {
              this.entity.remove(type);
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      } else {
        toAdd = newState.providers;
      }
      try {
        for (var _h = __values(toAdd.keys()), _j = _h.next(); !_j.done; _j = _h.next()) {
          var type = _j.value;
          this.entity.add(toAdd.get(type).getComponent(), type);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      this.currentState = newState;
    };
    return EntityStateMachine;
  })();

  /**
   * This System provider returns results of a method call. The method
   * is passed to the provider at initialisation.
   */
  var DynamicSystemProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param method The method that returns the System instance;
     */
    function DynamicSystemProvider(method) {
      this.systemPriority = 0;
      this.method = method;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance of the System
     */
    DynamicSystemProvider.prototype.getSystem = function() {
      return this.method();
    };
    Object.defineProperty(DynamicSystemProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that returns the same component
       * instance will be regarded as equivalent.
       *
       * @return The method used to call the System instances
       */
      get: function() {
        return this.method;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(DynamicSystemProvider.prototype, 'priority', {
      /**
       * The priority at which the System should be added to the Engine
       */
      get: function() {
        return this.systemPriority;
      },
      set: function(value) {
        this.systemPriority = value;
      },
      enumerable: true,
      configurable: true
    });
    return DynamicSystemProvider;
  })();

  var StateSystemMapping = /** @class */ (function() {
    /**
     * Used internally, the constructor creates a component mapping. The constructor
     * creates a SystemSingletonProvider as the default mapping, which will be replaced
     * by more specific mappings if other methods are called.
     *
     * @param creatingState The SystemState that the mapping will belong to
     * @param provider The System type for the mapping
     */
    function StateSystemMapping(creatingState, provider) {
      this.creatingState = creatingState;
      this.provider = provider;
    }
    /**
     * Applies the priority to the provider that the System will be.
     *
     * @param priority The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    StateSystemMapping.prototype.withPriority = function(priority) {
      this.provider.priority = priority;
      return this;
    };
    /**
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */
    StateSystemMapping.prototype.addInstance = function(system) {
      return this.creatingState.addInstance(system);
    };
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
    StateSystemMapping.prototype.addSingleton = function(type) {
      return this.creatingState.addSingleton(type);
    };
    /**
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    StateSystemMapping.prototype.addMethod = function(method) {
      return this.creatingState.addMethod(method);
    };
    /**
     * Maps through to the addProvider method of the SystemState that this mapping belongs to
     * so that a fluent interface can be used when configuring entity states.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    StateSystemMapping.prototype.addProvider = function(provider) {
      return this.creatingState.addProvider(provider);
    };
    return StateSystemMapping;
  })();

  /**
   * This System provider always returns the same instance of the component. The system
   * is passed to the provider at initialisation.
   */
  var SystemInstanceProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param instance The instance to return whenever a System is requested.
     */
    function SystemInstanceProvider(instance) {
      this.systemPriority = 0;
      this.instance = instance;
    }
    /**
     * Used to request a component from this provider
     *
     * @return The instance of the System
     */
    SystemInstanceProvider.prototype.getSystem = function() {
      return this.instance;
    };
    Object.defineProperty(SystemInstanceProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that returns the same component
       * instance will be regarded as equivalent.
       *
       * @return The instance
       */
      get: function() {
        return this.instance;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(SystemInstanceProvider.prototype, 'priority', {
      /**
       * The priority at which the System should be added to the Engine
       */
      get: function() {
        return this.systemPriority;
      },
      /**
       * @private
       */
      set: function(value) {
        this.systemPriority = value;
      },
      enumerable: true,
      configurable: true
    });
    return SystemInstanceProvider;
  })();

  /**
   * This System provider always returns the same instance of the System. The instance
   * is created when first required and is of the type passed in to the constructor.
   */
  var SystemSingletonProvider = /** @class */ (function() {
    /**
     * Constructor
     *
     * @param type The type of the single System instance
     */
    function SystemSingletonProvider(type) {
      this.systemPriority = 0;
      this.componentType = type;
    }
    /**
     * Used to request a System from this provider
     *
     * @return The single instance
     */
    SystemSingletonProvider.prototype.getSystem = function() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };
    Object.defineProperty(SystemSingletonProvider.prototype, 'identifier', {
      /**
       * Used to compare this provider with others. Any provider that returns the same single
       * instance will be regarded as equivalent.
       *
       * @return The single instance
       */
      get: function() {
        return this.getSystem();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(SystemSingletonProvider.prototype, 'priority', {
      /**
       * The priority at which the System should be added to the Engine
       */
      get: function() {
        return this.systemPriority;
      },
      /**
       * @private
       */
      set: function(value) {
        this.systemPriority = value;
      },
      enumerable: true,
      configurable: true
    });
    return SystemSingletonProvider;
  })();

  /**
   * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
   * are used to add Systems to the Engine when this state is entered.
   */
  var EngineState = /** @class */ (function() {
    function EngineState() {
      this.providers = [];
    }
    /**
     * Creates a mapping for the System type to a specific System instance. A
     * SystemInstanceProvider is used for the mapping.
     *
     * @param system The System instance to use for the mapping
     * @return This StateSystemMapping, so more modifications can be applied
     */
    EngineState.prototype.addInstance = function(system) {
      return this.addProvider(new SystemInstanceProvider(system));
    };
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
    EngineState.prototype.addSingleton = function(type) {
      return this.addProvider(new SystemSingletonProvider(type));
    };
    /**
     * Creates a mapping for the System type to a method call.
     * The method should return a System instance. A DynamicSystemProvider is used for
     * the mapping.
     *
     * @param method The method to provide the System instance.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    EngineState.prototype.addMethod = function(method) {
      return this.addProvider(new DynamicSystemProvider(method));
    };
    /**
     * Adds any SystemProvider.
     *
     * @param provider The component provider to use.
     * @return This StateSystemMapping, so more modifications can be applied.
     */
    EngineState.prototype.addProvider = function(provider) {
      var mapping = new StateSystemMapping(this, provider);
      this.providers[this.providers.length] = provider;
      return mapping;
    };
    return EngineState;
  })();

  /**
   * This is a state machine for the Engine. The state machine manages a set of states,
   * each of which has a set of System providers. When the state machine changes the state, it removes
   * Systems associated with the previous state and adds Systems associated with the new state.
   */
  var EngineStateMachine = /** @class */ (function() {
    /**
     * Constructor. Creates an SystemStateMachine.
     */
    function EngineStateMachine(engine) {
      this.engine = engine;
      this.states = {};
    }
    /**
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */
    EngineStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };
    /**
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */
    EngineStateMachine.prototype.createState = function(name) {
      var state = new EngineState();
      this.states[name] = state;
      return state;
    };
    /**
     * Change to a new state. The Systems from the old state will be removed and the Systems
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */
    EngineStateMachine.prototype.changeState = function(name) {
      var e_1, _a, e_2, _b, e_3, _c;
      var newState = this.states[name];
      if (!newState) {
        throw new Error('Engine state ' + name + " doesn't exist");
      }
      if (newState === this.currentState) {
        newState = null;
        return;
      }
      var toAdd = [];
      var id;
      try {
        for (var _d = __values(newState.providers), _e = _d.next(); !_e.done; _e = _d.next()) {
          var provider = _e.value;
          id = provider.identifier;
          toAdd[id] = provider;
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      if (this.currentState) {
        try {
          for (var _f = __values(this.currentState.providers), _g = _f.next(); !_g.done; _g = _f.next()) {
            var provider = _g.value;
            id = provider.identifier;
            var other = toAdd[id];
            if (other) {
              delete toAdd[id];
            } else {
              this.engine.removeSystem(provider.getSystem());
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      try {
        for (var toAdd_1 = __values(toAdd), toAdd_1_1 = toAdd_1.next(); !toAdd_1_1.done; toAdd_1_1 = toAdd_1.next()) {
          var provider = toAdd_1_1.value;
          this.engine.addSystem(provider.getSystem(), provider.priority);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (toAdd_1_1 && !toAdd_1_1.done && (_c = toAdd_1.return)) _c.call(toAdd_1);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      this.currentState = newState;
    };
    return EngineStateMachine;
  })();

  var RAFTickProvider = /** @class */ (function(_super) {
    __extends(RAFTickProvider, _super);
    function RAFTickProvider() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.rafId = 0;
      _this.previousTime = 0;
      _this.update = function() {
        _this.rafId = window.requestAnimationFrame(_this.update);
        var time = Date.now();
        var second = 1000;
        _this.dispatch((time - _this.previousTime) / second);
        _this.previousTime = time;
      };
      return _this;
    }
    RAFTickProvider.prototype.start = function() {
      this.previousTime = Date.now();
      this.rafId = window.requestAnimationFrame(this.update);
    };
    RAFTickProvider.prototype.stop = function() {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    };
    Object.defineProperty(RAFTickProvider.prototype, 'playing', {
      get: function() {
        return !!this.rafId;
      },
      enumerable: true,
      configurable: true
    });
    return RAFTickProvider;
  })(Signal1);

  var IntervalTickProvider = /** @class */ (function(_super) {
    __extends(IntervalTickProvider, _super);
    function IntervalTickProvider(interval) {
      var _this = _super.call(this) || this;
      _this.intervalId = 0;
      _this.previousTime = 0;
      _this.pInterval = 33;
      _this.update = function() {
        var time = Date.now();
        var second = 1000;
        _this.dispatch((time - _this.previousTime) / second);
        _this.previousTime = time;
      };
      if (interval) {
        _this.pInterval = interval;
      }
      return _this;
    }
    IntervalTickProvider.prototype.start = function() {
      this.previousTime = Date.now();
      this.intervalId = window.setInterval(this.update, this.pInterval);
    };
    IntervalTickProvider.prototype.stop = function() {
      window.clearInterval(this.intervalId);
      this.intervalId = 0;
    };
    Object.defineProperty(IntervalTickProvider.prototype, 'interval', {
      set: function(interval) {
        this.pInterval = interval;
        if (this.intervalId !== 0) {
          window.clearInterval(this.intervalId);
          this.intervalId = window.setInterval(this.update, interval);
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(IntervalTickProvider.prototype, 'inteval', {
      get: function() {
        return this.pInterval;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(IntervalTickProvider.prototype, 'playing', {
      get: function() {
        return !!this.intervalId;
      },
      enumerable: true,
      configurable: true
    });
    return IntervalTickProvider;
  })(Signal1);

  var ComponentPool = /** @class */ (function() {
    function ComponentPool() {}
    ComponentPool.getPool = function(componentClass) {
      if (ComponentPool.pools.has(componentClass)) {
        return ComponentPool.pools.get(componentClass);
      }
      var ret = [];
      ComponentPool.pools.set(componentClass, ret);
      return ret;
    };
    /**
     * Get an object from the pool.
     *
     * @param componentClass The type of component wanted.
     * @return The component.
     */
    ComponentPool.get = function(componentClass) {
      var pool = ComponentPool.getPool(componentClass);
      if (pool.length > 0) {
        return pool.pop();
      }
      return new componentClass();
    };
    /**
     * Return an object to the pool for reuse.
     *
     * @param component The component to return to the pool.
     */
    ComponentPool.dispose = function(component) {
      if (component) {
        var type = component.constructor.prototype.constructor;
        var pool = ComponentPool.getPool(type);
        pool[pool.length] = component;
      }
    };
    /**
     * Dispose of all pooled resources, freeing them for garbage collection.
     */
    ComponentPool.empty = function() {
      ComponentPool.pools = new Map();
    };
    ComponentPool.pools = new Map();
    return ComponentPool;
  })();

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
  var ListIteratingSystem = /** @class */ (function(_super) {
    __extends(ListIteratingSystem, _super);
    function ListIteratingSystem(nodeClass) {
      var _this = _super.call(this) || this;
      _this.nodeList = null;
      _this.nodeClass = nodeClass;
      return _this;
    }
    ListIteratingSystem.prototype.addToEngine = function(engine) {
      this.nodeList = engine.getNodeList(this.nodeClass);
      if (this.nodeAdded) {
        for (var node = this.nodeList.head; node; node = node.next) {
          this.nodeAdded(node);
        }
        this.nodeList.nodeAdded.add(this.nodeAdded);
      }
      if (this.nodeRemoved) {
        this.nodeList.nodeRemoved.add(this.nodeRemoved);
      }
    };
    ListIteratingSystem.prototype.removeFromEngine = function(engine) {
      if (this.nodeAdded) {
        this.nodeList.nodeAdded.remove(this.nodeAdded);
      }
      if (this.nodeRemoved) {
        this.nodeList.nodeRemoved.remove(this.nodeRemoved);
      }
      this.nodeList = null;
    };
    ListIteratingSystem.prototype.update = function(time) {
      for (var node = this.nodeList.head; node; node = node.next) {
        this.updateNode(node, time);
      }
    };
    return ListIteratingSystem;
  })(System);

  exports.Signal0 = Signal0;
  exports.Signal1 = Signal1;
  exports.Signal2 = Signal2;
  exports.Signal3 = Signal3;
  exports.ComponentMatchingFamily = ComponentMatchingFamily;
  exports.keep = keep;
  exports.Engine = Engine;
  exports.Entity = Entity;
  exports.Node = Node;
  exports.NodePool = NodePool;
  exports.NodeList = NodeList;
  exports.System = System;
  exports.EntityStateMachine = EntityStateMachine;
  exports.EngineStateMachine = EngineStateMachine;
  exports.RAFTickProvider = RAFTickProvider;
  exports.IntervalTickProvider = IntervalTickProvider;
  exports.ComponentPool = ComponentPool;
  exports.ListIteratingSystem = ListIteratingSystem;

  Object.defineProperty(exports, '__esModule', { value: true });
});
