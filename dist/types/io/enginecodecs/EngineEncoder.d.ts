import { Engine } from '../../ash';
import { CodecManager } from '../objectcodecs';
export declare class EngineEncoder {
    private codecManager;
    private componentEncodingMap;
    private encodedEntities;
    private encodedComponents;
    private nextComponentId;
    private encoded;
    constructor(codecManager: CodecManager);
    reset(): void;
    encodeEngine(engine: Engine): Object;
    private encodeEntity;
    private encodeComponent;
}
