import { IComponentProvider } from './IComponentProvider';
export declare class ComponentSingletonProvider<TComponent> implements IComponentProvider<TComponent> {
    private componentType;
    private instance?;
    constructor(type: {
        new (...args: any[]): TComponent;
    });
    getComponent(): TComponent;
    readonly identifier: any;
}
