import { Engine } from '../../ash';
import { CodecManager } from '../objectcodecs';
export declare class EngineDecoder {
    private codecManager;
    private componentMap;
    private encodedComponentMap;
    constructor(codecManager: CodecManager);
    reset(): void;
    decodeEngine(encodedData: Object, engine: Engine): void;
    decodeOverEngine(encodedData: Object, engine: Engine): void;
    private overlayEntity;
    private decodeEntity;
    private decodeComponent;
}
