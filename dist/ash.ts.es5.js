(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
      ? define(['exports'], factory)
      : factory((global.ash = {}));
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

  var ListenerNode = (function() {
    function ListenerNode() {
      this.previous = null;
      this.next = null;
      this.listener = null;
      this.once = false;
    }
    return ListenerNode;
  })();

  var ListenerNodePool = (function() {
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

  var SignalBase = (function() {
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

  var Signal0 = (function(_super) {
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

  var Signal1 = (function(_super) {
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

  var Signal2 = (function(_super) {
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

  var Signal3 = (function(_super) {
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

  var NodeList = (function() {
    function NodeList() {
      this.head = null;
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
      get: function() {
        return this.head == null;
      },
      enumerable: true,
      configurable: true
    });
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
            if (node !== other.next) {
              if (this.tail === node) {
                this.tail = node.previous;
              }
              node.previous.next = node.next;
              if (node.next) {
                node.next.previous = node.previous;
              }
              node.next = other.next;
              node.previous = other;
              node.next.previous = node;
              other.next = node;
            }
            break;
          }
        }
        if (!other) {
          if (this.tail === node) {
            this.tail = node.previous;
          }
          node.previous.next = node.next;
          if (node.next) {
            node.next.previous = node.previous;
          }
          node.next = this.head;
          this.head.previous = node;
          node.previous = null;
          this.head = node;
        }
      }
    };
    NodeList.prototype.mergeSort = function(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      var lists = [];
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
      while (lists.length > 1) {
        lists.push(this.merge(lists.shift(), lists.shift(), sortFunction));
      }
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

  var NodePool = (function() {
    function NodePool(nodeClass, components) {
      this.tail = null;
      this.cacheTail = null;
      this.nodeClass = nodeClass;
      this.components = components;
    }
    NodePool.prototype.get = function() {
      if (this.tail) {
        var node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new this.nodeClass();
    };
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
    NodePool.prototype.cache = function(node) {
      node.previous = this.cacheTail;
      this.cacheTail = node;
    };
    NodePool.prototype.releaseCache = function() {
      while (this.cacheTail) {
        var node = this.cacheTail;
        this.cacheTail = node.previous;
        this.dispose(node);
      }
    };
    return NodePool;
  })();

  var ComponentMatchingFamily = (function() {
    function ComponentMatchingFamily(nodeClass, engine) {
      var _this = this;
      this.releaseNodePoolCache = function() {
        _this.engine.updateComplete.remove(_this.releaseNodePoolCache);
        _this.nodePool.releaseCache();
      };
      this.nodeClass = nodeClass;
      this.engine = engine;
      this.init();
    }
    ComponentMatchingFamily.prototype.init = function() {
      this.nodes = new NodeList();
      this.entities = new Map();
      this.components = new Map();
      this.nodePool = new NodePool(this.nodeClass, this.components);
      var dummyNode = this.nodePool.get();
      this.nodePool.dispose(dummyNode);
      var types = dummyNode.constructor['__ash_types__'];
      for (var type in types) {
        if (types.hasOwnProperty(type)) {
          this.components.set(types[type], type);
        }
      }
    };
    Object.defineProperty(ComponentMatchingFamily.prototype, 'nodeList', {
      get: function() {
        return this.nodes;
      },
      enumerable: true,
      configurable: true
    });
    ComponentMatchingFamily.prototype.newEntity = function(entity) {
      this.addIfMatch(entity);
    };
    ComponentMatchingFamily.prototype.componentAddedToEntity = function(entity, componentClass) {
      this.addIfMatch(entity);
    };
    ComponentMatchingFamily.prototype.componentRemovedFromEntity = function(entity, componentClass) {
      if (this.components.has(componentClass)) {
        this.removeIfMatch(entity);
      }
    };
    ComponentMatchingFamily.prototype.removeEntity = function(entity) {
      this.removeIfMatch(entity);
    };
    ComponentMatchingFamily.prototype.addIfMatch = function(entity) {
      var e_1, _a, e_2, _b;
      if (!this.entities.has(entity)) {
        try {
          for (var _c = __values(this.components.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var componentClass = _d.value;
            if (!entity.has(componentClass)) {
              return;
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        var node = this.nodePool.get();
        node.entity = entity;
        try {
          for (var _e = __values(this.components.keys()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var componentClass = _f.value;
            node[this.components.get(componentClass)] = entity.get(componentClass);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
        this.entities.set(entity, node);
        this.nodes.add(node);
      }
    };
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
    ComponentMatchingFamily.prototype.cleanUp = function() {
      for (var node = this.nodes.head; node; node = node.next) {
        this.entities.delete(node.entity);
      }
      this.nodes.removeAll();
    };
    return ComponentMatchingFamily;
  })();

  var EntityList = (function() {
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

  var SystemList = (function() {
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

  var Engine = (function() {
    function Engine() {
      var _this = this;
      this.updating = false;
      this.familyClass = ComponentMatchingFamily;
      this.entityNameChanged = function(entity, oldName) {
        if (_this.entityNames.get(oldName) === entity) {
          _this.entityNames.delete(oldName);
          _this.entityNames.set(entity.name, entity);
        }
      };
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
    Engine.prototype.getEntityByName = function(name) {
      return this.entityNames.get(name) || null;
    };
    Engine.prototype.removeAllEntities = function() {
      while (this.entityList.head) {
        this.removeEntity(this.entityList.head);
      }
    };
    Object.defineProperty(Engine.prototype, 'entities', {
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
    Engine.prototype.releaseNodeList = function(nodeClass) {
      if (this.families.has(nodeClass)) {
        this.families.get(nodeClass).cleanUp();
      }
      this.families.delete(nodeClass);
    };
    Engine.prototype.addSystem = function(system, priority) {
      system.priority = priority;
      system.addToEngine(this);
      this.systemList.add(system);
    };
    Engine.prototype.getSystem = function(type) {
      return this.systemList.get(type);
    };
    Object.defineProperty(Engine.prototype, 'systems', {
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
    Engine.prototype.removeSystem = function(system) {
      this.systemList.remove(system);
      system.removeFromEngine(this);
    };
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

  var Entity = (function() {
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
    Entity.prototype.add = function(component, componentClass) {
      if (componentClass === void 0) {
        componentClass = null;
      }
      if (!componentClass) {
        componentClass = component.constructor.prototype.constructor;
      }
      if (this.components.has(componentClass)) {
        this.remove(componentClass);
      }
      this.components.set(componentClass, component);
      this.componentAdded.dispatch(this, componentClass);
      return this;
    };
    Entity.prototype.remove = function(componentClass) {
      var component = this.components.get(componentClass);
      if (component) {
        this.components.delete(componentClass);
        this.componentRemoved.dispatch(this, componentClass);
        return component;
      }
      return null;
    };
    Entity.prototype.get = function(componentClass) {
      return this.components.get(componentClass);
    };
    Entity.prototype.getAll = function() {
      var e_1, _a;
      var componentArray = [];
      try {
        for (var _b = __values(this.components.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var value = _c.value;
          componentArray[componentArray.length] = value;
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
    Entity.prototype.has = function(componentClass) {
      return this.components.has(componentClass);
    };
    Entity.nameCount = 0;
    return Entity;
  })();

  var Node = (function() {
    function Node() {
      this.previous = null;
      this.next = null;
    }
    return Node;
  })();
  function keep(type) {
    return function(target, propertyKey, descriptor) {
      var ctor = target.constructor;
      var map;
      var ashProp = '__ash_types__';
      if (ctor.hasOwnProperty(ashProp)) {
        map = ctor[ashProp];
      } else {
        map = {};
        Object.defineProperty(ctor, ashProp, {
          enumerable: true,
          value: map
        });
      }
      map[propertyKey] = type;
      return descriptor;
    };
  }

  var System = (function() {
    function System() {
      this.previous = null;
      this.next = null;
      this.priority = 0;
    }
    return System;
  })();

  var ComponentInstanceProvider = (function() {
    function ComponentInstanceProvider(instance) {
      this.instance = instance;
    }
    ComponentInstanceProvider.prototype.getComponent = function() {
      return this.instance;
    };
    Object.defineProperty(ComponentInstanceProvider.prototype, 'identifier', {
      get: function() {
        return this.instance;
      },
      enumerable: true,
      configurable: true
    });
    return ComponentInstanceProvider;
  })();

  var ComponentSingletonProvider = (function() {
    function ComponentSingletonProvider(type) {
      this.componentType = type;
    }
    ComponentSingletonProvider.prototype.getComponent = function() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };
    Object.defineProperty(ComponentSingletonProvider.prototype, 'identifier', {
      get: function() {
        return this.getComponent();
      },
      enumerable: true,
      configurable: true
    });
    return ComponentSingletonProvider;
  })();

  var ComponentTypeProvider = (function() {
    function ComponentTypeProvider(type) {
      this.componentType = type;
    }
    ComponentTypeProvider.prototype.getComponent = function() {
      return new this.componentType();
    };
    Object.defineProperty(ComponentTypeProvider.prototype, 'identifier', {
      get: function() {
        return this.componentType;
      },
      enumerable: true,
      configurable: true
    });
    return ComponentTypeProvider;
  })();

  var DynamicComponentProvider = (function() {
    function DynamicComponentProvider(closure) {
      this.closure = closure;
    }
    DynamicComponentProvider.prototype.getComponent = function() {
      return this.closure();
    };
    Object.defineProperty(DynamicComponentProvider.prototype, 'identifier', {
      get: function() {
        return this.closure;
      },
      enumerable: true,
      configurable: true
    });
    return DynamicComponentProvider;
  })();

  var StateComponentMapping = (function() {
    function StateComponentMapping(creatingState, type) {
      this.creatingState = creatingState;
      this.componentType = type;
      this.withType(type);
    }
    StateComponentMapping.prototype.withInstance = function(component) {
      this.setProvider(new ComponentInstanceProvider(component));
      return this;
    };
    StateComponentMapping.prototype.withType = function(type) {
      this.setProvider(new ComponentTypeProvider(type));
      return this;
    };
    StateComponentMapping.prototype.withSingleton = function(type) {
      if (!type) {
        type = this.componentType;
      }
      this.setProvider(new ComponentSingletonProvider(type));
      return this;
    };
    StateComponentMapping.prototype.withMethod = function(method) {
      this.setProvider(new DynamicComponentProvider(method));
      return this;
    };
    StateComponentMapping.prototype.withProvider = function(provider) {
      this.setProvider(provider);
      return this;
    };
    StateComponentMapping.prototype.add = function(type) {
      return this.creatingState.add(type);
    };
    StateComponentMapping.prototype.setProvider = function(provider) {
      this.provider = provider;
      this.creatingState.providers.set(this.componentType, provider);
    };
    return StateComponentMapping;
  })();

  var EntityState = (function() {
    function EntityState() {
      this.providers = new Map();
    }
    EntityState.prototype.add = function(type) {
      return new StateComponentMapping(this, type);
    };
    EntityState.prototype.get = function(type) {
      return this.providers.get(type) || null;
    };
    EntityState.prototype.has = function(type) {
      return this.providers.has(type);
    };
    return EntityState;
  })();

  var EntityStateMachine = (function() {
    function EntityStateMachine(entity) {
      this.entity = entity;
      this.states = {};
    }
    EntityStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };
    EntityStateMachine.prototype.createState = function(name) {
      var state = new EntityState();
      this.states[name] = state;
      return state;
    };
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

  var DynamicSystemProvider = (function() {
    function DynamicSystemProvider(method) {
      this.systemPriority = 0;
      this.method = method;
    }
    DynamicSystemProvider.prototype.getSystem = function() {
      return this.method();
    };
    Object.defineProperty(DynamicSystemProvider.prototype, 'identifier', {
      get: function() {
        return this.method;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(DynamicSystemProvider.prototype, 'priority', {
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

  var StateSystemMapping = (function() {
    function StateSystemMapping(creatingState, provider) {
      this.creatingState = creatingState;
      this.provider = provider;
    }
    StateSystemMapping.prototype.withPriority = function(priority) {
      this.provider.priority = priority;
      return this;
    };
    StateSystemMapping.prototype.addInstance = function(system) {
      return this.creatingState.addInstance(system);
    };
    StateSystemMapping.prototype.addSingleton = function(type) {
      return this.creatingState.addSingleton(type);
    };
    StateSystemMapping.prototype.addMethod = function(method) {
      return this.creatingState.addMethod(method);
    };
    StateSystemMapping.prototype.addProvider = function(provider) {
      return this.creatingState.addProvider(provider);
    };
    return StateSystemMapping;
  })();

  var SystemInstanceProvider = (function() {
    function SystemInstanceProvider(instance) {
      this.systemPriority = 0;
      this.instance = instance;
    }
    SystemInstanceProvider.prototype.getSystem = function() {
      return this.instance;
    };
    Object.defineProperty(SystemInstanceProvider.prototype, 'identifier', {
      get: function() {
        return this.instance;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(SystemInstanceProvider.prototype, 'priority', {
      get: function() {
        return this.systemPriority;
      },
      set: function(value) {
        this.systemPriority = value;
      },
      enumerable: true,
      configurable: true
    });
    return SystemInstanceProvider;
  })();

  var SystemSingletonProvider = (function() {
    function SystemSingletonProvider(type) {
      this.systemPriority = 0;
      this.componentType = type;
    }
    SystemSingletonProvider.prototype.getSystem = function() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    };
    Object.defineProperty(SystemSingletonProvider.prototype, 'identifier', {
      get: function() {
        return this.getSystem();
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(SystemSingletonProvider.prototype, 'priority', {
      get: function() {
        return this.systemPriority;
      },
      set: function(value) {
        this.systemPriority = value;
      },
      enumerable: true,
      configurable: true
    });
    return SystemSingletonProvider;
  })();

  var EngineState = (function() {
    function EngineState() {
      this.providers = [];
    }
    EngineState.prototype.addInstance = function(system) {
      return this.addProvider(new SystemInstanceProvider(system));
    };
    EngineState.prototype.addSingleton = function(type) {
      return this.addProvider(new SystemSingletonProvider(type));
    };
    EngineState.prototype.addMethod = function(method) {
      return this.addProvider(new DynamicSystemProvider(method));
    };
    EngineState.prototype.addProvider = function(provider) {
      var mapping = new StateSystemMapping(this, provider);
      this.providers[this.providers.length] = provider;
      return mapping;
    };
    return EngineState;
  })();

  var EngineStateMachine = (function() {
    function EngineStateMachine(engine) {
      this.engine = engine;
      this.states = {};
    }
    EngineStateMachine.prototype.addState = function(name, state) {
      this.states[name] = state;
      return this;
    };
    EngineStateMachine.prototype.createState = function(name) {
      var state = new EngineState();
      this.states[name] = state;
      return state;
    };
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

  var RAFTickProvider = (function(_super) {
    __extends(RAFTickProvider, _super);
    function RAFTickProvider() {
      var _this = _super.call(this) || this;
      _this.rafId = 0;
      _this.previousTime = 0;
      _this.playing = false;
      _this.update = function() {
        _this.rafId = requestAnimationFrame(_this.update);
        var time = Date.now();
        var second = 1000;
        _this.dispatch((time - _this.previousTime) / second);
        _this.previousTime = time;
      };
      return _this;
    }
    RAFTickProvider.prototype.start = function() {
      this.previousTime = Date.now();
      this.playing = true;
      this.rafId = requestAnimationFrame(this.update);
    };
    RAFTickProvider.prototype.stop = function() {
      cancelAnimationFrame(this.rafId);
    };
    return RAFTickProvider;
  })(Signal1);

  var ComponentPool = (function() {
    function ComponentPool() {}
    ComponentPool.getPool = function(componentClass) {
      if (ComponentPool.pools.has(componentClass)) {
        return ComponentPool.pools.get(componentClass);
      }
      var ret = [];
      ComponentPool.pools.set(componentClass, ret);
      return ret;
    };
    ComponentPool.get = function(componentClass) {
      var pool = ComponentPool.getPool(componentClass);
      if (pool.length > 0) {
        return pool.pop();
      }
      return new componentClass();
    };
    ComponentPool.dispose = function(component) {
      if (component) {
        var type = component.constructor.prototype.constructor;
        var pool = ComponentPool.getPool(type);
        pool[pool.length] = component;
      }
    };
    ComponentPool.empty = function() {
      ComponentPool.pools = new Map();
    };
    ComponentPool.pools = new Map();
    return ComponentPool;
  })();

  var ListIteratingSystem = (function(_super) {
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
  exports.Engine = Engine;
  exports.Entity = Entity;
  exports.Node = Node;
  exports.keep = keep;
  exports.NodeList = NodeList;
  exports.NodePool = NodePool;
  exports.System = System;
  exports.EntityStateMachine = EntityStateMachine;
  exports.EngineStateMachine = EngineStateMachine;
  exports.RAFTickProvider = RAFTickProvider;
  exports.ComponentPool = ComponentPool;
  exports.ListIteratingSystem = ListIteratingSystem;

  Object.defineProperty(exports, '__esModule', { value: true });
});
