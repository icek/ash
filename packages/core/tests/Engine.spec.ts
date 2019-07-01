import { Engine, Entity } from '../src';
import {
  MockComponent,
  MockFamily,
  MockNode,
  MockNode2,
} from './__mocks__';

describe('Engine tests', () => {
  let engine:Engine;

  beforeEach(() => {
    engine = new Engine();
    engine.FamilyClass = MockFamily;
    MockFamily.reset();
  });

  afterEach(() => {
    (engine as Engine | null) = null;
  });

  it('entities getter should return all the Entities', () => {
    const entity1:Entity = new Entity();
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    engine.addEntity(entity2);
    expect(engine.entities.length).toBe(2);
    expect(engine.entities).toEqual(expect.arrayContaining([entity1, entity2]));
  });

  it('getEntityByName should return correct Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    expect(engine.getEntityByName('myEntity')).toBe(entity2);
  });

  it('getEntityByName should return null if no Entity', () => {
    const entity1:Entity = new Entity();
    entity1.name = 'otherEntity';
    engine.addEntity(entity1);
    const entity2:Entity = new Entity();
    entity2.name = 'myEntity';
    engine.addEntity(entity2);
    expect(engine.getEntityByName('wrongName')).toBeNull();
  });

  it('should throw Error when added Entity with the same name', () => {
    const entity1 = new Entity('entity-name');
    engine.addEntity(entity1);
    const entity2 = new Entity('entity-name');
    expect(() => {
      engine.addEntity(entity2);
    }).toThrowError();
  });

  it('addEntity should check with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    expect(MockFamily.instances[0].newEntityCalls).toBe(1);
    expect(MockFamily.instances[1].newEntityCalls).toBe(1);
  });

  it('removeEntity should check with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    engine.removeEntity(entity);
    expect(MockFamily.instances[0].removeEntityCalls).toBe(1);
    expect(MockFamily.instances[1].removeEntityCalls).toBe(1);
  });

  it('removeAllEntities should check with all Families', () => {
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

  it('componentAdded should check with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new MockComponent());
    expect(MockFamily.instances[0].componentAddedCalls).toBe(1);
    expect(MockFamily.instances[1].componentAddedCalls).toBe(1);
  });

  it('componentRemoved should check with all Families', () => {
    engine.getNodeList(MockNode);
    engine.getNodeList(MockNode2);
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    entity.add(new MockComponent());
    entity.remove(MockComponent);
    expect(MockFamily.instances[0].componentRemovedCalls).toBe(1);
    expect(MockFamily.instances[1].componentRemovedCalls).toBe(1);
  });

  it('getNodeList should create a Family', () => {
    engine.getNodeList(MockNode);
    expect(MockFamily.instances.length).toBe(1);
  });

  it('getNodeList should get an existing Family if it\'s already created', () => {
    const nodeList1 = engine.getNodeList(MockNode);
    const nodeList2 = engine.getNodeList(MockNode);
    expect(nodeList1).toBe(nodeList2);
  });

  it('getNodeList should check all Entities', () => {
    engine.addEntity(new Entity());
    engine.addEntity(new Entity());
    engine.getNodeList(MockNode);
    expect(MockFamily.instances[0].newEntityCalls).toBe(2);
  });

  it('releaseNodeList should call clean up', () => {
    engine.getNodeList(MockNode);
    engine.releaseNodeList(MockNode);
    expect(MockFamily.instances[0].cleanUpCalls).toBe(1);
  });

  it('Entity should be obtained by name', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    const other:Entity | null = engine.getEntityByName('anything');
    expect(other).toBe(entity);
  });

  it('get Entity by invalid name should return null', () => {
    const entity:Entity | null = engine.getEntityByName('anything');
    expect(entity).toBeNull();
  });

  it('Entity shouldn\'t be obtained by name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity | null = engine.getEntityByName('otherName');
    expect(other).toBe(entity);
  });

  it('Entity shouldn\'t be obtained by old name after renaming', () => {
    const entity:Entity = new Entity('anything');
    engine.addEntity(entity);
    entity.name = 'otherName';
    const other:Entity | null = engine.getEntityByName('anything');
    expect(other).toBeNull();
  });
});
