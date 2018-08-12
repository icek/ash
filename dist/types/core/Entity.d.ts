import { Signal2 } from '../signals/Signal2';
import { Dictionary } from '../Dictionary';
import { ClassType } from '../Types';
export declare class Entity {
    private static nameCount;
    private _name;
    componentAdded: Signal2<Entity, ClassType<any>>;
    componentRemoved: Signal2<Entity, ClassType<any>>;
    nameChanged: Signal2<Entity, string>;
    previous: Entity | null;
    next: Entity | null;
    components: Dictionary<ClassType<any>, any>;
    constructor(name?: string);
    name: string;
    add<T>(component: T, componentClass?: ClassType<T> | null): this;
    remove<T>(componentClass: ClassType<T>): T | null;
    get<T>(componentClass: ClassType<T>): T;
    getAll(): any[];
    has<T>(componentClass: ClassType<T>): boolean;
}
