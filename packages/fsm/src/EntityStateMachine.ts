import { Entity, Class } from '@ash.ts/core';
import { EntityState } from './EntityState';
import { ComponentProvider } from './ComponentProvider';

/**
 * This is a state machine for an entity. The state machine manages a set of states,
 * each of which has a set of component providers. When the state machine changes the state, it removes
 * components associated with the previous state and adds components associated with the new state.
 */
export class EntityStateMachine {
  private states:Record<string, EntityState>;

  /**
   * The current state of the state machine.
   */
  private currentState?:EntityState;

  /**
   * The entity whose state machine this is
   */
  public entity:Entity;

  /**
   * Constructor. Creates an EntityStateMachine.
   */
  public constructor(entity:Entity) {
    this.entity = entity;
    this.states = {};
  }

  /**
   * Add a state to this state machine.
   *
   * @param name The name of this state - used to identify it later in the changeState method call.
   * @param state The state.
   * @return This state machine, so methods can be chained.
   */
  public addState(name:string, state:EntityState):this {
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
  public createState(name:string):EntityState {
    const state:EntityState = new EntityState();
    this.states[name] = state;

    return state;
  }

  /**
   * Change to a new state. The components from the old state will be removed and the components
   * for the new state will be added.
   *
   * @param name The name of the state to change to.
   */
  public changeState(name:string):void {
    const newState:EntityState | undefined = this.states[name];
    if (!newState) {
      throw new Error(`Entity state ${name} doesn't exist`);
    }
    if (newState === this.currentState) {
      return;
    }
    let toAdd:Map<Class<any>, ComponentProvider<any>>;

    if (this.currentState) {
      toAdd = new Map();
      for (const type of newState.providers.keys()) {
        toAdd.set(type, newState.providers.get(type)!);
      }
      for (const type of this.currentState.providers.keys()) {
        const other:ComponentProvider<any> | null = toAdd.get(type) || null;

        if (other && other.identifier === this.currentState!.providers.get(type)!.identifier) {
          toAdd.delete(type);
        } else {
          this.entity.remove(type);
        }
      }
    } else {
      toAdd = newState.providers;
    }
    for (const type of toAdd.keys()) {
      this.entity.add((toAdd.get(type)! as ComponentProvider<any>).getComponent(), type);
    }
    this.currentState = newState;
  }

  public getStateNames():string[] {
    return Object.keys(this.states);
  }
}
