/**
 * An object pool for re-using components. This is not integrated in to Ash but is used dierectly by
 * the developer. It expects components to not require any parameters in their constructor.
 *
 * Fetch an object from the pool with
 *
 * @example
 * ```typescript
 * ComponentPool.get(ComponentClass);
 * ```
 *
 * If the pool contains an object of the required type, it will be returned. If it does not, a new object
 * will be created and returned.
 *
 * The object returned may have properties set on it from the time it was previously used, so all properties
 * should be reset in the object once it is received.
 *
 * Add an object to the pool with
 *
 * @example
 * ```typescript
 * ComponentPool.dispose(component);
 * ```
 *
 * You will usually want to do this when removing a component from an entity. The remove method on the entity
 * returns the component that was removed, so this can be done in one line of code like this
 *
 * @example
 * ```typescript
 * ComponentPool.dispose(entity.remove(component));
 * ```
 */
import { Class } from '@ash.ts/core';

export class ComponentPool {
  private static pools:Map<Class<any>, any[]> = new Map();

  private static getPool<T>(componentClass:Class<T>):T[] {
    if (ComponentPool.pools.has(componentClass)) {
      return ComponentPool.pools.get(componentClass)!;
    }

    const pool:T[] = [];
    ComponentPool.pools.set(componentClass, pool);

    return pool;
  }

  /**
   * Get an object from the pool.
   *
   * @param ComponentClass The type of component wanted.
   * @return The component.
   */
  public static get<T>(ComponentClass:Class<T>):T {
    const pool:T[] = ComponentPool.getPool(ComponentClass);
    if (pool.length > 0) {
      return pool.pop()!;
    }

    return new ComponentClass();
  }

  /**
   * Return an object to the pool for reuse.
   *
   * @param component The component to return to the pool.
   */
  public static dispose<T extends Record<string, any>>(component:T):void {
    const type = component.constructor as Class<T>;
    const pool:T[] = ComponentPool.getPool(type);
    pool[pool.length] = component;
  }

  /**
   * Dispose of all pooled resources, freeing them for garbage collection.
   */
  public static empty():void {
    ComponentPool.pools = new Map();
  }
}
