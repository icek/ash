import { Class } from '@ash.ts/core';
import { ClassObjectCodec } from '../../src/objectcodecs/ClassObjectCodec';
import { CodecManager } from '../../src/objectcodecs/CodecManager';
import { MockComponent } from '../__mocks__';

describe('ClassObjectCodec tests', () => {
  let classMap:Record<string, Class<any>>;
  let codec:ClassObjectCodec;
  let codecManager:CodecManager;

  beforeEach(() => {
    classMap = { MockComponent };
    codecManager = new CodecManager(classMap);
    codec = new ClassObjectCodec();
  });

  it('encodes class with correct type', () => {
    const input = MockComponent;
    const encoded = codec.encode(input, codecManager);
    expect(encoded.type).toBe('Class');
  });

  it('encodes class with correct value', () => {
    const input = MockComponent;
    const encoded = codec.encode(input, codecManager);
    expect(encoded.value).toBe('MockComponent');
  });

  it('decodes class with correct type', () => {
    const input = MockComponent;
    const encoded = codec.encode(input, codecManager);
    const decoded = codec.decode(encoded, codecManager);
    expect(decoded).toBeInstanceOf(Function);
  });

  it('decodes class with correct value', () => {
    const input = MockComponent;
    const encoded = codec.encode(input, codecManager);
    const decoded = codec.decode(encoded, codecManager);
    expect(decoded).toBe(MockComponent);
  });
});
