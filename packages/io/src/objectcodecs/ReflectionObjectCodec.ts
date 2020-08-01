import { ClassType } from '@ash.ts/core';
import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';
import { ObjectReflection } from './ObjectReflection';
import { ObjectReflectionFactory } from './ObjectReflectionFactory';

export class ReflectionObjectCodec implements ObjectCodec<Record<string, any>> {
  public encode(object:Record<string, any>, codecManager:CodecManager):EncodedObject | null {
    const reflection:ObjectReflection | null = ObjectReflectionFactory.reflection(object);
    if (!reflection) return null;
    const properties:Record<string, any> = {};
    const keys = reflection.propertyTypes.keys();
    for (const name of keys) {
      properties[name] = codecManager.encodeObject(object[name]);
    }

    return { type: reflection.type, value: properties };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):Record<string, any> | null {
    const Type:ClassType<any> | null = codecManager.stringToClassMap.get(object.type) || null;
    if (!Type) {
      return null;
    }
    const decoded:any = new Type();
    const keys = Object.keys(object.value);
    for (const name of keys) {
      decoded[name] = codecManager.decodeObject(object.value[name]);
    }

    return decoded;
  }

  public decodeIntoObject(target:Record<string, any>, object:EncodedObject, codecManager:CodecManager):void {
    const keys = Object.keys(object.value);
    for (const name of keys) {
      if (target[name]) {
        codecManager.decodeIntoProperty(target, name, object.value[name]);
      } else {
        target[name] = codecManager.decodeObject(object.value[name]);
      }
    }
  }

  public decodeIntoProperty(
    parent:Record<string, any>,
    property:string,
    object:EncodedObject,
    codecManager:CodecManager,
  ):void {
    this.decodeIntoObject(parent[property], object, codecManager);
  }
}
