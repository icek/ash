import { ComponentMatchingFamily, Engine, Entity, NodeList } from 'ash.ts';
import { MockComponent, MockComponent1, MockNode } from '../__mocks__';

describe('ComponentMatchingFamily tests', () => {
  let engine:Engine;
  let family:ComponentMatchingFamily<MockNode>;

  beforeEach(() => {
    engine = new Engine();
    family = new ComponentMatchingFamily(MockNode, engine);
  });

  afterEach(() => {
    engine = null;
    family = null;
  });

  it('NodeList is initially empty', () => {
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head).toBeNull();
  });

  it('matching Entity is added when access NodeList test 1', () => {
    const nodes:NodeList<MockNode> = family.nodeList;
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.newEntity(entity);
    expect(nodes.head.entity).toEqual(entity);
  });

  it('matching Entity is added when access NodeList test 2', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.newEntity(entity);
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head.entity).toEqual(entity);
  });

  it('Node contains Entity properties', () => {
    const entity:Entity = new Entity();
    const component:MockComponent = new MockComponent();
    entity.add(component);
    family.newEntity(entity);
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head.component).toEqual(component);
  });

  it('matching Entity is added when Component added', () => {
    const nodes:NodeList<MockNode> = family.nodeList;
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.componentAddedToEntity(entity, MockComponent);
    expect(nodes.head.entity).toEqual(entity);
  });

  it('non matching Entity is not added', () => {
    const entity:Entity = new Entity();
    family.newEntity(entity);
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head).toBeNull();
  });

  it('non matching Entity is not added when Component added', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent1());
    family.componentAddedToEntity(entity, MockComponent1);
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head).toBeNull();
  });

  it('Entity is removed when access NodeList', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.newEntity(entity);
    const nodes:NodeList<MockNode> = family.nodeList;
    family.removeEntity(entity);
    expect(nodes.head).toBeNull();
  });

  it('Entity is removed when Component removed', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.newEntity(entity);
    entity.remove(MockComponent);
    family.componentRemovedFromEntity(entity, MockComponent);
    const nodes:NodeList<MockNode> = family.nodeList;
    expect(nodes.head).toBeNull();
  });

  it('NodeList contains only matching Entities', () => {
    const entities:Entity[] = [];
    const numTimes = 5;
    for (let i = 0; i < numTimes; ++i) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent());
      entities.push(entity);
      family.newEntity(entity);
      family.newEntity(new Entity());
    }

    const nodes:NodeList<MockNode> = family.nodeList;
    for (let node:MockNode = nodes.head; node; node = node.next) {
      expect(entities).toContain(node.entity);
    }
  });

  it('NodeList contains all matching Entities', () => {
    const entities:Entity[] = [];
    const numTimes = 5;
    for (let i = 0; i < numTimes; ++i) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent());
      entities.push(entity);
      family.newEntity(entity);
      family.newEntity(new Entity());
    }

    const nodes:NodeList<MockNode> = family.nodeList;
    let node:MockNode;
    for (node = nodes.head; node; node = node.next) {
      const index = entities.indexOf(node.entity);
      entities.splice(index, 1);
    }
    expect(entities.length).toEqual(0);
  });

  it('clean up empties NodeList', () => {
    const entity:Entity = new Entity();
    entity.add(new MockComponent());
    family.newEntity(entity);
    const nodes:NodeList<MockNode> = family.nodeList;
    family.cleanUp();
    expect(nodes.head).toBeNull();
  });

  it('clean up sets next Node to null', () => {
    const entities:Array<Entity> = [];
    const numTimes = 5;
    for (let i = 0; i < numTimes; ++i) {
      const entity:Entity = new Entity();
      entity.add(new MockComponent());
      entities.push(entity);
      family.newEntity(entity);
    }

    const nodes:NodeList<MockNode> = family.nodeList;
    const node:MockNode = nodes.head.next;
    family.cleanUp();
    expect(node.next).toBeNull();
  });
});
