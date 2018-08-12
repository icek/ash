import { Entity } from '../core/Entity';
import { EntityState } from './EntityState';
export declare class EntityStateMachine {
    private states;
    private currentState?;
    entity: Entity;
    constructor(entity: Entity);
    addState(name: string, state: EntityState): this;
    createState(name: string): EntityState;
    changeState(name: string): void;
}
