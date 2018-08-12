import { EngineState } from './EngineState';
import { ISystemProvider } from './ISystemProvider';
import { System } from '../core/System';
export declare class StateSystemMapping<TSystem extends System> {
    private creatingState;
    private provider;
    constructor(creatingState: EngineState, provider: ISystemProvider<TSystem>);
    withPriority(priority: number): StateSystemMapping<TSystem>;
    addInstance(system: TSystem): StateSystemMapping<TSystem>;
    addSingleton(type: {
        new (...args: any[]): TSystem;
    }): StateSystemMapping<TSystem>;
    addMethod(method: () => TSystem): StateSystemMapping<TSystem>;
    addProvider(provider: ISystemProvider<TSystem>): StateSystemMapping<TSystem>;
}
