import { ClassType } from '../types';
import { EngineState } from './EngineState';
import { ISystemProvider } from './ISystemProvider';
import { System } from '../core/System';

export class StateSystemMapping<TSystem extends System> {
  private creatingState:EngineState;
  private provider:ISystemProvider<TSystem>;

  /**
   * Used internally, the constructor creates a component mapping. The constructor
   * creates a SystemSingletonProvider as the default mapping, which will be replaced
   * by more specific mappings if other methods are called.
   *
   * @param creatingState The SystemState that the mapping will belong to
   * @param provider The System type for the mapping
   */
  constructor(creatingState:EngineState, provider:ISystemProvider<TSystem>) {
    this.creatingState = creatingState;
    this.provider = provider;
  }

  /**
   * Applies the priority to the provider that the System will be.
   *
   * @param priority The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  public withPriority(priority:number):StateSystemMapping<TSystem> {
    this.provider.priority = priority;
    return this;
  }

  /**
   * Creates a mapping for the System type to a specific System instance. A
   * SystemInstanceProvider is used for the mapping.
   *
   * @param system The System instance to use for the mapping
   * @return This StateSystemMapping, so more modifications can be applied
   */
  public addInstance(system:TSystem):StateSystemMapping<TSystem> {
    return this.creatingState.addInstance(system);
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
  public addSingleton(type:ClassType<TSystem>):StateSystemMapping<TSystem> {
    return this.creatingState.addSingleton(type);
  }

  /**
   * Creates a mapping for the System type to a method call.
   * The method should return a System instance. A DynamicSystemProvider is used for
   * the mapping.
   *
   * @param method The method to provide the System instance.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  public addMethod(method:() => TSystem):StateSystemMapping<TSystem> {
    return this.creatingState.addMethod(method);
  }

  /**
   * Maps through to the addProvider method of the SystemState that this mapping belongs to
   * so that a fluent interface can be used when configuring entity states.
   *
   * @param provider The component provider to use.
   * @return This StateSystemMapping, so more modifications can be applied.
   */
  public addProvider(provider:ISystemProvider<TSystem>):StateSystemMapping<TSystem> {
    return this.creatingState.addProvider(provider);
  }
}

