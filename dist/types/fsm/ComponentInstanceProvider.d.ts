import { IComponentProvider } from './IComponentProvider';
export declare class ComponentInstanceProvider<TComponent> implements IComponentProvider<TComponent> {
    private instance;
    constructor(instance: TComponent);
    getComponent(): TComponent;
    readonly identifier: any;
}
