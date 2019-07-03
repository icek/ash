import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';

export class NativeObjectCodec implements ObjectCodec<number | boolean | string> {
  public encode(object:number | boolean | string, codecManager:CodecManager):EncodedObject {
    return { type: typeof object, value: object };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):number | boolean | string {
    return object.value;
  }

  public decodeIntoObject(target:number | boolean | string, object:EncodedObject, codecManager:CodecManager):void {
    throw new Error('Can\'t decode into a native object because the object is passed by value, not by reference,'
      + 'so we\'re decoding into a local copy not the original.');
  }

  public decodeIntoProperty(
    parent:Record<string, any>,
    property:string,
    object:EncodedObject,
    codecManager:CodecManager,
  ):void {
    parent[property] = object.value;
  }
}
