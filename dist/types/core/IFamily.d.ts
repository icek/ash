import { Entity } from './Entity';
import { Node } from './Node';
import { NodeList } from './NodeList';
import { ClassType } from '../Types';
export interface IFamily<TNode extends Node<any>> {
    nodeList: NodeList<TNode>;
    newEntity(entity: Entity): void;
    removeEntity(entity: Entity): void;
    componentAddedToEntity(entity: Entity, componentClass: ClassType<any>): void;
    componentRemovedFromEntity(entity: Entity, componentClass: ClassType<any>): void;
    cleanUp(): void;
}
