export declare type ClassType<T> = {
  new (...args: any[]): T;
};
export declare type NodeClassType<TNode> = {
  new (): TNode;
};
declare class ListenerNode<TListener> {
  previous: ListenerNode<TListener> | null;
  next: ListenerNode<TListener> | null;
  listener: TListener | null;
  once: boolean;
}
declare abstract class SignalBase<TListener> {
  protected head: ListenerNode<TListener> | null;
  protected tail: ListenerNode<TListener> | null;
  private nodes;
  private listenerNodePool;
  private toAddHead;
  private toAddTail;
  private dispatching;
  private pNumListeners;
  constructor();
  protected startDispatch(): void;
  protected endDispatch(): void;
  readonly numListeners: number;
  add(listener: TListener): void;
  addOnce(listener: TListener): void;
  protected addNode(node: ListenerNode<TListener>): void;
  remove(listener: TListener): void;
  removeAll(): void;
}
/**
 * Provides a fast signal for use where no parameters are dispatched with the signal.
 */
export declare class Signal0 extends SignalBase<() => void> {
  dispatch(): void;
}
/**
 * Provides a fast signal for use where one parameter is dispatched with the signal.
 */
export declare class Signal1<T> extends SignalBase<(a: T) => void> {
  dispatch(object: T): void;
}
/**
 * Provides a fast signal for use where two parameters are dispatched with the signal.
 */
export declare class Signal2<T1, T2> extends SignalBase<(a: T1, b: T2) => void> {
  dispatch(object1: T1, object2: T2): void;
}
/**
 * Provides a fast signal for use where three parameters are dispatched with the signal.
 */
