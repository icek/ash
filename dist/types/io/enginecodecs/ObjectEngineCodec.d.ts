import { Engine } from '../../ash/index';
import { IEngineCodec, IObjectCodec } from '../objectcodecs/index';
import { Signal1 } from '../../signals/index';
export declare class ObjectEngineCodec implements IEngineCodec {
    private encoder;
    private decoder;
    private codecManager;
    private encodeCompleteSignal;
    private decodeCompleteSignal;
    constructor();
    addCustomCodec(codec: IObjectCodec, ...types: any[]): void;
    encodeEngine(engine: Engine): Object;
    decodeEngine(encodedData: Object, engine: Engine): void;
    decodeOverEngine(encodedData: Object, engine: Engine): void;
    readonly encodeComplete: Signal1;
    readonly decodeComplete: Signal1;
}
