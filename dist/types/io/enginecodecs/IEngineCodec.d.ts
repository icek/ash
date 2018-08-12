import { Engine } from '../../ash/index';
import { IObjectCodec } from '../objectcodecs/index';
import { Signal1 } from '../../signals/index';
export interface IEngineCodec {
    addCustomCodec(codec: IObjectCodec, ...types: any[]): void;
    encodeEngine(engine: Engine): Object;
    decodeEngine(encodedData: Object, engine: Engine): void;
    decodeOverEngine(encodedData: Object, engine: Engine): void;
    encodeComplete: Signal1;
    decodeComplete: Signal1;
}
