import { Entity } from './Entity';
export declare class EntityList {
    head: Entity | null;
    tail: Entity | null;
    add(entity: Entity): void;
    remove(entity: Entity): void;
    removeAll(): void;
}
