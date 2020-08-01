import { ClassType, Engine, Entity } from '@ash.ts/core';
import { JsonEngineCodec } from '../../src';
import { EncodedData } from '../../src/enginecodecs/EncodedData';
import { MockComponent1, MockComponent2 } from '../__mocks__';

describe('JsonEngineCodec tests', () => {
  let classMap:Record<string, ClassType<any>>;
  let endec:JsonEngineCodec;
  let original:Engine;
  let engine:Engine;
  let firstComponent1:MockComponent1;
  let secondComponent1:MockComponent1;
  let onlyComponent2:MockComponent2;
  let encodedData:string;

  beforeEach(() => {
    classMap = { MockComponent1, MockComponent2 };
    endec = new JsonEngineCodec(classMap);
    original = new Engine();
    firstComponent1 = new MockComponent1(1);
    secondComponent1 = new MockComponent1(3);
    onlyComponent2 = new MockComponent2(5);
    let entity:Entity = new Entity('first');
    entity.add(firstComponent1);
    original.addEntity(entity);
    entity = new Entity('second');
    entity.add(firstComponent1);
    entity.add(onlyComponent2);
    original.addEntity(entity);
    entity = new Entity('third');
    entity.add(secondComponent1);
    original.addEntity(entity);
    encodedData = endec.encodeEngine(original);
    engine = new Engine();
    endec.decodeEngine(encodedData, engine);
  });

  it('encoded data is a string', () => {
    expect(typeof encodedData).toBe('string');
  });

  it('decoded has correct number of entities', () => {
    expect(engine.entities.length).toEqual(3);
  });

  it('decoded has correct entity names', () => {
    const names = engine.entities.map((entity) => entity.name);
    expect(names).toEqual(expect.arrayContaining(['first', 'second', 'third']));
  });

  it('first entity has correct components', () => {
    const first = engine.entities.find((entity) => entity.name === 'first')!;
    expect(first.getAll().length).toEqual(1);
    const component = first.get(MockComponent1);
    expect(component).not.toBeNull();
  });

  it('second entity has correct components', () => {
    const second = engine.entities.find((entity) => entity.name === 'second')!;
    expect(second.getAll().length).toEqual(2);
    let component:any = second.get(MockComponent1);
    expect(component).not.toBeNull();
    component = second.get(MockComponent2);
    expect(component).not.toBeNull();
  });

  it('third entity has correct components', () => {
    const third = engine.entities.find((entity) => entity.name === 'third')!;
    expect(third.getAll().length).toEqual(1);
    const component = third.get(MockComponent1);
    expect(component).not.toBeNull();
  });

  it('entities correctly share components', () => {
    let first:Entity;
    let second:Entity;
    for (const entity of engine.entities) {
      if (entity.name === 'first') {
        first = entity;
      } else if (entity.name === 'second') {
        second = entity;
      }
    }
    expect(first!.get(MockComponent1)).toBe(second!.get(MockComponent1));
  });

  it('first entity components have correct values', () => {
    const first = engine.entities.find((entity) => entity.name === 'first')!;
    const component = first.get(MockComponent1)!;
    expect(component.x).toEqual(firstComponent1.x);
  });

  it('second entity components have correct values', () => {
    const second = engine.entities.find((entity) => entity.name === 'second')!;
    let component:any = second.get(MockComponent1)!;
    expect(component.x).toEqual(firstComponent1.x);
    component = second.get(MockComponent2)!;
    expect(component.y).toEqual(onlyComponent2.y);
  });

  it('third entity components have correct values', () => {
    const third = engine.entities.find((entity) => entity.name === 'third')!;
    const component = third.get(MockComponent1)!;
    expect(component.x).toEqual(secondComponent1.x);
  });

  it('after making changes and decoding over engine state should be the same as in the beginning', () => {
    const first = engine.entities.find((entity) => entity.name === 'first')!;
    const second = engine.entities.find((entity) => entity.name === 'second')!;
    const third = engine.entities.find((entity) => entity.name === 'third')!;
    const component1 = first.get(MockComponent1)!;
    component1.x = 11;
    const component2 = second.get(MockComponent2)!;
    component2.y = 22;
    engine.removeEntity(third);
    endec.decodeOverEngine(encodedData, engine);
    expect(component1.x).toEqual(firstComponent1.x);
    expect(component2.y).toEqual(onlyComponent2.y);
    expect(engine.getEntityByName('third')).not.toBeNull();
  });
});
