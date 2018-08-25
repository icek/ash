/**
 * An object pool for re-using components. This is not integrated in to Ash but is used dierectly by
 * the developer. It expects components to not require any parameters in their constructor.
 *
 * <p>Fetch an object from the pool with</p>
 *
 * <p>ComponentPool.get( ComponentClass );</p>
 *
 * <p>If the pool contains an object of the required type, it will be returned. If it does not, a new object
 * will be created and returned.</p>
 *
 * <p>The object returned may have properties set on it from the time it was previously used, so all properties
 * should be reset in the object once it is received.</p>
 *
 * <p>Add an object to the pool with</p>
 *
 * <p>ComponentPool.dispose( component );</p>
 *
 * <p>You will usually want to do this when removing a component from an entity. The remove method on the entity
 * returns the component that was removed, so this can be done in one line of code like this</p>
 *
 * <p>ComponentPool.dispose( entity.remove( component ) );</p>
 */
import { ClassType } from '../types';

export class ComponentPool {
  private static pools:Map<ClassType<any>, any[]> = new Map<ClassType<any>, any[]>();

  private static getPool<T>(componentClass:ClassType<T>):T[] {
    if(ComponentPool.pools.has(componentClass)) {
      return ComponentPool.pools.get(componentClass)!;
    }

    const ret:T[] = [];
    ComponentPool.pools.set(componentClass, ret);
    return ret;
  }

  /**
   * Get an object from the pool.
   *
   * @param componentClass The type of component wanted.
   * @return The component.
   */
  public static get<T>(componentClass:ClassType<T>):T {
    const pool:T[] = ComponentPool.getPool(componentClass);
    if(pool.length > 0) {
      return pool.pop()!;
    }

    return new componentClass();
  }

  /**
   * Return an object to the pool for reuse.
   *
   * @param component The component to return to the pool.
   */
  public static dispose<T>(component:T):void {
    if(component) {
      const type:ClassType<T> = component.constructor.prototype.constructor;
      const pool:T[] = ComponentPool.getPool(type);
      pool[pool.length] = component;
    }
  }

  /**
   * Dispose of all pooled resources, freeing them for garbage collection.
   */
  public static empty():void {
    ComponentPool.pools = new Map<ClassType<any>, any[]>();
  }
}
