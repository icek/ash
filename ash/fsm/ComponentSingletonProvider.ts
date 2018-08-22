import { ClassType } from '../types';
import { IComponentProvider } from './IComponentProvider';

/**
 * This component provider always returns the same instance of the component. The instance
 * is created when first required and is of the type passed in to the constructor.
 */
export class ComponentSingletonProvider<TComponent> implements IComponentProvider<TComponent> {
  private componentType:ClassType<TComponent>;
  private instance?:TComponent;

  /**
   * Constructor
   *
   * @param type The type of the single instance
   */
  constructor(type:ClassType<TComponent>) {
    this.componentType = type;
  }

  /**
   * Used to request a component from this provider
   *
   * @return The single instance
   */
  public getComponent():TComponent {
    if(!this.instance) {
      this.instance = new this.componentType();
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
