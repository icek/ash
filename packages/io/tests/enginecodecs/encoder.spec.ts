import { Class, Engine, Entity } from '@ash.ts/core';
import { EncodedComponent, EncodedData, EncodedEntity } from '../../src/enginecodecs/EncodedData';
import { ObjectEngineCodec } from '../../src';
import { MockComponent, MockComponentExtended } from '../__mocks__';

describe('Encoder tests', () => {
  let classMap:Record<string, Class>;
  let endec:ObjectEngineCodec;
  let engine:Engine;
  let firstPoint:MockComponent;
  let secondPoint:MockComponent;
  let rectangle:MockComponentExtended;
  let encodedData:EncodedData;

  beforeEach(() => {
    classMap = { MockComponent, MockComponentExtended };
    endec = new ObjectEngineCodec(classMap);
    engine = new Engine();
    firstPoint = new MockComponent(1, 2);
    secondPoint = new MockComponent(3, 4);
    rectangle = new MockComponentExtended(5, 6, 7);
    let entity:Entity = new Entity();
    entity.name = 'first';
    entity.add(firstPoint);
    engine.addEntity(entity);
    entity = new Entity();
    entity.name = 'second';
    entity.add(firstPoint);
    entity.add(rectangle);
    engine.addEntity(entity);
    entity = new Entity();
    entity.name = 'third';
    entity.add(secondPoint);
    engine.addEntity(entity);
    encodedData = endec.encodeEngine(engine);
  });

  it('encoded data has entities property', () => {
    expect(encodedData).toHaveProperty('entities');
  });

  it('encoded data has correct number of entities', () => {
    expect(encodedData.entities.length).toEqual(3);
  });

  it('entity names are correctly encoded', () => {
    const names = [
      encodedData.entities[0].name,
      encodedData.entities[1].name,
      encodedData.entities[2].name,
    ];
    expect(names).toEqual(expect.arrayContaining(['first', 'second']));
  });

  it('entities correctly share components', () => {
    let first:EncodedEntity;
    let second:EncodedEntity;
    let third:EncodedEntity;
    for (const entity of encodedData.entities) {
      if (entity.name === 'first') {
        first = entity;
      } else if (entity.name === 'second') {
        second = entity;
      } else {
        third = entity;
      }
    }
    expect(second!.components).toEqual(expect.arrayContaining([first!.components[0]]));
  });

  it('entities have correct number of components', () => {
    let first:EncodedEntity;
    let second:EncodedEntity;
    let third:EncodedEntity;
    for (const entity of encodedData.entities) {
      if (entity.name === 'first') {
        first = entity;
      } else if (entity.name === 'second') {
        second = entity;
      } else {
        third = entity;
      }
    }
    expect(first!.components.length).toEqual(1);
    expect(second!.components.length).toEqual(2);
    expect(third!.components.length).toEqual(1);
  });

  it('encoded data has components property', () => {
    expect(encodedData).toHaveProperty('components');
  });

  it('encoded data has all components', () => {
    expect(encodedData.components.length).toEqual(3);
  });

  it('first entity has correct components', () => {
    const first = encodedData.entities.find((entity) => entity.name === 'first')!;
    const pointId = first.components[0];
    const pointEncoded = encodedData.components.find((component) => component.id === pointId)!;
    expect(pointEncoded.type).toEqual('MockComponent');
    expect(pointEncoded.value.x.value).toEqual(firstPoint.x);
    expect(pointEncoded.value.y.value).toEqual(firstPoint.y);
  });

  it('second entity has correct components', () => {
    const second = encodedData.entities.find((entity) => entity.name === 'second')!;
    let pointEncoded:EncodedComponent;
    let rectangleEncoded:EncodedComponent;
    for (const id of second.components) {
      for (const component of encodedData.components) {
        if (component.id === id) {
          if (component.type === 'MockComponent') {
            pointEncoded = component;
          } else {
            rectangleEncoded = component;
          }
        }
      }
    }

    expect(pointEncoded!.type).toEqual('MockComponent');
    expect(pointEncoded!.value.x.value).toEqual(firstPoint.x);
    expect(pointEncoded!.value.y.value).toEqual(firstPoint.y);

    expect(rectangleEncoded!.type).toEqual('MockComponentExtended');
    expect(rectangleEncoded!.value.x.value).toEqual(rectangle.x);
    expect(rectangleEncoded!.value.y.value).toEqual(rectangle.y);
    expect(rectangleEncoded!.value.z.value).toEqual(rectangle.z);
  });

  it('third entity has correct components', () => {
    const third:EncodedEntity = encodedData.entities.find((entity) => entity.name === 'third')!;
    const pointId = third.components[0];
    const pointEncoded = encodedData.components.find((component) => component.id === pointId)!;

    expect(pointEncoded.type).toEqual('MockComponent');
    expect(pointEncoded.value.x.value).toEqual(secondPoint.x);
    expect(pointEncoded.value.y.value).toEqual(secondPoint.y);
  });
});
