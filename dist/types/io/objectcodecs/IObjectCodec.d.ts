export interface IObjectCodec {
    encode(object: Object, codecManager: CodecManager): Object;
    decode(object: Object, codecManager: CodecManager): Object;
    decodeIntoObject(target: Object, object: Object, codecManager: CodecManager): void;
    decodeIntoProperty(parent: Object, property: String, object: Object, codecManager: CodecManager): void;
}
