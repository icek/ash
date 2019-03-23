// tslint:disable:no-magic-numbers

import { Engine, Entity } from 'ash.ts';
import { MockComponent } from '../__mocks__/MockComponent';
import { MockFamily } from '../__mocks__/MockFamily';
import { MockNode, MockNode2 } from '../__mocks__/MockNode';

describe('Engine tests', () => {
  let engine:Engine = null;

  beforeEach(() => {
    engine = new Engine();
    engine.familyClass = MockFamily;
    MockFamily.reset();
  });

  afterEach(() => {
    engine = null;
  });

  // it('entities getter returns all the Entities', () => {
  //   const entity1:Entity = new Entity();
  //   engine.addEntity(entity1);
  //   const entity2:Entity = new Entity();
  //   engine.addEntity(entity2);
  //   expect(engine.entities.length).toBe(2);
  //   assert.includeMembers(engine.entities, [entity1, entity2]);
  // });

  it('getEntityByName returns correct Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    expect(engine.getEntityByName('myEntity')).toBe(entity2);
  });

  it('getEntityByName returns null if no Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    expect(engine.getEntityByName('wrongName')).toBeNull();
  });

  it('add Entity checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    expect(MockFamily.instances[0].newEntityCalls).toBe(1);
    expect(MockFamily.instances[1].newEntityCalls).toBe(1);
  });

  it('remove Entity checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    engine.removeEntity(entity);
    expect(MockFamily.instances[0].removeEntityCalls).toBe(1);
    expect(MockFamily.instances[1].removeEntityCalls).toBe(1);
  });

  it('removeAllEntities checks with all families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    const entity2:Entity = new Entity();
    engine.addEntity(entity);
    engine.addEntity(entity2);
    engine.removeAllEntities();
    expect(MockFamily.instances[0].removeEntityCalls).toBe(2);
    expect(MockFamily.instances[1].removeEntityCalls).toBe(2);
  });

  it('componentAdded checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new MockComponent());
    expect(MockFamily.instances[0].componentAddedCalls).toBe(1);
    expect(MockFamily.instances[1].componentAddedCalls).toBe(1);
  });

  it('componentRemoved checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new MockComponent());
    entity.remove(MockComponent);
    expect(MockFamily.instances[0].componentRemovedCalls).toBe(1);
    expect(MockFamily.instances[1].componentRemovedCalls).toBe(1);
  });

  it('getNodeListCreatesFamily', () => {
    engine.getNodeList(MockNode);
    expect(MockFamily.instances.length).toBe(1);
  });

  it('getNodeList checks all Entities', () => {
    engine.addEntity(new Entity());
    engine.addEntity(new Entity());
    engine.getNodeList(MockNode);
    expect(MockFamily.instances[0].newEntityCalls).toBe(2);
  });

  it('releaseNodeList calls clean up', () => {
    engine.getNodeList(MockNode);
    engine.releaseNodeList(MockNode);
    expect(MockFamily.instances[0].cleanUpCalls).toBe(1);
  });

  it('Entity can be obtained by name', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    const other:Entity = engine.getEntityByName('anything');
    expect(other).toBe(entity);
  });

  it('get Entity by invalid name returns null', () => {
    const entity:Entity = engine.getEntityByName('anything');
    expect(entity).toBeNull();
  });

  it('Entity can be obtained by name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity = engine.getEntityByName('otherName');
    expect(other).toBe(entity);
  });

  it('Entity cannot be obtained by old name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity = engine.getEntityByName('anything');
    expect(other).toBeNull();
  });
});
