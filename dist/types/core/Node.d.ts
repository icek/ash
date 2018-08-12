import { Entity } from './Entity';
import { ClassType } from '../Types';
export declare class Node<TNode> {
    entity: Entity;
    previous: TNode | null;
    next: TNode | null;
}
export declare function keep(type: ClassType<any>): Function;
