import { System } from '../core/System';
import { ISystemProvider } from './ISystemProvider';
export declare class SystemSingletonProvider<TSystem extends System> implements ISystemProvider<TSystem> {
    private componentType;
    private instance?;
    private systemPriority;
    constructor(type: {
        new (...args: any[]): TSystem;
    });
    getSystem(): TSystem;
    readonly identifier: any;
    priority: number;
}
