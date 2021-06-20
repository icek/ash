/**
 * [[include:io.md]]
 * @module @ash.ts/io
 */
export { BaseEngineCodec } from './enginecodecs/BaseEngineCodec';
export type { ObjectCodec } from './objectcodecs/ObjectCodec';
export { JsonEngineCodec } from './enginecodecs/JsonEngineCodec';
export { ObjectEngineCodec } from './enginecodecs/ObjectEngineCodec';
export type { EncodedData, EncodedEntity, EncodedComponent, EncodedObject } from './enginecodecs/EncodedData';
export { CodecManager } from './objectcodecs/CodecManager';
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const IO_VERSION:string = '__version__/io';
