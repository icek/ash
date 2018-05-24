import { assert } from 'chai';
import { keep, ComponentMatchingFamily, Engine, Entity, Node, NodeList } from "../src/ash";


class Point {
    public x:number = 0;
    public y:number = 0;
    public getSize() {
        return this.x-this.y;
    }
}

class Matrix extends Point {
    public a:number = 1;
    public b:number = 0;
    public c:number = 0;
    public d:number = 1;
}

class MockNode extends Node<MockNode>
{
    @keep(Point)
    public point:Point = null;
}


describe( 'ComponentMatchingFamily tests', () =>
{
    let engine:Engine;
    let family:ComponentMatchingFamily<MockNode>;

    beforeEach( () =>
    {
        engine = new Engine();
        family = new ComponentMatchingFamily( MockNode, engine );
    } );

    afterEach( () =>
    {
        engine = null;
        family = null;
    } );

    it( 'NodeList is initially empty', () =>
    {
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.isNull(nodes.head);
    } );

    it( 'matching Entity is added when access NodeList test 1', () =>
    {
        let nodes:NodeList<MockNode> = family.nodeList;
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        assert.equal( nodes.head.entity, entity );
    } );

    it( 'matching Entity is added when access NodeList test 2', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.equal( nodes.head.entity, entity );
    } );


    it( 'Node contains Entity properties', () =>
    {
        let entity:Entity = new Entity();
        let point:Point = new Point();
        entity.add( point );
        family.newEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.equal( nodes.head.point, point );
    } );

    it( 'matching Entity is added when Component added', () =>
    {
        let nodes:NodeList<MockNode> = family.nodeList;
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.componentAddedToEntity( entity, Point );
        assert.equal( nodes.head.entity, entity );
    } );

    it( 'non matching Entity is not added', () =>
    {
        let entity:Entity = new Entity();
        family.newEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.isNull( nodes.head );
    } );

    it( 'non matching Entity is not added when Component added', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Matrix() );
        family.componentAddedToEntity( entity, Matrix );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.isNull( nodes.head );
    } );

    it( 'Entity is removed when access NodeList first', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        family.removeEntity( entity );
        assert.isNull( nodes.head );
    } );

    it( 'Entity is removed when access NodeList second', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        family.removeEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.isNull( nodes.head );
    } );

    it( 'Entity is removed when Component removed', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        entity.remove( Point );
        family.componentRemovedFromEntity( entity, Point );
        let nodes:NodeList<MockNode> = family.nodeList;
        assert.isNull( nodes.head );
    } );

    it( 'NodeList contains only matching Entities', () =>
    {
        let entities:Array<Entity> = [];
        for( let i = 0; i < 5; ++i )
        {
            let entity:Entity = new Entity();
            entity.add( new Point() );
            entities.push( entity );
            family.newEntity( entity );
            family.newEntity( new Entity() );
        }

        let nodes:NodeList<MockNode> = family.nodeList;
        for( let node:MockNode = nodes.head; node; node = node.next )
        {
            // assertThat( entities, hasItem( node.entity ) );
        }
    } );

    it( 'NodeList contains all matching Entities', () =>
    {
        let entities:Array<Entity> = [];
        for( let i = 0; i < 5; ++i )
        {
            let entity:Entity = new Entity();
            entity.add( new Point() );
            entities.push( entity );
            family.newEntity( entity );
            family.newEntity( new Entity() );
        }

        let nodes:NodeList<MockNode> = family.nodeList;
        let node:MockNode;
        for( node = nodes.head; node; node = node.next )
        {
            let index = entities.indexOf( node.entity );
            entities.splice( index, 1 );
        }
        assert.equal( entities.length, 0 );
    } );

    it( 'clean up empties NodeList', () =>
    {
        let entity:Entity = new Entity();
        entity.add( new Point() );
        family.newEntity( entity );
        let nodes:NodeList<MockNode> = family.nodeList;
        family.cleanUp();
        assert.isNull( nodes.head );
    } );

    it( 'clean up sets next Node to null', () =>
    {
        let entities:Array<Entity> = [];
        for( let i = 0; i < 5; ++i )
        {
            let entity:Entity = new Entity();
            entity.add( new Point() );
            entities.push( entity );
            family.newEntity( entity );
        }

        let nodes:NodeList<MockNode> = family.nodeList;
        let node:MockNode = nodes.head.next;
        family.cleanUp();
        assert.isNull( node.next );
    } );
} );
