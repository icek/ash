import { Class } from '@ash.ts/core';
import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';

export class ClassObjectCodec implements ObjectCodec<Class<any>> {
  public encode(object:Class<any>, codecManager:CodecManager):EncodedObject {
    return { type: 'Class', value: codecManager.classToStringMap.get(object) };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):Class<any> | null {
    return codecManager.stringToClassMap[object.value] || null;
  }

  public decodeIntoObject(target:Class<any>, object:EncodedObject, codecManager:CodecManager):void {
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
