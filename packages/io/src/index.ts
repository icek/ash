/**
 * [[include:io.md]]
 * @module
 */
export { BaseEngineCodec } from './enginecodecs/BaseEngineCodec';
export type { EncodedData, EncodedEntity, EncodedComponent, EncodedObject } from './enginecodecs/EncodedData';
export type { EngineDecoder } from './enginecodecs/EngineDecoder';
export type { EngineEncoder } from './enginecodecs/EngineEncoder';
export { JsonEngineCodec } from './enginecodecs/JsonEngineCodec';
export { ObjectEngineCodec } from './enginecodecs/ObjectEngineCodec';

export type { ArrayObjectCodec } from './objectcodecs/ArrayObjectCodec';
export type { ClassObjectCodec } from './objectcodecs/ClassObjectCodec';
export { CodecManager } from './objectcodecs/CodecManager';
export type { NativeObjectCodec } from './objectcodecs/NativeObjectCodec';
export type { ObjectCodec } from './objectcodecs/ObjectCodec';
export type { ObjectReflection } from './objectcodecs/ObjectReflection';
export type { ObjectReflectionFactory } from './objectcodecs/ObjectReflectionFactory';
export type { ReflectionObjectCodec } from './objectcodecs/ReflectionObjectCodec';

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const IO_VERSION:string = '__version__/io';
