// tslint:disable:no-magic-numbers

import { ClassType, Entity } from 'ash.ts';
import { MockComponent, MockComponent1, MockComponent2, MockComponentExtended } from '../__mocks__';

describe('Entity tests', () => {
  let entity:Entity;

  beforeEach(() => {
    entity = new Entity();
  });

  afterEach(() => {
    (entity as Entity | null) = null;
  });

  it('add returns reference to Entity', () => {
    const component:MockComponent = new MockComponent();
    const e:Entity = entity.add(component);
    expect(e).toEqual(entity);
  });

  it('can store and retrieve Component', () => {
    const component:MockComponent = new MockComponent();
    entity.add(component);
    expect(entity.get(MockComponent)).toEqual(component);
  });

  it('can store and retrieve multiple Components', () => {
    const component1:MockComponent1 = new MockComponent1();
    entity.add(component1);
    const component2:MockComponent2 = new MockComponent2();
    entity.add(component2);
    expect(entity.get(MockComponent1)).toEqual(component1);
    expect(entity.get(MockComponent2)).toEqual(component2);
  });


  it('can replace Component', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponent = new MockComponent();
    entity.add(component2);
    expect(entity.get(MockComponent)).toEqual(component2);
  });

  it('can store base and extended Components', () => {
    const component1:MockComponent = new MockComponent();
    entity.add(component1);
    const component2:MockComponentExtended = new MockComponentExtended();
    entity.add(component2);
    expect(entity.get(MockComponent)).toEqual(component1);
    expect(entity.get(MockComponentExtended)).toEqual(component2);
  });

  it('can store extended Component as base type', () => {
    const component:MockComponentExtended = new MockComponentExtended();
    entity.add(component, MockComponent);
    expect(entity.get(MockComponent)).toEqual(component);
  });

  it('get return null if no Component', () => {
    expect(entity.get(MockComponent)).toBeNull();
  });

  it('will retrieve all Components', () => {
    const component1:MockComponent1 = new MockComponent1();
    entity.add(component1);
    const component2:MockComponent2 = new MockComponent2();
    entity.add(component2);
    const all:any[] = entity.getAll();
    const allLength = 2;
    expect(all.length).toEqual(allLength);
    expect(all).toEqual(expect.arrayContaining([component1, component2]));
  });

  it('has Component is false if Component type not present', () => {
    entity.add(new MockComponent2());
    expect(entity.has(MockComponent1)).toBe(false);
  });

  it('has Component is true if Component type is present', () => {
    entity.add(new MockComponent());
    expect(entity.has(MockComponent)).toBe(true);
  });

  it('can remove Component', () => {
    const component:MockComponent = new MockComponent();
    entity.add(component);
    entity.remove(MockComponent);
    expect(entity.has(MockComponent)).toBe(false);
  });


  it('storing Component triggers added Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentAdded.add((signalEntity:Entity, componentClass:ClassType<any>) => {
      expect(signalEntity).toEqual(entity);
      expect(componentClass).toEqual(MockComponent);
    });
    entity.add(component);
  });

  it('removing Component triggers removed Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentRemoved.add((signalEntity:Entity, componentClass:ClassType<any>) => {
      expect(signalEntity).toEqual(entity);
      expect(componentClass).toEqual(MockComponent);
    });
    entity.add(component);
    entity.remove(MockComponent);
  });

  it('removing Component triggers removed Signal', () => {
    const component:MockComponent = new MockComponent();
    entity.componentRemoved.add((signalEntity:Entity, componentClass:ClassType<any>) => {
      expect(signalEntity).toEqual(entity);
      expect(componentClass).toEqual(MockComponent);
    });
    entity.add(component);
    entity.remove(MockComponent);
  });

  it('ComponentAddedSignal contains correct parameters', (done) => {
    const component:MockComponent = new MockComponent();
    entity.componentAdded.add((signalEntity:Entity, componentClass:ClassType<any>) => {
      // sameInstance
      setTimeout(() => {
        expect(signalEntity).toEqual(entity);
        expect(componentClass).toEqual(MockComponent);
        done();
      }, 10);
    });
    entity.add(component);
  });

  it('componentRemovedSignalContainsCorrectParameters', (done) => {
    const component:MockComponent = new MockComponent();
    entity.add(component);
    entity.componentRemoved.add((signalEntity:Entity, componentClass:ClassType<any>) => {
      // sameInstance
      setTimeout(() => {
        expect(signalEntity).toEqual(entity);
        expect(componentClass).toEqual(MockComponent);
        done();
      }, 10);
    });
    entity.remove(MockComponent);
  });

  it('test Entity has name by default', () => {
    entity = new Entity();
    expect(entity.name.length).toBeGreaterThan(0);
  });

  it('test Entity name stored and returned', () => {
    const name:string = 'anything';
    entity = new Entity(name);
    expect(entity.name).toEqual(name);
  });

  it('test Entity name can be changed', () => {
    entity = new Entity('anything');
    entity.name = 'otherThing';
    expect(entity.name).toEqual('otherThing');
  });

  it('test changing Entity name dispatches Signal', () => {
    entity = new Entity('anything');
    entity.nameChanged.add((signalEntity:Entity, oldName:string) => {
      expect(signalEntity).toEqual(entity);
      expect(entity.name).toEqual('otherThing');
      expect(oldName).toEqual('anything');
    });
    entity.name = 'otherThing';
  });
});
