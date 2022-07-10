import { Class } from '@ash.ts/core';
import { ObjectReflection } from './ObjectReflection';

export class ObjectReflectionFactory {
  public static classMap:Map<Class, string> = new Map();

  private static reflections:Map<Class, ObjectReflection> = new Map();

  public static reflection(component:Record<string, any>):ObjectReflection | null {
    const type = component.constructor as Class;
    const { reflections, classMap } = ObjectReflectionFactory;
    if (!reflections.has(type) && classMap.has(type)) {
      reflections.set(type, new ObjectReflection(component, classMap.get(type)!));
    }

    return reflections.get(type) || null;
  }
}
