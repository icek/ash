import { Engine, Entity, NodeList } from '../../src';
import { MockComponent1, MockComponent2, MockNode2 } from '../__mocks__';

describe('Engine and Family integration tests', () => {
  let engine:Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  afterEach(() => {
    (engine as Engine | null) = null;
  });

  it('Family is initially empty', () => {
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    expect(nodes.head).toBeNull();
  });

  it('Node contains Entity properties', () => {
    const entity:Entity = new Entity();
    const component1:MockComponent1 = new MockComponent1();
    const component2:MockComponent2 = new MockComponent2();
    entity.add(component1);
    entity.add(component2);

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    expect(nodes.head!.component1).toBe(component1);
    expect(nodes.head!.component2).toBe(component2);
  });

  it('correct Entity added to Family when access Family first', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    expect(nodes.head!.entity).toBe(entity);
  });

  it('correct Entity added to Family when access Family second', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    expect(nodes.head!.entity).toBe(entity);
  });

  it('correct Entity added to Family when Components added', () => {
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    expect(nodes.head!.entity).toBe(entity);
  });

  it('incorrect Entity not added to Family when access Family first', () => {
    const entity:Entity = new Entity();
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    expect(nodes.head).toBeNull();
  });

  it('incorrect Entity not added to Family when access Family second', () => {
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    expect(nodes.head).toBeNull();
  });

  it('Entity removed from family when Component removed and Family already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    entity.remove(MockComponent1);
    expect(nodes.head).toBeNull();
  });

  it('Entity removed from Family when Component removed and Family not already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    entity.remove(MockComponent1);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    expect(nodes.head).toBeNull();
  });

  it('Entity removed from Family when removed from Engine and Family already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.removeEntity(entity);
    expect(nodes.head).toBeNull();
  });

  it('Entity removed from Family when removed from Engine and Family not already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    engine.removeEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    expect(nodes.head).toBeNull();
  });

  it('Family contains only matching Entities', () => {
    const entities:Entity[] = [];
    for (let i = 0; i < 5; i += 1) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent1());
      entity.add(new MockComponent2());
      entities.push(entity);
      engine.addEntity(entity);
    }

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    let node:MockNode2 | null;
    for (node = nodes.head; node; node = node.next) {
      expect(entities).toContain(node.entity);
    }
  });

  it('Family contains all matching Entities', () => {
    const entities:Entity[] = [];
    for (let i = 0; i < 5; i += 1) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent1());
      entity.add(new MockComponent2());
      entities.push(entity);
      engine.addEntity(entity);
    }

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    let node:MockNode2 | null;
    for (node = nodes.head; node; node = node.next) {
      const index:number = entities.indexOf(node.entity);
      entities.splice(index, 1);
    }
    expect(entities).toEqual(expect.arrayContaining([]));
  });

  it('release Family empties NodeList', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.releaseNodeList(MockNode2);
    expect(nodes.head).toBeNull();
  });

  it('release Family sets next Node to null', () => {
    for (let i = 0; i < 5; i += 1) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent1());
      entity.add(new MockComponent2());
      engine.addEntity(entity);
    }

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    const node:MockNode2 = nodes.head!.next!;
    engine.releaseNodeList(MockNode2);
    expect(node.next).toBeNull();
  });

  it('removeAllEntities does what it says', () => {
    let entity:Entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    entity = new Entity();
    entity.add(new MockComponent1());
    entity.add(new MockComponent2());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.removeAllEntities();
    expect(nodes.head).toBeNull();
  });
});
