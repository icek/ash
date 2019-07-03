import { Engine } from '@ash.ts/core';
import { Signal1 } from '@ash.ts/signals';
import { ObjectCodec } from '../objectcodecs/ObjectCodec';
import { EncodedData } from './EncodedData';

export interface EngineCodec<T> {
  addCustomCodec(codec:ObjectCodec<any>, ...types:any[]):void;

  encodeEngine(engine:Engine):T;

  decodeEngine(encodedData:T, engine:Engine):void;

  decodeOverEngine(encodedData:T, engine:Engine):void;

  encodeComplete:Signal1<EncodedData>;

  decodeComplete:Signal1<Engine>;
}
