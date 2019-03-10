import { IComponentProvider } from './IComponentProvider';

/**
 * This component provider always returns the same instance of the component. The instance
 * is passed to the provider at initialisation.
 */
export class ComponentInstanceProvider<TComponent> implements IComponentProvider<TComponent> {
  private instance:TComponent;

  /**
   * Constructor
   *
   * @param instance The instance to return whenever a component is requested.
   */
  constructor(instance:TComponent) {
    this.instance = instance;
  }

  /**
   * Used to request a component from this provider
   *
   * @return The instance
   */
  public getComponent():TComponent {
    return this.instance;
  }

  /**
   * Used to compare this provider with others. Any provider that returns the same component
   * instance will be regarded as equivalent.
   *
   * @return The instance
   */
  public get identifier():any {
    return this.instance;
  }
}
