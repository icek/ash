import { Dictionary } from '../Dictionary';
import { Engine } from './Engine';
import { Entity } from './Entity';
import { IFamily } from './IFamily';
import { Node } from './Node';
import { NodeList } from './NodeList';
import { ClassType } from '../Types';
export declare class ComponentMatchingFamily<TNode extends Node<any>> implements IFamily<TNode> {
    private nodes;
    private entities;
    private nodeClass;
    components: Dictionary<ClassType<any>, string>;
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
