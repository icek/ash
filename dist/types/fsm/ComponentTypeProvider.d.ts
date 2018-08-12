import { IComponentProvider } from './IComponentProvider';
export declare class ComponentTypeProvider<TComponent> implements IComponentProvider<TComponent> {
    private componentType;
    constructor(type: {
        new (...args: any[]): TComponent;
    });
    getComponent(): TComponent;
    readonly identifier: any;
}
