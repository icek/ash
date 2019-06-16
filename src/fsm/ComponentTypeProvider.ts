import { ClassType } from '../types';
import { ComponentProvider } from './ComponentProvider';

/**
 * This component provider always returns a new instance of a component. An instance
 * is created when requested and is of the type passed in to the constructor.
 */
export default class ComponentTypeProvider<TComponent> implements ComponentProvider<TComponent> {
  private ComponentType:ClassType<TComponent>;

  /**
   * Constructor
   *
   * @param ComponentType The type of the instances to be created
   */
  public constructor(ComponentType:ClassType<TComponent>) {
    this.ComponentType = ComponentType;
  }

  /**
   * Used to request a component from this provider
   *
   * @return A new instance of the type provided in the constructor
   */
  public getComponent():TComponent {
    return new this.ComponentType();
  }

  /**
   * Used to compare this provider with others. Any ComponentTypeProvider that returns
   * the same type will be regarded as equivalent.
   *
   * @return The type of the instances created
   */
  public get identifier():any {
    return this.ComponentType;
  }
}
