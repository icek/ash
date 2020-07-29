import { ClassType, Engine } from '@ash.ts/core';
import { Signal1 } from '@ash.ts/signals';
import { CodecManager } from '../objectcodecs/CodecManager';
import { ObjectCodec } from '../objectcodecs/ObjectCodec';
import { EncodedData } from './EncodedData';
import { EngineCodec } from './EngineCodec';
import { EngineDecoder } from './EngineDecoder';
import { EngineEncoder } from './EngineEncoder';

export class ObjectEngineCodec implements EngineCodec<EncodedData> {
  private encoder:EngineEncoder;

  private decoder:EngineDecoder;

  private codecManager:CodecManager;

  private encodeCompleteSignal:Signal1<EncodedData> = new Signal1();

  private decodeCompleteSignal:Signal1<Engine> = new Signal1();

  public constructor(classMap:Map<string, ClassType<any>>) {
    this.codecManager = new CodecManager(classMap);
    this.encoder = new EngineEncoder(this.codecManager);
    this.decoder = new EngineDecoder(this.codecManager);
  }

  public addCustomCodec(codec:ObjectCodec<any>, ...types:any[]):void {
    for (const type of types) {
      this.codecManager.addCustomCodec(codec, type);
    }
  }

  public encodeEngine(engine:Engine):EncodedData {
    this.encoder.reset();
    const encoded:EncodedData = this.encoder.encodeEngine(engine);
    this.encodeCompleteSignal.dispatch(encoded);

    return encoded;
  }

  public decodeEngine(encodedData:EncodedData, engine:Engine):void {
    this.decoder.reset();
    this.decoder.decodeEngine(encodedData, engine);
    this.decodeCompleteSignal.dispatch(engine);
  }

  public decodeOverEngine(encodedData:EncodedData, engine:Engine):void {
    this.decoder.reset();
    this.decoder.decodeOverEngine(encodedData, engine);
    this.decodeCompleteSignal.dispatch(engine);
  }

  public get encodeComplete():Signal1<EncodedData> {
    return this.encodeCompleteSignal;
  }

  public get decodeComplete():Signal1<Engine> {
    return this.decodeCompleteSignal;
  }
}
