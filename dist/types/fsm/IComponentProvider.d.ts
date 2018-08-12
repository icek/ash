export interface IComponentProvider<TComponent> {
    getComponent(): TComponent;
    identifier: any;
}
