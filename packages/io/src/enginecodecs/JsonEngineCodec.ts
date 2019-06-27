import { Engine } from '@ash.ts/core';
import { EncodedData } from './EncodedData';
import { EngineCodec } from './EngineCodec';
import { ObjectEngineCodec } from './ObjectEngineCodec';

export class JsonEngineCodec extends ObjectEngineCodec implements EngineCodec<string> {
  public encodeEngine(engine:Engine):any {
    const object:EncodedData = super.encodeEngine(engine);

    return JSON.stringify(object);
  }

  public decodeEngine(encodedData:any, engine:Engine):void {
    const object:EncodedData = JSON.parse(encodedData);
    super.decodeEngine(object, engine);
  }

  public decodeOverEngine(encodedData:any, engine:Engine):void {
    const object:EncodedData = JSON.parse(encodedData);
    super.decodeOverEngine(object, engine);
  }
}
