import { ClassType } from '../../types';
import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';

export class ClassObjectCodec implements ObjectCodec<ClassType<any>> {
  public encode(object:ClassType<any>, codecManager:CodecManager):EncodedObject {
    const ctor:ClassType<any> = object.constructor.prototype.constructor;

    return { type: 'Class', value: codecManager.classToStringMap.get(ctor) };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):ClassType<any> | null {
    return codecManager.stringToClassMap.get(object.value) || null;
  }

  public decodeIntoObject(target:ClassType<any>, object:EncodedObject, codecManager:CodecManager):void {
    const message = 'Can\'t decode into a native object because the object is passed by value, not by reference, so we\'re decoding into a local copy not the original.';
    throw new Error(message);
  }

  public decodeIntoProperty(parent:{ [key:string]:any }, property:string, object:EncodedObject, codecManager:CodecManager):void {
    this.decodeIntoObject(parent[property], object, codecManager);
  }
}
