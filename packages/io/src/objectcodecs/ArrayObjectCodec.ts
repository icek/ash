import { EncodedObject } from '../enginecodecs/EncodedData';
import { CodecManager } from './CodecManager';
import { ObjectCodec } from './ObjectCodec';

export class ArrayObjectCodec implements ObjectCodec<any[]> {
  public encode(object:any[], codecManager:CodecManager):EncodedObject | null {
    const value:any[] = [];
    for (const val of object) {
      const encoded = codecManager.encodeObject(val);
      if (encoded) {
        value.push(encoded);
      }
    }

    return { type: 'Array', value };
  }

  public decode(object:EncodedObject, codecManager:CodecManager):any[] | null {
    const decoded:any[] = [];
    for (const obj of object.value) {
      decoded[decoded.length] = codecManager.decodeObject(obj);
    }

    return decoded;
  }

  public decodeIntoObject(target:any[], object:EncodedObject, codecManager:CodecManager):void {
    for (const obj of object.value) {
      target[target.length] = codecManager.decodeObject(obj);
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
