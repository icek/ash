import { ClassType } from '@ash.ts/core';

export class ObjectReflection {
  private pPropertyTypes:Map<string, string> = new Map<string, string>();

  private pType:string;

  public constructor(component:Record<string, any>, type?:string) {
    this.pType = type || component.constructor.name;
    const { pPropertyTypes } = this;
    const keys = Object.keys(component);

    for (const key of keys) {
      const name:string = typeof component[key];
      switch (name.toLowerCase()) {
        case 'object':
          pPropertyTypes.set(key, component[key].constructor.name);
          break;
        case 'number':
        case 'string':
        case 'boolean':
          pPropertyTypes.set(key, name[0].toUpperCase() + name.substr(1));
          break;
        case 'undefined':
        case 'null':
          break;
        default:
          pPropertyTypes.set(key, name);
      }
    }

    const types:Map<string, ClassType<any>> = (component.constructor as any).__ash_types__;
    if (!types) return;

    for (const [key, componentType] of types) {
      const { name }:{ name:string } = componentType;
      if (!pPropertyTypes.has(key)) {
        pPropertyTypes.set(key, name);
      }
    }
  }

  public get propertyTypes():Map<string, string> {
    return this.pPropertyTypes;
  }

  public get type():string {
    return this.pType;
  }
}
