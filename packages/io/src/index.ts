/**
 * [[include:io.md]]
 * @module @ash.ts/io
 */
export { BaseEngineCodec } from './enginecodecs/BaseEngineCodec';
export { ObjectCodec } from './objectcodecs/ObjectCodec';
export { JsonEngineCodec } from './enginecodecs/JsonEngineCodec';
export { ObjectEngineCodec } from './enginecodecs/ObjectEngineCodec';
export { EncodedData, EncodedEntity, EncodedComponent, EncodedObject } from './enginecodecs/EncodedData';
export { CodecManager } from './objectcodecs/CodecManager';
export const IO_VERSION = '__version__/io';
