import { Signal } from '@ash.ts/signals';
import { Class } from './types';

/**
 * An entity is composed from components. As such, it is essentially a collection object for components.
 * Sometimes, the entities in a game will mirror the actual characters and objects in the game, but this
 * is not necessary.
 *
 * Components are simple value objects that contain data relevant to the entity. Entities
 * with similar functionality will have instances of the same components. So we might have
 * a position component
 *
 * @example
 * ```typescript
 * class PositionComponent {
 *   public x:number;
 *   public y:number;
 * }
 * ```
 *
 * All entities that have a position in the game world, will have an instance of the
 * position component. Systems operate on entities based on the components they have.
 */
export class Entity {
  private static nameCount = 0;

  /**
   * Optional, give the entity a name. This can help with debugging and with serialising the entity.
   */
  private _name:string;

  /**
   * This signal is dispatched when a component is added to the entity.
   */
  public componentAdded:Signal<[this, Class<any>]>;

  /**
   * This signal is dispatched when a component is removed from the entity.
   */
  public componentRemoved:Signal<[this, Class<any>]>;

  /**
   * Dispatched when the name of the entity changes.
   * Used internally by the engine to track entities based on their names.
   */
  public nameChanged:Signal<[this, string]>;

  public previous:this | null = null;

  public next:this | null = null;

  public components:Map<Class<any>, any>;

  /**
   * The constructor
   *
   * @param name The name for the entity. If left blank, a default name is
   * assigned with the form _entityN where N is an integer.
   */
  public constructor(name = '') {
    this.componentAdded = new Signal();
    this.componentRemoved = new Signal();
    this.nameChanged = new Signal();
    this.components = new Map();
    if (name) {
      this._name = name;
    } else {
      Entity.nameCount += 1;
      this._name = `_entity${Entity.nameCount}`;
    }
  }

  /**
   * All entities have a name. If no name is set, a default name is used. Names are used to
   * fetch specific entities from the engine, and can also help to identify an entity when debugging.
   */
  public get name():string {
    return this._name;
  }

  public set name(value:string) {
    if (this._name !== value) {
      const previous:string = this._name;
      this._name = value;
      this.nameChanged.dispatch(this, previous);
    }
  }

  /**
   * Add a component to the entity.
   *
   * @param component The component object to add.
   * @param componentClass The class of the component. This is only necessary if the component
   * extends another component class and you want the framework to treat the component as of
   * the base class type. If not set, the class type is determined directly from the component.
   *
   * @return A reference to the entity. This enables the chaining of calls to add, to make
   * creating and configuring entities cleaner. e.g.
   *
   * @example
   * ```typescript
   * const entity:Entity = new Entity()
   *   .add(new Position(100, 200)
   *   .add(new Display(new PlayerClip());
   * ```
   */

  public add<T extends Record<string, any>>(
    component:T,
    componentClass:Class<T> = component.constructor as Class<any>,
  ):this {
    if (!componentClass) {
      throw new Error(`Unable to get type of component: ${component}`);
    }

    if (this.components.has(componentClass)) {
      this.remove(componentClass);
    }

    this.components.set(componentClass, component);
    this.componentAdded.dispatch(this, componentClass);

    return this;
  }

  /**
   * Remove a component from the entity.
   *
   * @param componentClass The class of the component to be removed.
   * @return the component, or null if the component doesn't exist in the entity
   */
  public remove<T>(componentClass:Class<T>):T | null {
    const component:T = this.components.get(componentClass);
    if (component) {
      this.components.delete(componentClass);
      this.componentRemoved.dispatch(this, componentClass);

      return component;
    }

    return null;
  }

  /**
   * Get a component from the entity.
   *
   * @param componentClass The class of the component requested.
   * @return The component, or null if none was found.
   */
  public get<T>(componentClass:Class<T>):T | null {
    return this.components.get(componentClass) || null;
  }

  /**
   * Get all components from the entity.
   *
   * @return An array containing all the components that are on the entity.
   */
  public getAll():any[] {
    const componentArray:any[] = [];
    for (const value of this.components.values()) {
      componentArray.push(value);
    }

    return componentArray;
  }

  /**
   * Does the entity have a component of a particular type.
   *
   * @param componentClass The class of the component sought.
   * @return true if the entity has a component of the type, false if not.
   */
  public has<T>(componentClass:Class<T>):boolean {
    return this.components.has(componentClass);
  }
}
