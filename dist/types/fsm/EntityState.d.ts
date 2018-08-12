import { IComponentProvider } from './IComponentProvider';
import { StateComponentMapping } from './StateComponentMapping';
import { Dictionary } from '../Dictionary';
import { ClassType } from '../Types';
export declare class EntityState {
    providers: Dictionary<ClassType<any>, IComponentProvider<any>>;
    add<TComponent>(type: ClassType<TComponent>): StateComponentMapping<TComponent>;
    get<TComponent>(type: ClassType<TComponent>): IComponentProvider<TComponent> | null;
    has<TComponent>(type: ClassType<TComponent>): boolean;
}
