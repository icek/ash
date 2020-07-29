import { ClassType } from '@ash.ts/core';
import { ObjectReflection } from './ObjectReflection';

export class ObjectReflectionFactory {
  public static classMap:Map<ClassType<any>, string> = new Map();

  private static reflections:Map<ClassType<any>, ObjectReflection> = new Map();

  public static reflection(component:Record<string, any>):ObjectReflection | null {
    const type:ClassType<any> = component.constructor.prototype.constructor;
    const { reflections, classMap } = ObjectReflectionFactory;
    if (!reflections.has(type) && classMap.has(type)) {
      reflections.set(type, new ObjectReflection(component, classMap.get(type)!));
    }

    return reflections.get(type) || null;
  }
}
