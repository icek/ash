import { ClassType } from '@ash.ts/core';

export class ObjectReflection {
  private _propertyTypes:Map<string, string> = new Map<string, string>();

  private _type:string;

  public constructor(component:Record<string, any>, type?:string) {
    this._type = type || component.constructor.name;
    const { _propertyTypes } = this;
    const filter = (descs:{ [key:string]:PropertyDescriptor }) => (key:string) => {
      const desc = descs[key];
      return desc.enumerable || (!!desc.get && !!desc.set);
    };
    const ownKeys = Object.getOwnPropertyDescriptors(component);
    const protoDescriptor = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(component));
    let keys = Object.keys(ownKeys).filter(filter(ownKeys));
    keys = keys.concat(Object.keys(protoDescriptor).filter(filter(protoDescriptor)));

    for (const key of keys) {
      const cmp = component[key];
      const name:string = typeof cmp;
      switch (name.toLowerCase()) {
        case 'object':
          if (cmp === null) {
            _propertyTypes.set(key, 'null');
          } else {
            _propertyTypes.set(key, cmp.constructor.name);
          }
          break;
        case 'undefined':
        case 'null':
          break;
        default:
          _propertyTypes.set(key, name);
      }
    }

    const types:Map<string, ClassType<any>> = (component.constructor as any).__ash_types__;
    if (!types) return;

    for (const [key, componentType] of types) {
      const { name }:{ name:string } = componentType;
      if (!_propertyTypes.has(key)) {
        _propertyTypes.set(key, name);
      }
    }
  }

  public get propertyTypes():Map<string, string> {
    return this._propertyTypes;
  }

  public get type():string {
    return this._type;
  }
}
