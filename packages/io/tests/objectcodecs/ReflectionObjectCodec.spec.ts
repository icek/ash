import { ClassType } from '@ash.ts/core';
import { EncodedObject } from '../../src/enginecodecs/EncodedData';
import { CodecManager } from '../../src/objectcodecs/CodecManager';
import { ReflectionObjectCodec } from '../../src/objectcodecs/ReflectionObjectCodec';
import { MockComponent, MockComponentExtended } from '../__mocks__/MockComponent';
import { MockReflectionObject } from '../__mocks__/MockReflectionObject';

describe('ReflectionObjectCodec tests', () => {
  let classMap:Map<string, ClassType<any>>;
  let object:MockReflectionObject;
  let encoded:EncodedObject | null;
  let decoded:any;

  beforeEach(() => {
    classMap = new Map();
    classMap.set('MockComponent', MockComponent);
    classMap.set('MockComponentExtended', MockComponentExtended);
    classMap.set('MockReflectionObject', MockReflectionObject);
    object = new MockReflectionObject();
    object.numberVariable = 23.678;
    object.stringVariable = 'A test string';
    object.booleanVariable = true;
    object.fullAccessor = 13;
    object.pointVariable = new MockComponent(2, 3);
    object.matrixVariable = new MockComponentExtended(1, 2, 3);
    const codecManager:CodecManager = new CodecManager(classMap);
    codecManager.addCustomCodec(new ReflectionObjectCodec(), MockComponent);
    const encoder:ReflectionObjectCodec = new ReflectionObjectCodec();
    encoded = encoder.encode(object, codecManager);
    decoded = encoder.decode(encoded!, codecManager);
  });

  it('encoding returns correct type', () => {
    expect(encoded!.type).toBe('MockReflectionObject');
  });

  it('encoding returns number variable', () => {
    expect(encoded!.value.numberVariable.value).toBe(object.numberVariable);
  });

  it('encoding returns boolean variable', () => {
    expect(encoded!.value.booleanVariable.value).toBe(object.booleanVariable);
  });

  it('encoding returns string variable', () => {
    expect(encoded!.value.stringVariable.value).toBe(object.stringVariable);
  });

  it('encoding returns ReflectableObject variable', () => {
    expect(encoded!.value.pointVariable.type).toBe('MockComponent');
    expect(encoded!.value.pointVariable.value.x.value).toBe(object.pointVariable!.x);
    expect(encoded!.value.pointVariable.value.y.value).toBe(object.pointVariable!.y);
  });

  it('encoding returns null for reflectable null variable', () => {
    expect(encoded!.value.point2Variable.value).toBeNull();
  });

  it('encoding returns null for non reflectable variable', () => {
    expect(encoded!.value.matrixVariable.value).toBeNull();
  });

  it('encoding returns null for non reflectable null variable', () => {
    expect(encoded!.value.matrix2Variable.value).toBeNull();
  });

  it('encoding returns full accessor', () => {
    expect(encoded!.value.fullAccessor.value).toBe(object.fullAccessor);
  });

  it('decoding returns correct type', () => {
    expect(decoded).toBeInstanceOf(MockReflectionObject);
  });

  it('decoding returns number variable', () => {
    expect(decoded.numberVariable).toBe(object.numberVariable);
  });

  it('decoding returns boolean variable', () => {
    expect(decoded.booleanVariable).toBe(object.booleanVariable);
  });

  it('decoding returns string variable', () => {
    expect(decoded.stringVariable).toBe(object.stringVariable);
  });

  it('decoding returns ReflectableObject variable', () => {
    expect(decoded.pointVariable).toBeInstanceOf(MockComponent);
    expect(decoded.pointVariable.x).toBe(object.pointVariable!.x);
    expect(decoded.pointVariable.y).toBe(object.pointVariable!.y);
  });

  it('decoding returns full accessor', () => {
    expect(decoded.fullAccessor).toBe(object.fullAccessor);
  });
});
