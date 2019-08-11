import { Entity } from '@ash.ts/core';
import { EntityStateMachine } from '../src';
import { EntityState } from '../src/EntityState';
import { MockComponent, MockComponent2 } from './__mocks__';

describe('EntityStateMachine tests', () => {
  let fsm:EntityStateMachine;
  let entity:Entity;

  beforeEach(() => {
    entity = new Entity();
    fsm = new EntityStateMachine(entity);
  });

  it('enter state adds states components', () => {
    const state = new EntityState();
    const component = new MockComponent();
    state.add(MockComponent).withInstance(component);
    fsm.addState('test', state);
    fsm.changeState('test');
    expect(entity.get(MockComponent)).toBe(component);
  });

  it('enter second state adds second states components', () => {
    const state1 = new EntityState();
    const component1 = new MockComponent();
    state1.add(MockComponent).withInstance(component1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2:EntityState = new EntityState();
    const component2:MockComponent2 = new MockComponent2();
    state2.add(MockComponent2).withInstance(component2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(entity.get(MockComponent2)).toBe(component2);
  });

  it('enter second state removes first states components', () => {
    const state1 = new EntityState();
    const component1 = new MockComponent();
    state1.add(MockComponent).withInstance(component1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2 = new EntityState();
    const component2 = new MockComponent2();
    state2.add(MockComponent2).withInstance(component2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(entity.has(MockComponent)).not.toBe(true);
  });

  it('enter second state does not remove overlapping components', () => {
    const callback = jest.fn();
    entity.componentRemoved.add(callback);

    const state1 = new EntityState();
    const component1 = new MockComponent();
    state1.add(MockComponent).withInstance(component1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2 = new EntityState();
    const component2 = new MockComponent2();
    state2.add(MockComponent).withInstance(component1);
    state2.add(MockComponent2).withInstance(component2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(entity.get(MockComponent)).toBe(component1);
    expect(callback).not.toBeCalled();
  });

  it('enter second state removes different components of same type', () => {
    const state1:EntityState = new EntityState();
    const component1:MockComponent = new MockComponent();
    state1.add(MockComponent).withInstance(component1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2:EntityState = new EntityState();
    const component3:MockComponent = new MockComponent();
    const component2:MockComponent2 = new MockComponent2();
    state2.add(MockComponent).withInstance(component3);
    state2.add(MockComponent2).withInstance(component2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(entity.get(MockComponent)).toBe(component3);
  });
});
