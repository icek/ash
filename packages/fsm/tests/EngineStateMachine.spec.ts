import { Engine } from '@ash.ts/core';
import { EngineStateMachine } from '../src';
import { EngineState } from '../src/EngineState';
import { MockSystem, MockSystem2 } from './__mocks__';

describe('EngineStateMachine tests', () => {
  let fsm:EngineStateMachine;
  let engine:Engine;

  beforeEach(() => {
    engine = new Engine();
    fsm = new EngineStateMachine(engine);
  });

  it('enter state adds states systems', () => {
    const state = new EngineState();
    const system = new MockSystem();
    state.addInstance(system);
    fsm.addState('test', state);
    fsm.changeState('test');
    expect(engine.getSystem(MockSystem)).toBe(system);
  });

  it('enter second state adds second states systems', () => {
    const state1 = new EngineState();
    const system1 = new MockSystem();
    state1.addInstance(system1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2 = new EngineState();
    const system2 = new MockSystem2();
    state2.addInstance(system2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(engine.getSystem(MockSystem2)).toBe(system2);
  });

  it('enter second state removes first states systems', () => {
    const state1 = new EngineState();
    const system1 = new MockSystem();
    state1.addInstance(system1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2:EngineState = new EngineState();
    const system2:MockSystem2 = new MockSystem2();
    state2.addInstance(system2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(engine.getSystem(MockSystem)).toBeNull();
  });

  it('enter second state does not remove overlapping systems', () => {
    const state1 = new EngineState();
    const system1 = new MockSystem();
    system1.removeFromEngine = jest.fn();
    state1.addInstance(system1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2 = new EngineState();
    const system2 = new MockSystem2();
    state2.addInstance(system1);
    state2.addInstance(system2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(system1.removeFromEngine).not.toBeCalled();
    expect(engine.getSystem(MockSystem)).toBe(system1);
  });

  it('enter second state removes different systems of same type', () => {
    const state1 = new EngineState();
    const system1 = new MockSystem();
    state1.addInstance(system1);
    fsm.addState('test1', state1);
    fsm.changeState('test1');

    const state2 = new EngineState();
    const system3 = new MockSystem();
    const system2 = new MockSystem2();
    state2.addInstance(system3);
    state2.addInstance(system2);
    fsm.addState('test2', state2);
    fsm.changeState('test2');

    expect(engine.getSystem(MockSystem)).toBe(system3);
  });
});
