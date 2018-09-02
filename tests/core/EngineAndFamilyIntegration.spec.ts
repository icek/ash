// tslint:disable:no-magic-numbers
import { Engine, Entity, NodeList } from 'ash.ts';
import { assert } from 'chai';
import { Matrix, MockNode2, Point } from '../mocks';

describe('Engine and Family integration tests', () => {
  let engine:Engine = null;

  beforeEach(() => {
    engine = new Engine();
  });

  afterEach(() => {
    engine = null;
  });

  it('Family is initially empty', () => {
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    assert.isNull(nodes.head);
  });

  it('Node contains Entity properties', () => {
    const entity:Entity = new Entity();
    const point:Point = new Point();
    const matrix:Matrix = new Matrix();
    entity.add(point);
    entity.add(matrix);

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    assert.strictEqual(nodes.head.point, point);
    assert.strictEqual(nodes.head.matrix, matrix);
  });

  it('correct Entity added to Family when access Family first', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    assert.strictEqual(nodes.head.entity, entity);
  });

  it('correct Entity added to Family when access Family second', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    assert.strictEqual(nodes.head.entity, entity);
  });

  it('correct Entity added to Family when Components added', () => {
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    entity.add(new Point());
    entity.add(new Matrix());
    assert.strictEqual(nodes.head.entity, entity);
  });

  it('incorrect Entity not added to Family when access Family first', () => {
    const entity:Entity = new Entity();
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.addEntity(entity);
    assert.isNull(nodes.head);
  });

  it('incorrect Entity not added to Family when access Family second', () => {
    const entity:Entity = new Entity();
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    assert.isNull(nodes.head);
  });

  it('Entity removed from family when Component removed and Family already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    entity.remove(Point);
    assert.isNull(nodes.head);
  });

  it('Entity removed from Family when Component removed and Family not already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    engine.addEntity(entity);
    entity.remove(Point);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    assert.isNull(nodes.head);
  });

  it('Entity removed from Family when removed from Engine and Family already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    engine.addEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    engine.removeEntity(entity);
    assert.isNull(nodes.head);
  });

  it('Entity removed from Family when removed from Engine and Family not already accessed', () => {
    const entity:Entity = new Entity();
    entity.add(new Point());
    entity.add(new Matrix());
    engine.addEntity(entity);
    engine.removeEntity(entity);
    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    assert.isNull(nodes.head);
  });

  it('Family contains only matching Entities', () => {
    const entities:Entity[] = [];
    for(let i:number = 0; i < 5; ++i) {
      const entity:Entity = new Entity();
      entity.add(new Point());
      entity.add(new Matrix());
      entities.push(entity);
      engine.addEntity(entity);
    }

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    let node:MockNode2;
    for(node = nodes.head; node; node = node.next) {
      assert.include(entities, node.entity);
    }
  });

  it('Family contains all matching Entities', () => {
    const entities:Entity[] = [];
    for(let i:number = 0; i < 5; ++i) {
      const entity:Entity = new Entity();
      entity.add(new Point());
      entity.add(new Matrix());
      entities.push(entity);
      engine.addEntity(entity);
    }

    const nodes:NodeList<MockNode2> = engine.getNodeList(MockNode2);
    let node:MockNode2;
    for(node = nodes.head; node; node = node.next) {
      const index:number = entities.indexOf(node.entity);
      entities.splice(index, 1);
    }
    assert.isEmpty(entities);
  });

  //   [Test]
  //   public function releaseFamilyEmptiesNodeList() : void
  // {
  //   var entity : Entity = new Entity();
  //   entity.add( new Point() );
  //   entity.add( new Matrix() );
  //   engine.addEntity( entity );
  //   var nodes : NodeList = engine.getNodeList( MockNode );
  //   engine.releaseNodeList( MockNode );
  //   assertThat( nodes.head, nullValue() );
  // }
  //
  //   [Test]
  //   public function releaseFamilySetsNextNodeToNull() : void
  // {
  //   var entities : Array = new Array();
  //   for( var i : int = 0; i < 5; ++i )
  //   {
  //     var entity : Entity = new Entity();
  //     entity.add( new Point() );
  //     entity.add( new Matrix() );
  //     entities.push( entity );
  //     engine.addEntity( entity );
  //   }
  //
  //   var nodes : NodeList = engine.getNodeList( MockNode );
  //   var node : MockNode = nodes.head.next;
  //   engine.releaseNodeList( MockNode );
  //   assertThat( node.next, nullValue() );
  // }
  //
  //   [Test]
  //   public function removeAllEntitiesDoesWhatItSays() : void
  // {
  //   var entity : Entity = new Entity();
  //   entity.add( new Point() );
  //   entity.add( new Matrix() );
  //   engine.addEntity( entity );
  //   entity = new Entity();
  //   entity.add( new Point() );
  //   entity.add( new Matrix() );
  //   engine.addEntity( entity );
  //   var nodes : NodeList = engine.getNodeList( MockNode );
  //   engine.removeAllEntities();
  //   assertThat( nodes.head, nullValue() );
  // }
  // }
});
