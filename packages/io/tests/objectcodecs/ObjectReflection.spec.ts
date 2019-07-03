import { ObjectReflection } from '../../src/objectcodecs/ObjectReflection';
import { ObjectReflectionFactory } from '../../src/objectcodecs/ObjectReflectionFactory';
import { MockComponent } from '../__mocks__/MockComponent';
import { MockReflectionObject } from '../__mocks__/MockReflectionObject';

describe('ObjectReflection tests', () => {
  let object:MockReflectionObject;
  let reflection:ObjectReflection;

  beforeEach(() => {
    object = new MockReflectionObject();
    object.pointVariable = new MockComponent();
    reflection = new ObjectReflection(object);
  });

  it('reflection returns correct type', () => {
    expect(reflection.type).toBe('MockReflectionObject');
  });

  it('reflection returns number variable', () => {
    expect(reflection.propertyTypes.get('numberVariable')).toBe('number');
  });

  it('reflection returns boolean variable', () => {
    expect(reflection.propertyTypes.get('booleanVariable')).toBe('boolean');
  });

  it('reflection returns string variable', () => {
    expect(reflection.propertyTypes.get('stringVariable')).toBe('string');
  });

  it('reflection returns object variable', () => {
    expect(reflection.propertyTypes.get('pointVariable')).toBe('MockComponent');
  });

  it('reflection returns full accessor', () => {
    expect(reflection.propertyTypes.get('fullAccessor')).toBe('number');
  });

  it('reflection doesnt returns get only accessor', () => {
    expect(reflection.propertyTypes.get('getOnlyAccessor')).toBeUndefined();
  });

  it('reflection doesnt returns set only accessor', () => {
    expect(reflection.propertyTypes.get('setOnlyAccessor')).toBeUndefined();
  });

  it('factory caches reflection', () => {
    const object1 = new MockReflectionObject();
    const reflection1 = ObjectReflectionFactory.reflection(object1);
    const object2 = new MockReflectionObject();
    const reflection2 = ObjectReflectionFactory.reflection(object2);
    expect(reflection2).toBe(reflection1);
  });
});
