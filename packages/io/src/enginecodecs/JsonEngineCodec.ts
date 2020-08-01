import { Engine } from '@ash.ts/core';
import { BaseEngineCodec } from './BaseEngineCodec';
import { EncodedData } from './EncodedData';

export class JsonEngineCodec extends BaseEngineCodec<string> {
  public encodeEngine(engine:Engine):string {
    return JSON.stringify(this.encoder.encodeEngine(engine));
  }

  public decodeEngine(encodedData:string, engine:Engine):void {
    const object:EncodedData = JSON.parse(encodedData);
    this.decoder.decodeEngine(object, engine);
  }

  public decodeOverEngine(encodedData:string, engine:Engine):void {
    const object:EncodedData = JSON.parse(encodedData);
    this.decoder.decodeOverEngine(object, engine);
  }
}
