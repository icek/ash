/* eslint-disable @typescript-eslint/no-empty-function */
import { EncodedObject } from '@ash.ts/io';
import { CodecManager } from '../../src/objectcodecs/CodecManager';
import { ObjectCodec } from '../../src/objectcodecs/ObjectCodec';

export class MockCodec implements ObjectCodec<any> {
  public encode(object:any, codecManager:CodecManager):EncodedObject | null {
    return null;
  }

  public decode(object:EncodedObject, codecManager:CodecManager):any | null {
    return null;
  }

  public decodeIntoObject(target:any, object:EncodedObject, codecManager:CodecManager):void {

  }

  public decodeIntoProperty(parent:any, property:string, object:EncodedObject, codecManager:CodecManager):void {

  }
}
