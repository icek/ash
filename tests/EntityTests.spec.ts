import { assert } from 'chai';
import { ComponentMatchingFamily, Engine, Entity, Node, NodeList } from "../src/ash";

describe( 'Entity tests', () =>
{
    let entity:Entity;


    beforeEach( () =>
    {
        entity = new Entity();
    } );

    afterEach( () =>
    {
        entity = null;
    } );

    it( 'add returns reference to Entity', () =>
    {
        let component:MockComponent = new MockComponent();
        let e:Entity = entity.add( component );
        assert.equal( e, entity );
    } );

    it( 'can store and retrieve Component', () =>
    {
        let component:MockComponent = new MockComponent();
        entity.add( component );
        assert.equal( entity.get( MockComponent ), component );
    } );

    it( 'can store and retrieve multiple Components', () =>
    {
        let component1:MockComponent = new MockComponent();
        entity.add( component1 );
        let component2:MockComponent2 = new MockComponent2();
        entity.add( component2 );
        assert.equal( entity.get( MockComponent ), component1 );
        assert.equal( entity.get( MockComponent2 ), component2 );
    } );


    it( 'can replace Component', () =>
    {
        let component1:MockComponent = new MockComponent();
        entity.add( component1 );
        let component2:MockComponent = new MockComponent();
        entity.add( component2 );
        assert.equal( entity.get( MockComponent ), component2 );
    } );

    it( 'can store base and extended Components', () =>
    {
        let component1:MockComponent = new MockComponent();
        entity.add( component1 );
        let component2:MockComponentExtended = new MockComponentExtended();
        entity.add( component2 );
        assert.equal( entity.get( MockComponent ), component1 );
        assert.equal( entity.get( MockComponentExtended ), component2 );
    } );

    it( 'can store extended Component as base type', () =>
    {
        let component:MockComponentExtended = new MockComponentExtended();
        entity.add( component, MockComponent );
        assert.equal( entity.get( MockComponent ), component );
    } );

    it( 'get return null if no Component', () =>
    {
        assert.isNull( entity.get( MockComponent ) );
    } );

    it( 'will retrieve all Components', () =>
    {
        let component1:MockComponent = new MockComponent();
        entity.add( component1 );
        let component2:MockComponent2 = new MockComponent2();
        entity.add( component2 );
        let all = entity.getAll();
        assert.equal( all.length, 2 );
        assert.includeMembers( all, [ component1, component2 ] );
    } );

    it( 'has Component is false if Component type not present', () =>
    {
        entity.add( new MockComponent2() );
        assert.isFalse( entity.has( MockComponent ) );
    } );

    it( 'has Component is true if Component type is present', () =>
    {
        entity.add( new MockComponent() );
        assert.isTrue( entity.has( MockComponent ) );
    } );

    it( 'can remove Component', () =>
    {
        let component:MockComponent = new MockComponent();
        entity.add( component );
        entity.remove( MockComponent );
        assert.isFalse( entity.has( MockComponent ) );
    } );


    it( 'storing Component triggers added Signal', () =>
    {
        let component:MockComponent = new MockComponent();
        entity.componentAdded.add( ( signalEntity:Entity, componentClass:{ new( ..._:any[] ):any } ) =>
        {
            assert.equal( signalEntity, entity );
            assert.equal( componentClass, MockComponent );
        } );
        entity.add( component );
    } );

    it( 'removing Component triggers removed Signal', () =>
    {
        let component:MockComponent = new MockComponent();
        entity.componentRemoved.add( ( signalEntity:Entity, componentClass:{ new( ..._:any[] ):any } ) =>
        {
            assert.equal( signalEntity, entity );
            assert.equal( componentClass, MockComponent );
        } );
        entity.add( component );
        entity.remove( MockComponent );
    } );

    it( 'removing Component triggers removed Signal', () =>
    {
        let component:MockComponent = new MockComponent();
        entity.componentRemoved.add( ( signalEntity:Entity, componentClass:{ new( ..._:any[] ):any } ) =>
        {
            assert.equal( signalEntity, entity );
            assert.equal( componentClass, MockComponent );
        } );
        entity.add( component );
        entity.remove( MockComponent );
    } );

//
//        [Test]
//        public function componentAddedSignalContainsCorrectParameters() : void
//    {
//        var component : MockComponent = new MockComponent();
//        entity.componentAdded.add( async.add( testSignalContent, 10 ) );
//        entity.add( component );
//    }
//
//        [Test]
//        public function componentRemovedSignalContainsCorrectParameters() : void
//    {
//        var component : MockComponent = new MockComponent();
//        entity.add( component );
//        entity.componentRemoved.add( async.add( testSignalContent, 10 ) );
//        entity.remove( MockComponent );
//    }
//
//        private function testSignalContent( signalEntity : Entity, componentClass : Class ) : void
//    {
//        assertThat( signalEntity, sameInstance( entity ) );
//        assertThat( componentClass, sameInstance( MockComponent ) );
//    }
//
    it( 'test Entity has name by default', () =>
    {
        entity = new Entity();
        assert.isAbove( entity.name.length, 0 );
    } );

    it( 'test Entity name stored and returned', () =>
    {
        let name:string = "anything";
        entity = new Entity( name );
        assert.equal( entity.name, name );
    } );

    it( 'test Entity name can be changed', () =>
    {
        entity = new Entity( "anything" );
        entity.name = "otherThing";
        assert.equal( entity.name, "otherThing" );
    } );

    it( 'test changing Entity name dispatches Signal', () =>
    {
        entity = new Entity( "anything" );
        entity.nameChanged.add( ( signalEntity:Entity, oldName:string ) =>
        {
            assert.equal( signalEntity, entity );
            assert.equal( entity.name, "otherThing" );
            assert.equal( oldName, "anything" );
        } );
        entity.name = "otherThing";
    } );


} );


class MockComponent
{
    public value:number;
}

class MockComponent2
{
    public value:string;
}

class MockComponentExtended extends MockComponent
{
    public other:number;
}