import { ClassType } from '@ash.ts/core';
import { ArrayObjectCodec } from '../../src/objectcodecs/ArrayObjectCodec';
import { CodecManager } from '../../src/objectcodecs/CodecManager';
import { MockComponent } from '../__mocks__';

describe('ArrayObjectCodec tests', () => {
  let classMap:Record<string, ClassType<any>>;
  let codec:ArrayObjectCodec;
  let codecManager:CodecManager;

  beforeEach(() => {
    classMap = { MockComponent };
    codecManager = new CodecManager(classMap);
    codec = new ArrayObjectCodec();
  });

  it('encodes array with correct type', () => {
    const input = [7, 6, 5, 4, 3];
    const encoded = codec.encode(input, codecManager);
    expect(encoded!.type).toBe('Array');
  });

  it('encodes array with correct properties', () => {
    const input = [7, 6, 5, 4, 3];
    const encoded = codec.encode(input, codecManager);
    expect(encoded!.value.length).toBe(5);
    expect(encoded!.value[0].value).toBe(7);
    expect(encoded!.value[1].value).toBe(6);
    expect(encoded!.value[2].value).toBe(5);
    expect(encoded!.value[3].value).toBe(4);
    expect(encoded!.value[4].value).toBe(3);
  });

  it('decodes array with correct type', () => {
    const input = [7, 6, 5, 4, 3];
    const encoded = codec.encode(input, codecManager);
    const decoded = codec.decode(encoded!, codecManager);
    expect(decoded).toBeInstanceOf(Array);
  });

  it('decodes array with correct properties', () => {
    const input = [7, 6, 5, 4, 3];
    const encoded = codec.encode(input, codecManager);
    const decoded = codec.decode(encoded!, codecManager);
    expect(decoded).toEqual(expect.arrayContaining(input));
  });
});
