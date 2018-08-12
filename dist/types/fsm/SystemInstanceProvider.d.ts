import { ISystemProvider } from './ISystemProvider';
import { System } from '../core/System';
export declare class SystemInstanceProvider<TSystem extends System> implements ISystemProvider<TSystem> {
    private instance;
    private systemPriority;
    constructor(instance: TSystem);
    getSystem(): TSystem;
    readonly identifier: any;
    priority: number;
}
