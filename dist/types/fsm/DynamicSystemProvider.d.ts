import { ISystemProvider } from './ISystemProvider';
import { System } from '../core/System';
export declare class DynamicSystemProvider<TSystem extends System> implements ISystemProvider<TSystem> {
    private method;
    private systemPriority;
    constructor(method: () => TSystem);
    getSystem(): TSystem;
    readonly identifier: any;
    priority: number;
}
