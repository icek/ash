import { ClassType } from '../types';
import { DynamicSystemProvider } from './DynamicSystemProvider';
import { ISystemProvider } from './ISystemProvider';
import { StateSystemMapping } from './StateSystemMapping';
import { SystemInstanceProvider } from './SystemInstanceProvider';
import { SystemSingletonProvider } from './SystemSingletonProvider';
import { System } from '../core/System';

/**
 * Represents a state for a SystemStateMachine. The state contains any number of SystemProviders which
 * are used to add Systems to the Engine when this state is entered.
 */
export class EngineState {
  public providers:ISystemProvider<any>[] = [];

  /**
   * Creates a mapping for the System type to a specific System instance. A
   * SystemInstanceProvider is used for the mapping.
   *
   * @param system The System instance to use for the mapping
   * @return This StateSystemMapping, so more modifications can be applied
   */
  public addInstance<TSystem extends System>(system:TSystem):StateSystemMapping<TSystem> {
    return this.addProvider(new SystemInstanceProvider<TSystem>(system));
  }

  /**
   * Creates a mapping for the System type to a single instance of the provided type.
   * The instance is not created until it is first requested. The type should be the same
   * as or extend the type for this mapping. A SystemSingletonProvider is used for
   * the mapping.
   *
   * @param type The type of the single instance to be created. If omitted, the type of the
   * mapping is used.
   * @return This StateSystemMapping, so more modifications can be applied
   */
  public addSingleton<TSystem extends System>(type:ClassType<TSystem>):StateSystemMapping<TSystem> {
    return this.addProvider(new SystemSingletonProvider<TSystem>(type));
  }

  /**
   * Creates a mapping for the System type to a method call.
   * The method should return a System instance. A DynamicSystemProvider is used for
   * the mapping.
   *
   * @param method The method to provide the System instance.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  public addMethod<TSystem extends System>(method:() => TSystem):StateSystemMapping<TSystem> {
    return this.addProvider(new DynamicSystemProvider<TSystem>(method));
  }

  /**
   * Adds any SystemProvider.
   *
   * @param provider The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  public addProvider<TSystem extends System>(provider:ISystemProvider<TSystem>):StateSystemMapping<TSystem> {
    const mapping:StateSystemMapping<TSystem> = new StateSystemMapping(this, provider);
    this.providers[this.providers.length] = provider;
    return mapping;
  }
}
