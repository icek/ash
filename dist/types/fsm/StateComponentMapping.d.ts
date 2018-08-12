import { EntityState } from './EntityState';
import { IComponentProvider } from './IComponentProvider';
export declare class StateComponentMapping<TComponent> {
    private componentType;
    private creatingState;
    private provider;
    constructor(creatingState: EntityState, type: {
        new (...args: any[]): TComponent;
    });
    withInstance(component: TComponent): this;
    withType(type: {
        new (...args: any[]): TComponent;
    }): this;
    withSingleton(type?: {
        new (...args: any[]): any;
    }): this;
    withMethod(method: () => TComponent): this;
    withProvider(provider: IComponentProvider<TComponent>): this;
    add<TComponent>(type: {
        new (...args: any[]): TComponent;
    }): StateComponentMapping<TComponent>;
    private setProvider;
}
