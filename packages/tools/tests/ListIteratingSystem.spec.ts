import { Engine } from '@ash.ts/core';
import { MockSystem } from './__mocks__';

describe('ListIteratingSystemTests', () => {
  let engine:Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('systems getter returns all the Systems', () => {
    const system1 = new MockSystem();
    engine.addSystem(system1, 1);
    const system2 = new MockSystem();
    engine.addSystem(system2, 1);
    expect(engine.systems.length).toBe(2);
    expect(engine.systems).toEqual(expect.arrayContaining([system1, system2]));
  });

  it('default priority is zero', () => {
    const system = new MockSystem();
    expect(system.priority).toBe(0);
  });

  it('can set priority when adding System', () => {
    const system = new MockSystem();
    engine.addSystem(system, 10);
    expect(system.priority).toBe(10);
  });

  it('updating is false after update', () => {
    engine.update(0.1);
    expect(engine.updating).toBe(false);
  });

  it('getSystem returns the System', () => {
    const system = new MockSystem();
    engine.addSystem(system, 0);
    expect(engine.getSystem(MockSystem)).toBe(system);
  });

  // it('getSystem returns null if no such System', () => {
  //   engine.addSystem(new MockSystem(), 0);
  //   expect(engine.getSystem(MockSystem2)).toBeNull();
  // });
  //
  // it('removeAllSystems does what it says', () => {
  //   engine.addSystem(new MockSystem(), 0);
  //   engine.addSystem(new MockSystem2(mockObject), 0);
  //   engine.removeAllSystems();
  //   expect(engine.getSystem(MockSystem)).toBeNull();
  //   expect(engine.getSystem(MockSystem2)).toBeNull();
  // });

  it('removeAllSystems sets next to null', () => {
    const system1 = new MockSystem();
    engine.addSystem(system1, 1);
    const system2 = new MockSystem();
    engine.addSystem(system2, 2);
    expect(system1.next).toBe(system2);
    engine.removeAllSystems();
    expect(system1.next).toBeNull();
  });

  it('remove system and add it again dont cause invalid linked list', () => {
    const systemB = new MockSystem();
    const systemC = new MockSystem();
    engine.addSystem(systemB, 0);
    engine.addSystem(systemC, 0);
    engine.removeSystem(systemB);
    engine.addSystem(systemB, 0);
    expect(systemC.previous).toBeNull();
    expect(systemB.next).toBeNull();
  });
});
