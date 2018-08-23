export declare type ClassType<T> = {
	new (...args: any[]): T;
};
declare class ListenerNode<TListener> {
	previous: ListenerNode<TListener> | null;
	next: ListenerNode<TListener> | null;
	listener: TListener | null;
	once: boolean;
}
declare class SignalBase<TListener> {
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
export declare class Signal0 extends SignalBase<() => void> {
	dispatch(): void;
}
export declare class Signal1<T> extends SignalBase<(a: T) => void> {
	dispatch(object: T): void;
}
export declare class Signal2<T1, T2> extends SignalBase<(a: T1, b: T2) => void> {
	dispatch(object1: T1, object2: T2): void;
}
export declare class Signal3<T1, T2, T3> extends SignalBase<(a: T1, b: T2, c: T3) => void> {
	dispatch(object1: T1, object2: T2, object3: T3): void;
}
export declare class Entity {
	private static nameCount;
	private pName;
	componentAdded: Signal2<Entity, ClassType<any>>;
	componentRemoved: Signal2<Entity, ClassType<any>>;
	nameChanged: Signal2<Entity, string>;
	previous: Entity | null;
	next: Entity | null;
	components: Map<ClassType<any>, any>;
	constructor(name?: string);
	name: string;
	add<T>(component: T, componentClass?: ClassType<T> | null): this;
	remove<T>(componentClass: ClassType<T>): T | null;
	get<T>(componentClass: ClassType<T>): T;
	getAll(): any[];
	has<T>(componentClass: ClassType<T>): boolean;
}
export declare class Node<TNode> {
	entity: Entity;
	previous: TNode | null;
	next: TNode | null;
}
export declare function keep(type: ClassType<any>): Function;
export declare class NodeList<TNode extends Node<any>> {
	head: TNode | null;
	tail: TNode | null;
	nodeAdded: Signal1<TNode>;
	nodeRemoved: Signal1<TNode>;
	constructor();
	add(node: TNode): void;
	remove(node: TNode): void;
	removeAll(): void;
	readonly empty: boolean;
	swap(node1: TNode, node2: TNode): void;
	insertionSort(sortFunction: Function): void;
	mergeSort(sortFunction: (a: TNode, b: TNode) => number): void;
	private merge;
}
export declare abstract class System {
	previous: System | null;
	next: System | null;
	priority: number;
	abstract addToEngine(engine: Engine): void;
	abstract removeFromEngine(engine: Engine): void;
	abstract update(time: number): void;
}
export declare class Engine {
	private entityNames;
	private entityList;
	private systemList;
	private families;
	updating: boolean;
	updateComplete: Signal0;
	familyClass: any;
	constructor();
	addEntity(entity: Entity): void;
	removeEntity(entity: Entity): void;
	private entityNameChanged;
	getEntityByName(name: string): Entity | null;
	removeAllEntities(): void;
	readonly entities: Entity[];
	private componentAdded;
	private componentRemoved;
	getNodeList<TNode extends Node<any>>(nodeClass: {
		new (): TNode;
	}): NodeList<TNode>;
	releaseNodeList<TNode extends Node<any>>(nodeClass: {
		new (): TNode;
	}): void;
	addSystem(system: System, priority: number): void;
	getSystem<TSystem extends System>(type: ClassType<TSystem>): TSystem | null;
	readonly systems: System[];
	removeSystem(system: System): void;
	removeAllSystems(): void;
	update(time: number): void;
}
export interface IFamily<TNode extends Node<any>> {
	nodeList: NodeList<TNode>;
	newEntity(entity: Entity): void;
	removeEntity(entity: Entity): void;
	componentAddedToEntity(entity: Entity, componentClass: ClassType<any>): void;
	componentRemovedFromEntity(entity: Entity, componentClass: ClassType<any>): void;
	cleanUp(): void;
}
export declare class ComponentMatchingFamily<TNode extends Node<any>> implements IFamily<TNode> {
	private nodes;
	private entities;
	private nodeClass;
	components: Map<ClassType<any>, string>;
	private nodePool;
	private engine;
	constructor(nodeClass: {
		new (): TNode;
	}, engine: Engine);
	private init;
	readonly nodeList: NodeList<TNode>;
	newEntity(entity: Entity): void;
	componentAddedToEntity(entity: Entity, componentClass: ClassType<any>): void;
	componentRemovedFromEntity(entity: Entity, componentClass: ClassType<any>): void;
	removeEntity(entity: Entity): void;
	private addIfMatch;
	private removeIfMatch;
	private releaseNodePoolCache;
	cleanUp(): void;
}
export declare class NodePool<TNode extends Node<any>> {
	private tail;
	private nodeClass;
	private cacheTail;
	private components;
	constructor(nodeClass: {
		new (): TNode;
	}, components: Map<ClassType<any>, string>);
	get(): TNode;
	dispose(node: TNode): void;
	cache(node: TNode): void;
	releaseCache(): void;
}
export interface IComponentProvider<TComponent> {
	getComponent(): TComponent;
	identifier: any;
}
declare class StateComponentMapping<TComponent> {
	private componentType;
	private creatingState;
	private provider;
	constructor(creatingState: EntityState, type: ClassType<TComponent>);
	withInstance(component: TComponent): this;
	withType(type: ClassType<TComponent>): this;
	withSingleton(type?: ClassType<any>): this;
	withMethod(method: () => TComponent): this;
	withProvider(provider: IComponentProvider<TComponent>): this;
	add<TNextComponent>(type: ClassType<TNextComponent>): StateComponentMapping<TNextComponent>;
	private setProvider;
}
declare class EntityState {
	providers: Map<ClassType<any>, IComponentProvider<any>>;
	add<TComponent>(type: ClassType<TComponent>): StateComponentMapping<TComponent>;
	get<TComponent>(type: ClassType<TComponent>): IComponentProvider<TComponent> | null;
	has<TComponent>(type: ClassType<TComponent>): boolean;
}
export declare class EntityStateMachine {
	private states;
	private currentState?;
	entity: Entity;
	constructor(entity: Entity);
	addState(name: string, state: EntityState): this;
	createState(name: string): EntityState;
	changeState(name: string): void;
}
export interface ISystemProvider<TSystem extends System> {
	getSystem(): TSystem;
	identifier: any;
	priority: number;
}
declare class StateSystemMapping<TSystem extends System> {
	private creatingState;
	private provider;
	constructor(creatingState: EngineState, provider: ISystemProvider<TSystem>);
	withPriority(priority: number): StateSystemMapping<TSystem>;
	addInstance(system: TSystem): StateSystemMapping<TSystem>;
	addSingleton(type: ClassType<TSystem>): StateSystemMapping<TSystem>;
	addMethod(method: () => TSystem): StateSystemMapping<TSystem>;
	addProvider(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
declare class EngineState {
	providers: ISystemProvider<any>[];
	addInstance<TSystem extends System>(system: TSystem): StateSystemMapping<TSystem>;
	addSingleton<TSystem extends System>(type: ClassType<TSystem>): StateSystemMapping<TSystem>;
	addMethod<TSystem extends System>(method: () => TSystem): StateSystemMapping<TSystem>;
	addProvider<TSystem extends System>(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
export declare class EngineStateMachine {
	engine: Engine;
	private states;
	private currentState?;
	constructor(engine: Engine);
	addState(name: string, state: EngineState): this;
	createState(name: string): EngineState;
	changeState(name: string): void;
}
export interface ITickProvider {
	playing: boolean;
	add(listener: (delta: number) => void): void;
	remove(listener: (delta: number) => void): void;
	start(): void;
	stop(): void;
}
export declare class RAFTickProvider extends Signal1<number> implements ITickProvider {
	private rafId;
	private previousTime;
	playing: boolean;
	constructor();
	start(): void;
	private update;
	stop(): void;
}
export declare class ComponentPool {
	private static pools;
	private static getPool;
	static get<T>(componentClass: {
		new (): T;
	}): T;
	static dispose<T>(component: T): void;
	static empty(): void;
}
export declare abstract class ListIteratingSystem<TNode extends Node<any>> extends System {
	protected nodeList: NodeList<TNode> | null;
	protected nodeClass: {
		new (): TNode;
	};
	protected nodeAdded?: (node: Node<TNode>) => void;
	protected nodeRemoved?: (node: Node<TNode>) => void;
	constructor(nodeClass: {
		new (): TNode;
	});
	addToEngine(engine: Engine): void;
	removeFromEngine(engine: Engine): void;
	update(time: number): void;
	abstract updateNode(node: Node<TNode>, delta: number): void;
}

export as namespace ash;
