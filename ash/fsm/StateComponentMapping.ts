import { ClassType } from '../types';
import { ComponentInstanceProvider } from './ComponentInstanceProvider';
import { ComponentSingletonProvider } from './ComponentSingletonProvider';
import { ComponentTypeProvider } from './ComponentTypeProvider';
import { DynamicComponentProvider } from './DynamicComponentProvider';
import { EntityState } from './EntityState';
import { IComponentProvider } from './IComponentProvider';

/**
 * Used by the EntityState class to create the mappings of components to providers via a fluent interface.
 */
export class StateComponentMapping<TComponent> {
  private componentType:ClassType<TComponent>;
  private creatingState:EntityState;
  // tslint:disable-next-line:no-unused-variable
  private provider!:IComponentProvider<TComponent>;

  /**
   * Used internally, the constructor creates a component mapping. The constructor
   * creates a ComponentTypeProvider as the default mapping, which will be replaced
   * by more specific mappings if other methods are called.
   *
   * @param creatingState The EntityState that the mapping will belong to
   * @param type The component type for the mapping
   */
  constructor(creatingState:EntityState, type:ClassType<TComponent>) {
    this.creatingState = creatingState;
    this.componentType = type;
    this.withType(type);
  }

  /**
   * Creates a mapping for the component type to a specific component instance. A
   * ComponentInstanceProvider is used for the mapping.
   *
   * @param component The component instance to use for the mapping
   * @return This ComponentMapping, so more modifications can be applied
   */
  public withInstance(component:TComponent):this {
    this.setProvider(new ComponentInstanceProvider(component));
    return this;
  }

  /**
   * Creates a mapping for the component type to new instances of the provided type.
   * The type should be the same as or extend the type for this mapping. A ComponentTypeProvider
   * is used for the mapping.
   *
   * @param type The type of components to be created by this mapping
   * @return This ComponentMapping, so more modifications can be applied
   */
  public withType(type:ClassType<TComponent>):this {
    this.setProvider(new ComponentTypeProvider(type));
    return this;
  }

  /**
   * Creates a mapping for the component type to a single instance of the provided type.
   * The instance is not created until it is first requested. The type should be the same
   * as or extend the type for this mapping. A ComponentSingletonProvider is used for
   * the mapping.
   *
   * @param type of the single instance to be created. If omitted, the type of the
   * mapping is used.
   * @return This ComponentMapping, so more modifications can be applied
   */
  public withSingleton(type?:ClassType<any>):this {
    if(!type) {
      type = this.componentType;
    }
    this.setProvider(new ComponentSingletonProvider(type));
    return this;
  }


  /**
   * Creates a mapping for the component type to a method call. A
   * DynamicComponentProvider is used for the mapping.
   *
   * @param method The method to return the component instance
   * @return This ComponentMapping, so more modifications can be applied
   */
  public withMethod(method:() => TComponent):this {
    this.setProvider(new DynamicComponentProvider(method));
    return this;
  }

  /**
   * Creates a mapping for the component type to any ComponentProvider.
   *
   * @param provider The component provider to use.
   * @return This ComponentMapping, so more modifications can be applied.
   */
  public withProvider(provider:IComponentProvider<TComponent>):this {
    this.setProvider(provider);
    return this;
  }

  /**
   * Maps through to the add method of the EntityState that this mapping belongs to
   * so that a fluent interface can be used when configuring entity states.
   *
   * @param type The type of component to add a mapping to the state for
   * @return The new ComponentMapping for that type
   */
  public add<TNextComponent>(type:ClassType<TNextComponent>):StateComponentMapping<TNextComponent> {
    return this.creatingState.add(type);
  }

  private setProvider(provider:IComponentProvider<TComponent>):void {
    this.provider = provider;
    this.creatingState.providers.set(this.componentType, provider);
  }
}
