import { assert } from 'chai';
import { ComponentMatchingFamily, Engine, Entity, NodeList } from 'ash.ts';
import { MockFamily, MockNode, MockNode2, Point } from '../mocks';

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

  it('entities getter returns all the Entities', () => {
    const entity1:Entity = new Entity();
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    engine.addEntity(entity2);
    assert.strictEqual(engine.entities.length, 2);
    assert.includeMembers(engine.entities, [entity1, entity2]);
  });

  it('getEntityByName returns correct Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    assert.strictEqual(engine.getEntityByName('myEntity'), entity2);
  });

  it('getEntityByName returns null if no Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    assert.isNull(engine.getEntityByName('wrongName'));
  });

  it('add Entity checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    assert.strictEqual(MockFamily.instances[0].newEntityCalls, 1);
    assert.strictEqual(MockFamily.instances[1].newEntityCalls, 1);
  });

  it('remove Entity checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    engine.removeEntity(entity);
    assert.strictEqual(MockFamily.instances[0].removeEntityCalls, 1);
    assert.strictEqual(MockFamily.instances[1].removeEntityCalls, 1);
  });

  it('removeAllEntities checks with all families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    const entity2:Entity = new Entity();
    engine.addEntity(entity);
    engine.addEntity(entity2);
    engine.removeAllEntities();
    assert.strictEqual(MockFamily.instances[0].removeEntityCalls, 2);
    assert.strictEqual(MockFamily.instances[1].removeEntityCalls, 2);
  });

  it('componentAdded checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new Point());
    assert.strictEqual(MockFamily.instances[0].componentAddedCalls, 1);
    assert.strictEqual(MockFamily.instances[1].componentAddedCalls, 1);
  });

  it('componentRemoved checks with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new Point());
    entity.remove(Point);
    assert.strictEqual(MockFamily.instances[0].componentRemovedCalls, 1);
    assert.strictEqual(MockFamily.instances[1].componentRemovedCalls, 1);
  });

  it('getNodeListCreatesFamily', () => {
    engine.getNodeList(MockNode);
    assert.strictEqual(MockFamily.instances.length, 1);
  });

  it('getNodeList checks all Entities', () => {
    engine.addEntity(new Entity());
    engine.addEntity(new Entity());
    engine.getNodeList(MockNode);
    assert.strictEqual(MockFamily.instances[0].newEntityCalls, 2);
  });

  it('releaseNodeList calls clean up', () => {
    engine.getNodeList(MockNode);
    engine.releaseNodeList(MockNode);
    assert.strictEqual(MockFamily.instances[0].cleanUpCalls, 1);
  });

  it('Entity can be obtained by name', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    const other:Entity = engine.getEntityByName('anything');
    assert.strictEqual(other, entity);
  });

  it('get Entity by invalid name returns null', () => {
    const entity:Entity = engine.getEntityByName('anything');
    assert.isNull(entity);
  });

  it('Entity can be obtained by name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity = engine.getEntityByName('otherName');
    assert.strictEqual(other, entity);
  });

  it('Entity cannot be obtained by old name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity = engine.getEntityByName('anything');
    assert.isNull(other);
  });
});
