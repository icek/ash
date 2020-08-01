import { ClassType } from '@ash.ts/core';

export class ObjectReflection {
  private _propertyTypes:Record<string, string> = {};

  private _type:string;

  public constructor(component:Record<string, any>, type?:string) {
    this._type = type || component.constructor.name;
    const { _propertyTypes } = this;
    const filter = (descs:Record<string, PropertyDescriptor>) => (key:string):boolean => {
      const desc = descs[key];
      return !!desc.enumerable || (!!desc.get && !!desc.set);
    };
    const ownKeys = Object.getOwnPropertyDescriptors(component);
    const protoDescriptor = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(component));
    const keys = Object.keys(ownKeys)
      .filter(filter(ownKeys))
      .concat(Object.keys(protoDescriptor).filter(filter(protoDescriptor)));

    for (const key of keys) {
      const cmp = component[key];
      const name:string = typeof cmp;
      switch (name.toLowerCase()) {
        case 'object':
          if (cmp === null) {
            _propertyTypes[key] = 'null';
          } else {
            _propertyTypes[key] = cmp.constructor.name;
          }
          break;
        case 'undefined':
        case 'null':
          break;
        default:
          _propertyTypes[key] = name;
      }
    }

    const types:Record<string, ClassType<any>> = (component.constructor as any).__ash_types__;
    if (!types) return;

    const typesKeys = Object.keys(types);
    for (const key of typesKeys) {
      const { name } = types[key];
      if (!_propertyTypes[key]) {
        _propertyTypes[key] = name;
      }
    }
  }

  public get propertyTypes():Record<string, string> {
    return this._propertyTypes;
  }

  public get type():string {
    return this._type;
  }
}