export declare class Signal3<T1, T2, T3> extends SignalBase<(a: T1, b: T2, c: T3) => void> {
  dispatch(object1: T1, object2: T2, object3: T3): void;
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
export declare class Entity {
  private static nameCount;
  /**
   * Optional, give the entity a name. This can help with debugging and with serialising the entity.
   */
  private pName;
  /**
   * This signal is dispatched when a component is added to the entity.
   */
  componentAdded: Signal2<Entity, ClassType<any>>;
  /**
   * This signal is dispatched when a component is removed from the entity.
   */
  componentRemoved: Signal2<Entity, ClassType<any>>;
  /**
   * Dispatched when the name of the entity changes. Used internally by the engine to track entities based on their names.
   */
  nameChanged: Signal2<Entity, string>;
  previous: Entity | null;
  next: Entity | null;
  components: Map<ClassType<any>, any>;
  /**
   * The constructor
   *
   * @param name The name for the entity. If left blank, a default name is assigned with the form _entityN where N is an integer.
   */
  constructor(name?: string);
  /**
   * All entities have a name. If no name is set, a default name is used. Names are used to
   * fetch specific entities from the engine, and can also help to identify an entity when debugging.
   */
  name: string;
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
  add<T>(component: T, componentClass?: ClassType<T> | null): this;
  /**
   * Remove a component from the entity.
   *
   * @param componentClass The class of the component to be removed.
   * @return the component, or null if the component doesn't exist in the entity
   */
  remove<T>(componentClass: ClassType<T>): T | null;
  /**
   * Get a component from the entity.
   *
   * @param componentClass The class of the component requested.
   * @return The component, or null if none was found.
   */
  get<T>(componentClass: ClassType<T>): T | null;
  /**
   * Get all components from the entity.
   *
   * @return An array containing all the components that are on the entity.
   */
  getAll(): any[];
  /**
   * Does the entity have a component of a particular type.
   *
   * @param componentClass The class of the component sought.
   * @return true if the entity has a component of the type, false if not.
   */
  has<T>(componentClass: ClassType<T>): boolean;
}
/**
 * The base class for a node.
 *
 * <p>A node is a set of different components that are required by a system.
 * A system can request a collection of nodes from the engine. Subsequently the Engine object creates
 * a node for every entity that has all of the components in the node class and adds these nodes
 * to the list obtained by the system. The engine keeps the list up to date as entities are added
 * to and removed from the engine and as the components on entities change.</p>
 */
export abstract class Node<TNode> {
  /**
   * The entity whose components are included in the node.
   */
  entity: Entity;
  /**
   * Used by the NodeList class. The previous node in a node list.
   */
  previous: TNode | null;
  /**
   * Used by the NodeList class. The next node in a node list.
   */
  next: TNode | null;
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
export declare class NodeList<TNode extends Node<TNode>> {
  /**
   * The first item in the node list, or null if the list contains no nodes.
   */
  head: TNode | null;
  /**
   * The last item in the node list, or null if the list contains no nodes.
   */
  tail: TNode | null;
  /**
   * A signal that is dispatched whenever a node is added to the node list.
   *
   * <p>The signal will pass a single parameter to the listeners - the node that was added.</p>
   */
  nodeAdded: Signal1<TNode>;
  /**
   * A signal that is dispatched whenever a node is removed from the node list.
   *
   * <p>The signal will pass a single parameter to the listeners - the node that was removed.</p>
   */
  nodeRemoved: Signal1<TNode>;
  constructor();
  add(node: TNode): void;
  remove(node: TNode): void;
  removeAll(): void;
  /**
   * true if the list is empty, false otherwise.
   */
  readonly empty: boolean;
  /**
   * Swaps the positions of two nodes in the list. Useful when sorting a list.
   */
  swap(node1: TNode, node2: TNode): void;
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
  insertionSort(sortFunction: (a: TNode, b: TNode) => number): void;
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
  mergeSort(sortFunction: (a: TNode, b: TNode) => number): void;
  private merge;
}
/**
 * The interface for classes that are used to manage NodeLists (set as the familyClass property
 * in the Engine object). Most developers don't need to use this since the default implementation
 * is used by default and suits most needs.
 */
export interface IFamily<TNode extends Node<any>> {
  /**
   * Returns the NodeList managed by this class. This should be a reference that remains valid always
   * since it is retained and reused by Systems that use the list. i.e. never recreate the list,
   * always modify it in place.
   */
  nodeList: NodeList<TNode>;
  /**
   * An entity has been added to the engine. It may already have components so test the entity
   * for inclusion in this family's NodeList.
   */
  newEntity(entity: Entity): void;
  /**
   * An entity has been removed from the engine. If it's in this family's NodeList it should be removed.
   */
  removeEntity(entity: Entity): void;
  /**
   * A component has been added to an entity. Test whether the entity's inclusion in this family's
   * NodeList should be modified.
   */
  componentAddedToEntity(entity: Entity, componentClass: ClassType<any>): void;
  /**
   * A component has been removed from an entity. Test whether the entity's inclusion in this family's
   * NodeList should be modified.
   */
  componentRemovedFromEntity(entity: Entity, componentClass: ClassType<any>): void;
  /**
   * The family is about to be discarded. Clean up all properties as necessary. Usually, you will
   * want to empty the NodeList at this time.
   */
  cleanUp(): void;
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
export abstract class System {
  /**
   * Used internally to manage the list of systems within the engine. The previous system in the list.
   */
  previous: System | null;
  /**
   * Used internally to manage the list of systems within the engine. The next system in the list.
   */
  next: System | null;
  /**
   * Used internally to hold the priority of this system within the system list. This is
   * used to order the systems so they are updated in the correct order.
   */
  priority: number;
  /**
   * Called just after the system is added to the engine, before any calls to the update method.
   * Override this method to add your own functionality.
   *
   * @param engine The engine the system was added to.
   */
  abstract addToEngine(engine: Engine): void;
  /**
   * Called just after the system is removed from the engine, after all calls to the update method.
   * Override this method to add your own functionality.
   *
   * @param engine The engine the system was removed from.
   */
  abstract removeFromEngine(engine: Engine): void;
  /**
   * After the system is added to the engine, this method is called every frame until the system
   * is removed from the engine. Override this method to add your own functionality.
   *
   * <p>If you need to perform an action outside of the update loop (e.g. you need to change the
   * systems in the engine and you don't want to do it while they're updating) add a listener to
   * the engine's updateComplete signal to be notified when the update loop completes.</p>
   *
   * @param time The duration, in seconds, of the frame.
   */
  abstract update(time: number): void;
}
/**
 * The Engine class is the central point for creating and managing your game state. Add
 * entities and systems to the engine, and fetch families of nodes from the engine.
 */
export declare class Engine {
  private entityNames;
  private entityList;
  private systemList;
  private families;
  /**
   * Indicates if the engine is currently in its update loop.
   */
  updating: boolean;
  /**
   * Dispatched when the update loop ends. If you want to add and remove systems from the
   * engine it is usually best not to do so during the update loop. To avoid this you can
   * listen for this signal and make the change when the signal is dispatched.
   */
  updateComplete: Signal0;
  /**
   * The class used to manage node lists. In most cases the default class is sufficient
   * but it is exposed here so advanced developers can choose to create and use a
   * different implementation.
   *
   * The class must implement the Family interface.
   */
  familyClass: ClassType<IFamily<any>>;
  constructor();
  /**
   * Add an entity to the engine.
   *
   * @param entity The entity to add.
   */
  addEntity(entity: Entity): void;
  /**
   * Remove an entity from the engine.
   *
   * @param entity The entity to remove.
   */
  removeEntity(entity: Entity): void;
  private entityNameChanged;
  /**
   * Get an entity based n its name.
   *
   * @param name The name of the entity
   * @return The entity, or null if no entity with that name exists on the engine
   */
  getEntityByName(name: string): Entity | null;
  /**
   * Remove all entities from the engine.
   */
  removeAllEntities(): void;
  /**
   * Returns an array containing all the entities in the engine.
   */
  readonly entities: Entity[];
  /**
   * @private
   */
  private componentAdded;
  /**
   * @private
   */
  private componentRemoved;
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
  getNodeList<TNode extends Node<any>>(nodeClass: NodeClassType<TNode>): NodeList<TNode>;
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
  releaseNodeList<TNode extends Node<TNode>>(nodeClass: NodeClassType<TNode>): void;
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
  addSystem(system: System, priority: number): void;
  /**
   * Get the system instance of a particular type from within the engine.
   *
   * @param type The type of system
   * @return The instance of the system type that is in the engine, or
   * null if no systems of this type are in the engine.
   */
  getSystem<TSystem extends System>(type: ClassType<TSystem>): TSystem | null;
  /**
   * Returns an array containing all the systems in the engine.
   */
  readonly systems: System[];
  /**
   * Remove a system from the engine.
   *
   * @param system The system to remove from the engine.
   */
  removeSystem(system: System): void;
  /**
   * Remove all systems from the engine.
   */
  removeAllSystems(): void;
  /**
   * Update the engine. This causes the engine update loop to run, calling update on all the
   * systems in the engine.
   *
   * <p>The package net.richardlord.ash.tick contains classes that can be used to provide
   * a steady or variable tick that calls this update method.</p>
   *
   * @time The duration, in seconds, of this update step.
   */
  update(time: number): void;
}
/**
 * The default class for managing a NodeList. This class creates the NodeList and adds and removes
 * nodes to/from the list as the entities and the components in the engine change.
 *
 * It uses the basic entity matching pattern of an entity system - entities are added to the list if
 * they contain components matching all the public properties of the node class.
 */
export declare class ComponentMatchingFamily<TNode extends Node<TNode>> implements IFamily<TNode> {
  private nodes;
  private entities;
  private nodeClass;
  components: Map<ClassType<any>, string>;
  private nodePool;
  private engine;
  /**
   * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
   * given node class.
   *
   * @param nodeClass The type of node to create and manage a NodeList for.
   * @param engine The engine that this family is managing teh NodeList for.
   */
  constructor(nodeClass: NodeClassType<TNode>, engine: Engine);
  /**
   * The nodelist managed by this family. This is a reference that remains valid always
   * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
   * we always modify it in place.
   */
  readonly nodeList: NodeList<TNode>;
  /**
   * Called by the engine when an entity has been added to it. We check if the entity should be in
   * this family's NodeList and add it if appropriate.
   */
  newEntity(entity: Entity): void;
  /**
   * Called by the engine when a component has been added to an entity. We check if the entity is not in
   * this family's NodeList and should be, and add it if appropriate.
   */
  componentAddedToEntity(entity: Entity, componentClass: ClassType<any>): void;
  /**
   * Called by the engine when a component has been removed from an entity. We check if the removed component
   * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
   * remove it if so.
   */
  componentRemovedFromEntity(entity: Entity, componentClass: ClassType<any>): void;
  /**
   * Called by the engine when an entity has been rmoved from it. We check if the entity is in
   * this family's NodeList and remove it if so.
   */
  removeEntity(entity: Entity): void;
  /**
   * If the entity is not in this family's NodeList, tests the components of the entity to see
   * if it should be in this NodeList and adds it if so.
   */
  private addIfMatch;
  /**
   * Removes the entity if it is in this family's NodeList.
   */
  private removeIfMatch;
  /**
   * Releases the nodes that were added to the node pool during this engine update, so they can
   * be reused.
   */
  private releaseNodePoolCache;
  /**
   * Removes all nodes from the NodeList.
   */
  cleanUp(): void;
}
export declare function keep(type: ClassType<any>): PropertyDecorator;
/**
 * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
 * from object creation and garbage collection.
 *
 * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
 * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
 * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
 */
export declare class NodePool<TNode extends Node<TNode>> {
  private tail;
  private nodeClass;
  private cacheTail;
  private components;
  /**
   * Creates a pool for the given node class.
   */
  constructor(nodeClass: NodeClassType<TNode>, components: Map<ClassType<any>, string>);
  /**
   * Fetches a node from the pool.
   */
  get(): TNode;
  /**
   * Adds a node to the pool.
   */
  dispose(node: TNode): void;
  /**
   * Adds a node to the cache
   */
  cache(node: TNode): void;
  /**
   * Releases all nodes from the cache into the pool
   */
  releaseCache(): void;
}
/**
 * This is the Interface for component providers. Component providers are used to supply components
 * for states within an EntityStateMachine. Ash includes three standard component providers,
 * ComponentTypeProvider, ComponentInstanceProvider and ComponentSingletonProvider. Developers
 * may wish to create more.
 */
export interface IComponentProvider<TComponent> {
  /**
   * Used to request a component from the provider.
   *
   * @return A component for use in the state that the entity is entering
   */
  getComponent(): TComponent;
  /**
   * Returns an identifier that is used to determine whether two component providers will
   * return the equivalent components.
   *
   * <p>If an entity is changing state and the state it is leaving and the state is is
   * entering have components of the same type, then the identifiers of the component
   * provders are compared. If the two identifiers are the same then the component
   * is not removed. If they are different, the component from the old state is removed
   * and a component for the new state is added.</p>
   *
   * @return An object
   */
  identifier: any;
}
declare class StateComponentMapping<TComponent> {
  private componentType;
  private creatingState;
  private provider;
  /**
   * Used internally, the constructor creates a component mapping. The constructor
   * creates a ComponentTypeProvider as the default mapping, which will be replaced
   * by more specific mappings if other methods are called.
   *
   * @param creatingState The EntityState that the mapping will belong to
   * @param type The component type for the mapping
   */
  constructor(creatingState: EntityState, type: ClassType<TComponent>);
  /**
   * Creates a mapping for the component type to a specific component instance. A
   * ComponentInstanceProvider is used for the mapping.
   *
   * @param component The component instance to use for the mapping
   * @return This ComponentMapping, so more modifications can be applied
   */
  withInstance(component: TComponent): this;
  /**
   * Creates a mapping for the component type to new instances of the provided type.
   * The type should be the same as or extend the type for this mapping. A ComponentTypeProvider
   * is used for the mapping.
   *
   * @param type The type of components to be created by this mapping
   * @return This ComponentMapping, so more modifications can be applied
   */
  withType(type: ClassType<TComponent>): this;
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
  withSingleton(type?: ClassType<any>): this;
  /**
   * Creates a mapping for the component type to a method call. A
   * DynamicComponentProvider is used for the mapping.
   *
   * @param method The method to return the component instance
   * @return This ComponentMapping, so more modifications can be applied
   */
  withMethod(method: () => TComponent): this;
  /**
   * Creates a mapping for the component type to any ComponentProvider.
   *
   * @param provider The component provider to use.
   * @return This ComponentMapping, so more modifications can be applied.
   */
  withProvider(provider: IComponentProvider<TComponent>): this;
  /**
   * Maps through to the add method of the EntityState that this mapping belongs to
   * so that a fluent interface can be used when configuring entity states.
   *
   * @param type The type of component to add a mapping to the state for
   * @return The new ComponentMapping for that type
   */
  add<TNextComponent>(type: ClassType<TNextComponent>): StateComponentMapping<TNextComponent>;
  private setProvider;
}
declare class EntityState {
  /**
   * @private
   */
  providers: Map<ClassType<any>, IComponentProvider<any>>;
  /**
   * Add a new ComponentMapping to this state. The mapping is a utility class that is used to
   * map a component type to the provider that provides the component.
   *
   * @param type The type of component to be mapped
   * @return The component mapping to use when setting the provider for the component
   */
  add<TComponent>(type: ClassType<TComponent>): StateComponentMapping<TComponent>;
  /**
   * Get the ComponentProvider for a particular component type.
   *
   * @param type The type of component to get the provider for
   * @return The ComponentProvider
   */
  get<TComponent>(type: ClassType<TComponent>): IComponentProvider<TComponent> | null;
  /**
   * To determine whether this state has a provider for a specific component type.
   *
   * @param type The type of component to look for a provider for
   * @return true if there is a provider for the given type, false otherwise
   */
  has<TComponent>(type: ClassType<TComponent>): boolean;
}
/**
 * This is a state machine for an entity. The state machine manages a set of states,
 * each of which has a set of component providers. When the state machine changes the state, it removes
 * components associated with the previous state and adds components associated with the new state.
 */
export declare class EntityStateMachine {
  private states;
  /**
   * The current state of the state machine.
   */
  private currentState?;
  /**
   * The entity whose state machine this is
   */
  entity: Entity;
  /**
   * Constructor. Creates an EntityStateMachine.
   */
  constructor(entity: Entity);
  /**
   * Add a state to this state machine.
   *
   * @param name The name of this state - used to identify it later in the changeState method call.
   * @param state The state.
   * @return This state machine, so methods can be chained.
   */
  addState(name: string, state: EntityState): this;
  /**
   * Create a new state in this state machine.
   *
   * @param name The name of the new state - used to identify it later in the changeState method call.
   * @return The new EntityState object that is the state. This will need to be configured with
   * the appropriate component providers.
   */
  createState(name: string): EntityState;
  /**
   * Change to a new state. The components from the old state will be removed and the components
   * for the new state will be added.
   *
   * @param name The name of the state to change to.
   */
  changeState(name: string): void;
  getStateNames(): string[];
}
export interface ISystemProvider<TSystem extends System> {
  getSystem(): TSystem;
  identifier: any;
  priority: number;
}
declare class StateSystemMapping<TSystem extends System> {
  private creatingState;
  private provider;
  /**
   * Used internally, the constructor creates a component mapping. The constructor
   * creates a SystemSingletonProvider as the default mapping, which will be replaced
   * by more specific mappings if other methods are called.
   *
   * @param creatingState The SystemState that the mapping will belong to
   * @param provider The System type for the mapping
   */
  constructor(creatingState: EngineState, provider: ISystemProvider<TSystem>);
  /**
   * Applies the priority to the provider that the System will be.
   *
   * @param priority The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  withPriority(priority: number): StateSystemMapping<TSystem>;
  /**
   * Creates a mapping for the System type to a specific System instance. A
   * SystemInstanceProvider is used for the mapping.
   *
   * @param system The System instance to use for the mapping
   * @return This StateSystemMapping, so more modifications can be applied
   */
  addInstance(system: TSystem): StateSystemMapping<TSystem>;
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
  addSingleton(type: ClassType<TSystem>): StateSystemMapping<TSystem>;
  /**
   * Creates a mapping for the System type to a method call.
   * The method should return a System instance. A DynamicSystemProvider is used for
   * the mapping.
   *
   * @param method The method to provide the System instance.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  addMethod(method: () => TSystem): StateSystemMapping<TSystem>;
  /**
   * Maps through to the addProvider method of the SystemState that this mapping belongs to
   * so that a fluent interface can be used when configuring entity states.
   *
   * @param provider The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  addProvider(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
declare class EngineState {
  providers: ISystemProvider<any>[];
  /**
   * Creates a mapping for the System type to a specific System instance. A
   * SystemInstanceProvider is used for the mapping.
   *
   * @param system The System instance to use for the mapping
   * @return This StateSystemMapping, so more modifications can be applied
   */
  addInstance<TSystem extends System>(system: TSystem): StateSystemMapping<TSystem>;
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
  addSingleton<TSystem extends System>(type: ClassType<TSystem>): StateSystemMapping<TSystem>;
  /**
   * Creates a mapping for the System type to a method call.
   * The method should return a System instance. A DynamicSystemProvider is used for
   * the mapping.
   *
   * @param method The method to provide the System instance.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  addMethod<TSystem extends System>(method: () => TSystem): StateSystemMapping<TSystem>;
  /**
   * Adds any SystemProvider.
   *
   * @param provider The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  addProvider<TSystem extends System>(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
/**
 * This is a state machine for the Engine. The state machine manages a set of states,
 * each of which has a set of System providers. When the state machine changes the state, it removes
 * Systems associated with the previous state and adds Systems associated with the new state.
 */
export declare class EngineStateMachine {
  engine: Engine;
  private states;
  private currentState?;
  /**
   * Constructor. Creates an SystemStateMachine.
   */
  constructor(engine: Engine);
  /**
   * Add a state to this state machine.
   *
   * @param name The name of this state - used to identify it later in the changeState method call.
   * @param state The state.
   * @return This state machine, so methods can be chained.
   */
  addState(name: string, state: EngineState): this;
  /**
   * Create a new state in this state machine.
   *
   * @param name The name of the new state - used to identify it later in the changeState method call.
   * @return The new EntityState object that is the state. This will need to be configured with
   * the appropriate component providers.
   */
  createState(name: string): EngineState;
  /**
   * Change to a new state. The Systems from the old state will be removed and the Systems
   * for the new state will be added.
   *
   * @param name The name of the state to change to.
   */
  changeState(name: string): void;
  getStateNames(): string[];
}
/**
 * The interface for a tick provider. A tick provider dispatches a regular update tick
 * to act as the heartbeat for the engine. It has methods to start and stop the tick and
 * to add and remove listeners for the tick.
 */
export interface ITickProvider {
  readonly playing: boolean;
  add(listener: (delta: number) => void): void;
  remove(listener: (delta: number) => void): void;
  start(): void;
  stop(): void;
}
export declare class RAFTickProvider extends Signal1<number> implements ITickProvider {
  private rafId;
  private previousTime;
  start(): void;
  private update;
  stop(): void;
  readonly playing: boolean;
}
export declare class IntervalTickProvider extends Signal1<number> implements ITickProvider {
  private intervalId;
  private previousTime;
  private pInterval;
  constructor(interval?: number);
  start(): void;
  private update;
  stop(): void;
  interval: number;
  readonly inteval: number;
  readonly playing: boolean;
}
export declare class ComponentPool {
  private static pools;
  private static getPool;
  /**
   * Get an object from the pool.
   *
   * @param componentClass The type of component wanted.
   * @return The component.
   */
  static get<T>(componentClass: ClassType<T>): T;
  /**
   * Return an object to the pool for reuse.
   *
   * @param component The component to return to the pool.
   */
  static dispose<T>(component: T): void;
  /**
   * Dispose of all pooled resources, freeing them for garbage collection.
   */
  static empty(): void;
}
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
  protected nodeList: NodeList<TNode> | null;
  protected nodeClass: NodeClassType<TNode>;
  protected nodeAdded?: (node: Node<TNode>) => void;
  protected nodeRemoved?: (node: Node<TNode>) => void;
  constructor(nodeClass: NodeClassType<TNode>);
  addToEngine(engine: Engine): void;
  removeFromEngine(engine: Engine): void;
  update(time: number): void;
  abstract updateNode(node: Node<TNode>, delta: number): void;
}

export as namespace ash;
