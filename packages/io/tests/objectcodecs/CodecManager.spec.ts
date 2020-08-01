import { ClassType } from '@ash.ts/core';
import { ArrayObjectCodec } from '../../src/objectcodecs/ArrayObjectCodec';
import { ClassObjectCodec } from '../../src/objectcodecs/ClassObjectCodec';
import { CodecManager } from '../../src/objectcodecs/CodecManager';
import { NativeObjectCodec } from '../../src/objectcodecs/NativeObjectCodec';
import { ReflectionObjectCodec } from '../../src/objectcodecs/ReflectionObjectCodec';
import { MockCodec, MockComponent } from '../__mocks__';

describe('CodecManager tests', () => {
  let classMap:Record<string, ClassType<any>>;
  let codecManager:CodecManager;

  beforeEach(() => {
    classMap = { MockComponent };
    codecManager = new CodecManager(classMap);
  });

  it('codec for object returns null by default', () => {
    const codec = codecManager.getCodecForObject(new MockComponent());
    expect(codec).toBeNull();
  });

  it('codec for component returns ReflectionCodec by default', () => {
    const codec = codecManager.getCodecForComponent(new MockComponent());
    expect(codec).toBeInstanceOf(ReflectionObjectCodec);
  });

  it('custom codec returned for component if set', () => {
    const setCodec = new MockCodec();
    codecManager.addCustomCodec(setCodec, MockComponent);
    const returnedCodec = codecManager.getCodecForComponent(new MockComponent());
    expect(setCodec).toBe(returnedCodec);
  });

  it('custom codec returned for object if set', () => {
    const setCodec:MockCodec = new MockCodec();
    codecManager.addCustomCodec(setCodec, MockComponent);
    const returnedCodec = codecManager.getCodecForObject(new MockComponent());
    expect(setCodec).toBe(returnedCodec);
  });

  it('codec for object returns NativeCodec for number', () => {
    const codec = codecManager.getCodecForObject(5.3);
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for component returns NativeCodec for number', () => {
    const codec = codecManager.getCodecForComponent(2.7);
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for object returns NativeCodec for string', () => {
    const codec = codecManager.getCodecForObject('Test');
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for component returns NativeCodec for string', () => {
    const codec = codecManager.getCodecForComponent('Test');
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for object returns NativeCodec for boolean', () => {
    const codec = codecManager.getCodecForObject(true);
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for component returns NativeCodec for boolean', () => {
    const codec = codecManager.getCodecForComponent(true);
    expect(codec).toBeInstanceOf(NativeObjectCodec);
  });

  it('codec for object returns ClassCodec for class', () => {
    const codec = codecManager.getCodecForObject(MockComponent);
    expect(codec).toBeInstanceOf(ClassObjectCodec);
  });

  it('codec for component returns ClassCodec for class', () => {
    const codec = codecManager.getCodecForComponent(MockComponent);
    expect(codec).toBeInstanceOf(ClassObjectCodec);
  });

  it('codec for object returns ArrayCodec for array', () => {
    const codec = codecManager.getCodecForObject([]);
    expect(codec).toBeInstanceOf(ArrayObjectCodec);
  });

  it('codec for component returns ArrayCodec for array', () => {
    const codec = codecManager.getCodecForComponent([]);
    expect(codec).toBeInstanceOf(ArrayObjectCodec);
  });
});
