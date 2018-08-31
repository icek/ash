import { Signal2 } from '../signals/Signal2';
import { ClassType } from '../types';

/**
 * An entity is composed from components. As such, it is essentially a collection object for components.
 * Sometimes, the entities in a game will mirror the actual characters and objects in the game, but this
 * is not necessary.
 *
 * <p>Components are simple value objects that contain data relevant to the entity. Entities
 * with similar functionality will have instances of the same components. So we might have
 * a position component</p>
 *
 * @example
 * ```typescript
 *
 * class PositionComponent {
 *   public x:number;
 *   public y:number;
 * }
 * ```
 *
 * <p>All entities that have a position in the game world, will have an instance of the
 * position component. Systems operate on entities based on the components they have.</p>
 */
export class Entity {
  private static nameCount:number = 0;

  /**
   * Optional, give the entity a name. This can help with debugging and with serialising the entity.
   */
  private pName:string;
  /**
   * This signal is dispatched when a component is added to the entity.
   */
  public componentAdded:Signal2<Entity, ClassType<any>>;
  /**
   * This signal is dispatched when a component is removed from the entity.
   */
  public componentRemoved:Signal2<Entity, ClassType<any>>;
  /**
   * Dispatched when the name of the entity changes. Used internally by the engine to track entities based on their names.
   */
  public nameChanged:Signal2<Entity, string>;

  public previous:Entity | null = null;
  public next:Entity | null = null;
  public components:Map<ClassType<any>, any>;

  /**
   * The constructor
   *
   * @param name The name for the entity. If left blank, a default name is assigned with the form _entityN where N is an integer.
   */
  constructor(name:string = '') {
    this.componentAdded = new Signal2();
    this.componentRemoved = new Signal2();
    this.nameChanged = new Signal2();
    this.components = new Map<ClassType<any>, any>();
    if(name) {
      this.pName = name;
    } else {
      Entity.nameCount += 1;
      this.pName = '_entity' + Entity.nameCount;
    }
  }

  /**
   * All entities have a name. If no name is set, a default name is used. Names are used to
   * fetch specific entities from the engine, and can also help to identify an entity when debugging.
   */
  public get name():string {
    return this.pName;
  }

  public set name(value:string) {
    if(this.pName !== value) {
      const previous:string = this.pName;
      this.pName = value;
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
   *
   * const entity:Entity = new Entity()
   *   .add<Position>(new Position(100, 200)
   *   .add<Display>(new Display(new PlayerClip());
   * ```
   */

  public add<T>(component:T, componentClass:ClassType<T> | null = null):this {
    if(!componentClass) {
      componentClass = component.constructor.prototype.constructor; // weird but works!
    }

    componentClass = componentClass!;

    if(this.components.has(componentClass)) {
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
  public remove<T>(componentClass:ClassType<T>):T | null {
    const component:any = this.components.get(componentClass);
    if(component) {
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
  public get<T>(componentClass:ClassType<T>):T | null {
    return this.components.get(componentClass) || null;
  }

  /**
   * Get all components from the entity.
   *
   * @return An array containing all the components that are on the entity.
   */
  public getAll():any[] {
    const componentArray:any[] = [];
    for(const value of this.components.values()) {
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
  public has<T>(componentClass:ClassType<T>):boolean {
    return this.components.has(componentClass);
  }
}
