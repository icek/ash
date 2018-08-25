(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
      ? define(['exports'], factory)
      : factory((global.ash = {}));
})(this, function(exports) {
  'use strict';

  class ListenerNode {
    constructor() {
      this.previous = null;
      this.next = null;
      this.listener = null;
      this.once = false;
    }
  }

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

  class NodeList {
    constructor() {
      this.head = null;
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
    get empty() {
      return this.head == null;
    }
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
    insertionSort(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      let remains = this.head.next;
      for (let node = remains; node; node = remains) {
        let other;
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
    }
    mergeSort(sortFunction) {
      if (this.head === this.tail) {
        return;
      }
      const lists = [];
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
      while (lists.length > 1) {
        lists.push(this.merge(lists.shift(), lists.shift(), sortFunction));
      }
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

  class NodePool {
    constructor(nodeClass, components) {
      this.tail = null;
      this.cacheTail = null;
      this.nodeClass = nodeClass;
      this.components = components;
    }
    get() {
      if (this.tail) {
        const node = this.tail;
        this.tail = this.tail.previous;
        node.previous = null;
        return node;
      }
      return new this.nodeClass();
    }
    dispose(node) {
      for (const val of this.components.values()) {
        node[val] = null;
      }
      node.entity = null;
      node.next = null;
      node.previous = this.tail;
      this.tail = node;
    }
    cache(node) {
      node.previous = this.cacheTail;
      this.cacheTail = node;
    }
    releaseCache() {
      while (this.cacheTail) {
        const node = this.cacheTail;
        this.cacheTail = node.previous;
        this.dispose(node);
      }
    }
  }

  class ComponentMatchingFamily {
    constructor(nodeClass, engine) {
      this.releaseNodePoolCache = () => {
        this.engine.updateComplete.remove(this.releaseNodePoolCache);
        this.nodePool.releaseCache();
      };
      this.nodeClass = nodeClass;
      this.engine = engine;
      this.init();
    }
    init() {
      this.nodes = new NodeList();
      this.entities = new Map();
      this.components = new Map();
      this.nodePool = new NodePool(this.nodeClass, this.components);
      const dummyNode = this.nodePool.get();
      this.nodePool.dispose(dummyNode);
      const types = dummyNode.constructor['__ash_types__'];
      const keys = Object.keys(types);
      for (let i = 0; i < keys.length; i++) {
        const type = keys[i];
        this.components.set(types[type], type);
      }
    }
    get nodeList() {
      return this.nodes;
    }
    newEntity(entity) {
      this.addIfMatch(entity);
    }
    componentAddedToEntity(entity, componentClass) {
      this.addIfMatch(entity);
    }
    componentRemovedFromEntity(entity, componentClass) {
      if (this.components.has(componentClass)) {
        this.removeIfMatch(entity);
      }
    }
    removeEntity(entity) {
      this.removeIfMatch(entity);
    }
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
          node[this.components.get(componentClass)] = entity.get(componentClass);
        }
        this.entities.set(entity, node);
        this.nodes.add(node);
      }
    }
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
    cleanUp() {
      for (let node = this.nodes.head; node; node = node.next) {
        this.entities.delete(node.entity);
      }
      this.nodes.removeAll();
    }
  }

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

  class Engine {
    constructor() {
      this.updating = false;
      this.familyClass = ComponentMatchingFamily;
      this.entityNameChanged = (entity, oldName) => {
        if (this.entityNames.get(oldName) === entity) {
          this.entityNames.delete(oldName);
          this.entityNames.set(entity.name, entity);
        }
      };
      this.componentAdded = (entity, componentClass) => {
        for (const family of this.families.values()) {
          family.componentAddedToEntity(entity, componentClass);
        }
      };
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
    getEntityByName(name) {
      return this.entityNames.get(name) || null;
    }
    removeAllEntities() {
      while (this.entityList.head) {
        this.removeEntity(this.entityList.head);
      }
    }
    get entities() {
      const entities = [];
      for (let entity = this.entityList.head; entity; entity = entity.next) {
        entities[entities.length] = entity;
      }
      return entities;
    }
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
    releaseNodeList(nodeClass) {
      if (this.families.has(nodeClass)) {
        this.families.get(nodeClass).cleanUp();
      }
      this.families.delete(nodeClass);
    }
    addSystem(system, priority) {
      system.priority = priority;
      system.addToEngine(this);
      this.systemList.add(system);
    }
    getSystem(type) {
      return this.systemList.get(type);
    }
    get systems() {
      const systems = [];
      for (let system = this.systemList.head; system; system = system.next) {
        systems[systems.length] = system;
      }
      return systems;
    }
    removeSystem(system) {
      this.systemList.remove(system);
      system.removeFromEngine(this);
    }
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
    update(time) {
      this.updating = true;
      for (let system = this.systemList.head; system; system = system.next) {
        system.update(time);
      }
      this.updating = false;
      this.updateComplete.dispatch();
    }
  }

  class Entity {
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
    add(component, componentClass = null) {
      if (!componentClass) {
        componentClass = component.constructor.prototype.constructor;
      }
      if (this.components.has(componentClass)) {
        this.remove(componentClass);
      }
      this.components.set(componentClass, component);
      this.componentAdded.dispatch(this, componentClass);
      return this;
    }
    remove(componentClass) {
      const component = this.components.get(componentClass);
      if (component) {
        this.components.delete(componentClass);
        this.componentRemoved.dispatch(this, componentClass);
        return component;
      }
      return null;
    }
    get(componentClass) {
      return this.components.get(componentClass);
    }
    getAll() {
      const componentArray = [];
      for (const value of this.components.values()) {
        componentArray[componentArray.length] = value;
      }
      return componentArray;
    }
    has(componentClass) {
      return this.components.has(componentClass);
    }
  }
  Entity.nameCount = 0;

  class Node {
    constructor() {
      this.previous = null;
      this.next = null;
    }
  }
  function keep(type) {
    return (target, propertyKey) => {
      const ctor = target.constructor;
      let map;
      const ashProp = '__ash_types__';
      if (ctor.hasOwnProperty(ashProp)) {
        map = ctor[ashProp];
      } else {
        map = {};
        Object.defineProperty(ctor, ashProp, {
          enumerable: true,
          get: () => map
        });
      }
      map[propertyKey] = type;
    };
  }

  class System {
    constructor() {
      this.previous = null;
      this.next = null;
      this.priority = 0;
    }
  }

  class ComponentInstanceProvider {
    constructor(instance) {
      this.instance = instance;
    }
    getComponent() {
      return this.instance;
    }
    get identifier() {
      return this.instance;
    }
  }

  class ComponentSingletonProvider {
    constructor(type) {
      this.componentType = type;
    }
    getComponent() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    }
    get identifier() {
      return this.getComponent();
    }
  }

  class ComponentTypeProvider {
    constructor(type) {
      this.componentType = type;
    }
    getComponent() {
      return new this.componentType();
    }
    get identifier() {
      return this.componentType;
    }
  }

  class DynamicComponentProvider {
    constructor(closure) {
      this.closure = closure;
    }
    getComponent() {
      return this.closure();
    }
    get identifier() {
      return this.closure;
    }
  }

  class StateComponentMapping {
    constructor(creatingState, type) {
      this.creatingState = creatingState;
      this.componentType = type;
      this.withType(type);
    }
    withInstance(component) {
      this.setProvider(new ComponentInstanceProvider(component));
      return this;
    }
    withType(type) {
      this.setProvider(new ComponentTypeProvider(type));
      return this;
    }
    withSingleton(type) {
      if (!type) {
        type = this.componentType;
      }
      this.setProvider(new ComponentSingletonProvider(type));
      return this;
    }
    withMethod(method) {
      this.setProvider(new DynamicComponentProvider(method));
      return this;
    }
    withProvider(provider) {
      this.setProvider(provider);
      return this;
    }
    add(type) {
      return this.creatingState.add(type);
    }
    setProvider(provider) {
      this.provider = provider;
      this.creatingState.providers.set(this.componentType, provider);
    }
  }

  class EntityState {
    constructor() {
      this.providers = new Map();
    }
    add(type) {
      return new StateComponentMapping(this, type);
    }
    get(type) {
      return this.providers.get(type) || null;
    }
    has(type) {
      return this.providers.has(type);
    }
  }

  class EntityStateMachine {
    constructor(entity) {
      this.entity = entity;
      this.states = {};
    }
    addState(name, state) {
      this.states[name] = state;
      return this;
    }
    createState(name) {
      const state = new EntityState();
      this.states[name] = state;
      return state;
    }
    changeState(name) {
      let newState = this.states[name];
      if (!newState) {
        throw new Error(`Entity state ${name} doesn't exist`);
      }
      if (newState === this.currentState) {
        newState = null;
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
  }

  class DynamicSystemProvider {
    constructor(method) {
      this.systemPriority = 0;
      this.method = method;
    }
    getSystem() {
      return this.method();
    }
    get identifier() {
      return this.method;
    }
    get priority() {
      return this.systemPriority;
    }
    set priority(value) {
      this.systemPriority = value;
    }
  }

  class StateSystemMapping {
    constructor(creatingState, provider) {
      this.creatingState = creatingState;
      this.provider = provider;
    }
    withPriority(priority) {
      this.provider.priority = priority;
      return this;
    }
    addInstance(system) {
      return this.creatingState.addInstance(system);
    }
    addSingleton(type) {
      return this.creatingState.addSingleton(type);
    }
    addMethod(method) {
      return this.creatingState.addMethod(method);
    }
    addProvider(provider) {
      return this.creatingState.addProvider(provider);
    }
  }

  class SystemInstanceProvider {
    constructor(instance) {
      this.systemPriority = 0;
      this.instance = instance;
    }
    getSystem() {
      return this.instance;
    }
    get identifier() {
      return this.instance;
    }
    get priority() {
      return this.systemPriority;
    }
    set priority(value) {
      this.systemPriority = value;
    }
  }

  class SystemSingletonProvider {
    constructor(type) {
      this.systemPriority = 0;
      this.componentType = type;
    }
    getSystem() {
      if (!this.instance) {
        this.instance = new this.componentType();
      }
      return this.instance;
    }
    get identifier() {
      return this.getSystem();
    }
    get priority() {
      return this.systemPriority;
    }
    set priority(value) {
      this.systemPriority = value;
    }
  }

  class EngineState {
    constructor() {
      this.providers = [];
    }
    addInstance(system) {
      return this.addProvider(new SystemInstanceProvider(system));
    }
    addSingleton(type) {
      return this.addProvider(new SystemSingletonProvider(type));
    }
    addMethod(method) {
      return this.addProvider(new DynamicSystemProvider(method));
    }
    addProvider(provider) {
      const mapping = new StateSystemMapping(this, provider);
      this.providers[this.providers.length] = provider;
      return mapping;
    }
  }

  class EngineStateMachine {
    constructor(engine) {
      this.engine = engine;
      this.states = {};
    }
    addState(name, state) {
      this.states[name] = state;
      return this;
    }
    createState(name) {
      const state = new EngineState();
      this.states[name] = state;
      return state;
    }
    changeState(name) {
      let newState = this.states[name];
      if (!newState) {
        throw new Error(`Engine state ${name} doesn't exist`);
      }
      if (newState === this.currentState) {
        newState = null;
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
  }

  class RAFTickProvider extends Signal1 {
    constructor() {
      super();
      this.rafId = 0;
      this.previousTime = 0;
      this.playing = false;
      this.update = () => {
        this.rafId = requestAnimationFrame(this.update);
        const time = Date.now();
        const second = 1000;
        this.dispatch((time - this.previousTime) / second);
        this.previousTime = time;
      };
    }
    start() {
      this.previousTime = Date.now();
      this.playing = true;
      this.rafId = requestAnimationFrame(this.update);
    }
    stop() {
      cancelAnimationFrame(this.rafId);
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
    static get(componentClass) {
      const pool = ComponentPool.getPool(componentClass);
      if (pool.length > 0) {
        return pool.pop();
      }
      return new componentClass();
    }
    static dispose(component) {
      if (component) {
        const type = component.constructor.prototype.constructor;
        const pool = ComponentPool.getPool(type);
        pool[pool.length] = component;
      }
    }
    static empty() {
      ComponentPool.pools = new Map();
    }
  }
  ComponentPool.pools = new Map();

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
