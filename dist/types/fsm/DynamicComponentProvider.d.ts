import { IComponentProvider } from './IComponentProvider';
export declare class DynamicComponentProvider<TComponent> implements IComponentProvider<TComponent> {
    private _closure;
    constructor(closure: () => TComponent);
    getComponent(): TComponent;
    readonly identifier: any;
}
