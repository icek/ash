import { IObjectCodec } from '../objectcodecs';
declare type Class = {
    new (..._: any[]): any;
};
export declare class CodecManager {
    private codecs;
    private reflectionCodec;
    private arrayCodec;
    constructor();
    getCodecForObject(object: Object): IObjectCodec;
    getCodecForType(type: Class): IObjectCodec;
    getCodecForComponent(component: Object): IObjectCodec;
    getCodecForComponentType(type: Class): IObjectCodec;
    addCustomCodec(codec: IObjectCodec, type: {
        new (..._: any[]): any;
    }): void;
    encodeComponent(object: Object): Object;
    encodeObject(object: Object): Object;
    decodeComponent(object: Object): Object;
    decodeObject(object: Object): Object;
    decodeIntoComponent(target: Object, encoded: Object): void;
    decodeIntoProperty(parent: Object, property: String, encoded: Object): void;
}
export {};
