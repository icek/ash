import { Engine } from '../../ash';
export declare class JsonEngineCodec extends ObjectEngineCodec implements IEngineCodec {
    encodeEngine(engine: Engine): Object;
    decodeEngine(encodedData: Object, engine: Engine): void;
    decodeOverEngine(encodedData: Object, engine: Engine): void;
}
