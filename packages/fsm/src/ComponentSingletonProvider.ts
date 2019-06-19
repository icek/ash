import { ClassType } from '@ash-ts/core';
import { ComponentProvider } from './ComponentProvider';

/**
 * This component provider always returns the same instance of the component. The instance
 * is created when first required and is of the type passed in to the constructor.
 */
export default class ComponentSingletonProvider<TComponent> implements ComponentProvider<TComponent> {
  private ComponentType:ClassType<TComponent>;

  private instance?:TComponent;

  /**
   * Constructor
   *
   * @param ComponentType The type of the single instance
   */
  public constructor(ComponentType:ClassType<TComponent>) {
    this.ComponentType = ComponentType;
  }

  /**
   * Used to request a component from this provider
   *
   * @return The single instance
   */
  public getComponent():TComponent {
    if (!this.instance) {
      this.instance = new this.ComponentType();
    }

    return this.instance;
  }

  /**
   * Used to compare this provider with others. Any provider that returns the same single
   * instance will be regarded as equivalent.
   *
   * @return The single instance
   */
  public get identifier():any {
    return this.getComponent();
  }
}
