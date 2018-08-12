import { ISystemProvider } from './ISystemProvider';
import { StateSystemMapping } from './StateSystemMapping';
import { System } from '../core/System';
export declare class EngineState {
    providers: ISystemProvider<any>[];
    addInstance<TSystem extends System>(system: TSystem): StateSystemMapping<TSystem>;
    addSingleton<TSystem extends System>(type: {
        new (...args: any[]): TSystem;
    }): StateSystemMapping<TSystem>;
    addMethod<TSystem extends System>(method: () => TSystem): StateSystemMapping<TSystem>;
    addProvider<TSystem extends System>(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
