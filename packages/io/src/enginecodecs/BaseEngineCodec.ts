import { ClassType, Engine } from '@ash.ts/core';
import { CodecManager } from '../objectcodecs/CodecManager';
import { ObjectCodec } from '../objectcodecs/ObjectCodec';
import { EngineDecoder } from './EngineDecoder';
import { EngineEncoder } from './EngineEncoder';

export abstract class BaseEngineCodec<T> {
  protected codecManager:CodecManager;

  protected encoder:EngineEncoder;

  protected decoder:EngineDecoder;

  public constructor(classMap:Record<string, ClassType<any>>) {
    this.codecManager = new CodecManager(classMap);
    this.encoder = new EngineEncoder(this.codecManager);
    this.decoder = new EngineDecoder(this.codecManager);
  }

  public addCustomCodec(codec:ObjectCodec<any>, ...types:any[]):void {
    for (const type of types) {
      this.codecManager.addCustomCodec(codec, type);
    }
  }

  abstract encodeEngine(engine:Engine):T;

  abstract decodeEngine(encodedData:T, engine:Engine):void;

  abstract decodeOverEngine(encodedData:T, engine:Engine):void;
}
