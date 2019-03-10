import { IComponentProvider } from './IComponentProvider';

/**
 * This component provider calls a function to get the component instance. The function must
 * return a single component of the appropriate type.
 */
export class DynamicComponentProvider<TComponent> implements IComponentProvider<TComponent> {
  private closure:() => TComponent;

  /**
   * Constructor
   *
   * @param closure The function that will return the component instance when called.
   */
  constructor(closure:() => TComponent) {
    this.closure = closure;
  }

  /**
   * Used to request a component from this provider
   *
   * @return The instance returned by calling the function
   */
  public getComponent():TComponent {
    return this.closure();
  }

  /**
   * Used to compare this provider with others. Any provider that uses the function or method
   * closure to provide the instance is regarded as equivalent.
   *
   * @return The function
   */
  public get identifier():any {
    return this.closure;
  }
}
