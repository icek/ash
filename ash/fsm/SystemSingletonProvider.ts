import { System } from '../core/System';
import { ClassType } from '../types';
import { ISystemProvider } from './ISystemProvider';

/**
 * This System provider always returns the same instance of the System. The instance
 * is created when first required and is of the type passed in to the constructor.
 */
export class SystemSingletonProvider<TSystem extends System> implements ISystemProvider<TSystem> {
  private componentType:ClassType<TSystem>;
  private instance?:TSystem;
  private systemPriority:number = 0;

  /**
   * Constructor
   *
   * @param type The type of the single System instance
   */
  constructor(type:ClassType<TSystem>) {
    this.componentType = type;
  }

  /**
   * Used to request a System from this provider
   *
   * @return The single instance
   */
  public getSystem():TSystem {
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
    return this.getSystem();
  }

  /**
   * The priority at which the System should be added to the Engine
   */
  public get priority():number {
    return this.systemPriority;
  }

  /**
   * @private
   */
  public set priority(value:number) {
    this.systemPriority = value;
  }
}
