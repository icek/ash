import { ClassType } from '@ash.ts/core';
import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';

export class ClassObjectCodec implements ObjectCodec<ClassType<any>> {
  public encode(object:ClassType<any>, codecManager:CodecManager):EncodedObject {
    return { type: 'Class', value: codecManager.classToStringMap.get(object) };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):ClassType<any> | null {
    return codecManager.stringToClassMap.get(object.value) || null;
  }

  public decodeIntoObject(target:ClassType<any>, object:EncodedObject, codecManager:CodecManager):void {
    throw new Error('Can\'t decode into a native object because the object is passed by value, not by reference, so we\'re decoding into a local copy not the original.');
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
