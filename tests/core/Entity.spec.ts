import { Entity } from 'ash.ts';
import { assert } from 'chai';
import { MockComponent, MockComponent2, MockComponentExtended } from '../mocks';

describe('Entity tests', () => {
  let entity:Entity;

  beforeEach(() => {
    entity = new Entity();
  });

  afterEach(() => {
    entity = null;
  });

  it('add returns reference to Entity', () => {
    const component:MockComponent = new MockComponent();
    const e:Entity = entity.add(component);
    assert.equal(e, entity);
  });

  it('can store and retrieve Component', () => {
    const component:MockComponent = new MockComponent();
    entity.add(component);
    assert.equal(entity.get(MockComponent), component);
  });

  it('can store and retrieve multiple Components', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponent2 = new MockComponent2();
    entity.add(component2);
    assert.equal(entity.get(MockComponent), component1);
    assert.equal(entity.get(MockComponent2), component2);
  });


  it('can replace Component', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponent = new MockComponent();
    entity.add(component2);
    assert.equal(entity.get(MockComponent), component2);
  });

  it('can store base and extended Components', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponentExtended = new MockComponentExtended();
    entity.add(component2);
    assert.equal(entity.get(MockComponent), component1);
    assert.equal(entity.get(MockComponentExtended), component2);
  });

  it('can store extended Component as base type', () => {
    const component:MockComponentExtended = new MockComponentExtended();
    entity.add(component, MockComponent);
    assert.equal(entity.get(MockComponent), component);
  });

  it('get return null if no Component', () => {
    assert.isNull(entity.get(MockComponent));
  });

  it('will retrieve all Components', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponent2 = new MockComponent2();
    entity.add(component2);
    const all:any[] = entity.getAll();
    const allLength = 2;
    assert.equal(all.length, allLength);
    assert.includeMembers(all, [component1, component2]);
  });

  it('has Component is false if Component type not present', () => {
    entity.add(new MockComponent2());
    assert.isFalse(entity.has(MockComponent));
  });

  it('has Component is true if Component type is present', () => {
    entity.add(new MockComponent());
    assert.isTrue(entity.has(MockComponent));
  });

  it('can remove Component', () => {
    const component:MockComponent = new MockComponent();
    entity.add(component);
    entity.remove(MockComponent);
    assert.isFalse(entity.has(MockComponent));
  });


  it('storing Component triggers added Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentAdded.add((signalEntity:Entity, componentClass:{ new(..._:any[]):any }) => {
      assert.equal(signalEntity, entity);
      assert.equal(componentClass, MockComponent);
    });
    entity.add(component);
  });

  it('removing Component triggers removed Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentRemoved.add((signalEntity:Entity, componentClass:{ new(..._:any[]):any }) => {
      assert.equal(signalEntity, entity);
      assert.equal(componentClass, MockComponent);
    });
    entity.add(component);
    entity.remove(MockComponent);
  });

  it('removing Component triggers removed Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentRemoved.add((signalEntity:Entity, componentClass:{ new(..._:any[]):any }) => {
      assert.equal(signalEntity, entity);
      assert.equal(componentClass, MockComponent);
    });
    entity.add(component);
    entity.remove(MockComponent);
  });

  // it('ComponentAddedSignal contains correct parameters', () => {
  //   const component:MockComponent = new MockComponent();
  //   entity.componentAdded.add(async.add(testSignalContent, 10));
  //   entity.add(component);
  // });

  // it('componentRemovedSignalContainsCorrectParameters', () => {
  //   const component:MockComponent = new MockComponent();
  //   entity.add(component);
  //   entity.componentRemoved.add(async.add(testSignalContent, 10));
  //   entity.remove(MockComponent);
  // });

  it('test Entity has name by default', () => {
    entity = new Entity();
    assert.isAbove(entity.name.length, 0);
  });

  it('test Entity name stored and returned', () => {
    const name:string = 'anything';
    entity = new Entity(name);
    assert.equal(entity.name, name);
  });

  it('test Entity name can be changed', () => {
    entity = new Entity('anything');
    entity.name = 'otherThing';
    assert.equal(entity.name, 'otherThing');
  });

  it('test changing Entity name dispatches Signal', () => {
    entity = new Entity('anything');
    entity.nameChanged.add((signalEntity:Entity, oldName:string) => {
      assert.equal(signalEntity, entity);
      assert.equal(entity.name, 'otherThing');
      assert.equal(oldName, 'anything');
    });
    entity.name = 'otherThing';
  });

  // function testSignalContent(signalEntity:Entity, componentClass:ClassType<any>):void {
    // sameInstance
    // assert.equal(signalEntity, entity);
    // assert.equal(componentClass, MockComponent);
  // }
});
