import { EngineState } from './EngineState';
import { ISystemProvider } from './ISystemProvider';
import { Engine } from '../core/Engine';

/**
 * This is a state machine for the Engine. The state machine manages a set of states,
 * each of which has a set of System providers. When the state machine changes the state, it removes
 * Systems associated with the previous state and adds Systems associated with the new state.
 */
export class EngineStateMachine {
  public engine:Engine;
  private states:{ [key:string]:EngineState };
  private currentState?:EngineState;

  /**
   * Constructor. Creates an SystemStateMachine.
   */
  constructor(engine:Engine) {
    this.engine = engine;
    this.states = {};
  }

  /**
   * Add a state to this state machine.
   *
   * @param name The name of this state - used to identify it later in the changeState method call.
   * @param state The state.
   * @return This state machine, so methods can be chained.
   */
  public addState(name:string, state:EngineState):this {
    this.states[name] = state;
    return this;
  }

  /**
   * Create a new state in this state machine.
   *
   * @param name The name of the new state - used to identify it later in the changeState method call.
   * @return The new EntityState object that is the state. This will need to be configured with
   * the appropriate component providers.
   */
  public createState(name:string):EngineState {
    const state:EngineState = new EngineState();
    this.states[name] = state;
    return state;
  }

  /**
   * Change to a new state. The Systems from the old state will be removed and the Systems
   * for the new state will be added.
   *
   * @param name The name of the state to change to.
   */
  public changeState(name:string):void {
    let newState:EngineState | null = this.states[name];
    if(!newState) {
      throw(new Error(`Engine state ${name} doesn't exist`));
    }
    if(newState === this.currentState) {
      newState = null;
      return;
    }
    const toAdd:ISystemProvider<any>[] = [];
    let id:any;
    for(const provider of newState.providers) {
      id = provider.identifier;
      toAdd[id] = provider;
    }
    if(this.currentState) {
      for(const provider of this.currentState.providers) {
        id = provider.identifier;
        const other:ISystemProvider<any> = toAdd[id];

        if(other) {
          delete toAdd[id];
        } else {
          this.engine.removeSystem(provider.getSystem());
        }
      }
    }
    for(const provider of toAdd) {
      this.engine.addSystem(provider.getSystem(), provider.priority);
    }
    this.currentState = newState;
  }
}
