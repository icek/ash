import { Engine } from '@ash.ts/core';
import { BaseEngineCodec } from './BaseEngineCodec';
import { EncodedData } from './EncodedData';

export class ObjectEngineCodec extends BaseEngineCodec<EncodedData> {
  public encodeEngine(engine:Engine):EncodedData {
    return this.encoder.encodeEngine(engine);
  }

  public decodeEngine(encodedData:EncodedData, engine:Engine):void {
    this.decoder.decodeEngine(encodedData, engine);
  }

  public decodeOverEngine(encodedData:EncodedData, engine:Engine):void {
    this.decoder.decodeOverEngine(encodedData, engine);
  }
}
