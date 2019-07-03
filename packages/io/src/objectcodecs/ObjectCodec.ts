import { CodecManager } from './CodecManager';
import { EncodedObject } from '../enginecodecs/EncodedData';

export interface ObjectCodec<T> {
  encode(object:T, codecManager:CodecManager):EncodedObject | null;

  decode(object:EncodedObject, codecManager:CodecManager):T | null;

  decodeIntoObject(target:T, object:EncodedObject, codecManager:CodecManager):void;

  decodeIntoProperty(parent:any, property:string, object:EncodedObject, codecManager:CodecManager):void;
}
