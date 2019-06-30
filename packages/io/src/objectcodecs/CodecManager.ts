import { ClassType } from '@ash.ts/core';
import { EncodedObject } from '../enginecodecs/EncodedData';
import { ArrayObjectCodec } from './ArrayObjectCodec';
import { ClassObjectCodec } from './ClassObjectCodec';
import { NativeObjectCodec } from './NativeObjectCodec';
import { ObjectCodec } from './ObjectCodec';
import { ObjectReflectionFactory } from './ObjectReflectionFactory';
import { ReflectionObjectCodec } from './ReflectionObjectCodec';

export class CodecManager {
  public stringToClassMap:Map<string, ClassType<any>>;

  public classToStringMap:Map<ClassType<any>, string>;

  private codecs:Map<ClassType<any>, ObjectCodec<any>>;

  private reflectionCodec:ReflectionObjectCodec;

  public constructor(classMap:Map<string, ClassType<any>>) {
    classMap.set('number', Number);
    classMap.set('string', String);
    classMap.set('boolean', Boolean);
    this.stringToClassMap = classMap;
    const classToStringMap = new Map<ClassType<any>, string>();
    for (const [className, classType] of classMap) {
      classToStringMap.set(classType, className);
    }

    ObjectReflectionFactory.classMap = classToStringMap;
    this.classToStringMap = classToStringMap;

    this.codecs = new Map<ClassType<any>, ObjectCodec<any>>();
    this.reflectionCodec = new ReflectionObjectCodec();

    const nativeCodec:NativeObjectCodec = new NativeObjectCodec();
    this.addCustomCodec(nativeCodec, Number);
    this.addCustomCodec(nativeCodec, String);
    this.addCustomCodec(nativeCodec, Boolean);
    this.addCustomCodec(new ClassObjectCodec(), Function);
    this.addCustomCodec(new ArrayObjectCodec(), Array);
  }

  public getCodecForObject(object:any):ObjectCodec<any> | null {
    const nativeTypes:{ [key:string]:ClassType<any> } = {
      number: Number,
      string: String,
      boolean: Boolean,
    };

    let type = nativeTypes[typeof object];

    if (!type && object instanceof Array) type = Array;
    if (!type && object instanceof Object) type = object.constructor;

    if (this.codecs.has(type)) {
      return this.codecs.get(type)!;
    }

    return null;
  }

  public getCodecForType(type:ClassType<any>):ObjectCodec<any> | null {
    if (this.codecs.has(type)) {
      return this.codecs.get(type)!;
    }

    return null;
  }

  public getCodecForComponent(component:any):ObjectCodec<any> {
    const codec:ObjectCodec<any> | null = this.getCodecForObject(component);
    if (codec === null) {
      return this.reflectionCodec;
    }

    return codec;
  }

  public getCodecForComponentType(type:ClassType<any>):ObjectCodec<any> {
    const codec:ObjectCodec<any> | null = this.getCodecForType(type);
    if (codec === null) {
      return this.reflectionCodec;
    }

    return codec;
  }

  public addCustomCodec(codec:ObjectCodec<any>, type:ClassType<any>):void {
    this.codecs.set(type, codec);
  }

  public encodeComponent(object:any):EncodedObject | null {
    const codec:ObjectCodec<any> = this.getCodecForComponent(object);
    if (codec) {
      return codec.encode(object, this);
    }

    return null;
  }

  public encodeObject(object:any):EncodedObject | null {
    if (object === null) {
      return { type: 'null', value: null };
    }
    const codec:ObjectCodec<any> | null = this.getCodecForObject(object);
    if (codec) {
      return codec.encode(object, this);
    }

    return { type: 'null', value: null };
  }

  public decodeComponent(object:EncodedObject):any | null {
    if (!object.type || object.value === null) {
      return null;
    }

    const type = this.stringToClassMap.get(object.type);
    const codec:ObjectCodec<any> | null = type ? this.getCodecForComponentType(type) : null;
    if (codec) {
      return codec.decode(object, this);
    }

    return null;
  }

  public decodeObject(object:EncodedObject):any | null {
    if (!object.type || object.value === null) {
      return null;
    }

    const type = this.stringToClassMap.get(object.type);
    const codec:ObjectCodec<any> | null = type ? this.getCodecForType(type) : null;
    if (codec) {
      return codec.decode(object, this);
    }

    return null;
  }

  public decodeIntoComponent(target:any, encoded:EncodedObject):void {
    if (!encoded.type || encoded.value === null) {
      return;
    }

    const type = this.stringToClassMap.get(encoded.type);
    const codec:ObjectCodec<any> | null = type ? this.getCodecForComponentType(type) : null;
    if (codec) {
      codec.decodeIntoObject(target, encoded, this);
    }
  }

  public decodeIntoProperty(parent:any, property:string, encoded:EncodedObject):void {
    if (!encoded.type || encoded.value === null) {
      return;
    }

    const type = this.stringToClassMap.get(encoded.type);
    const codec:ObjectCodec<any> | null = type ? this.getCodecForType(type) : null;
    if (codec) {
      codec.decodeIntoProperty(parent, property, encoded, this);
    }
  }
}
