// tslint:disable:no-magic-numbers

import { Engine, System } from 'ash.ts';
import { assert } from 'chai';
import { MockSystem, MockSystem2 } from '../_mocks/MockSystem';

describe('System tests', () => {
  let engine:Engine;
  const mockObject = {
    asyncCallback: null,
  };

  beforeEach(() => {
    engine = new Engine();
  });

  afterEach(() => {
    engine = null;
    mockObject.asyncCallback = null;
  });

  it('systems getter returns all the Systems', () => {
    const system1:System = new MockSystem();
    engine.addSystem(system1, 1);
    const system2:System = new MockSystem();
    engine.addSystem(system2, 1);
    assert.strictEqual(engine.systems.length, 2);
    assert.includeMembers(engine.systems, [system1, system2]);
  });

  // it('add System calls addToEngine', () => {
  //   const system:System = new MockSystem(asyncCallback);
  //   asyncCallback = async.add(addedCallbackMethod, 10);
  //   engine.addSystem(system, 0);
  // });

//     [Test]
//     public function removeSystemCallsRemovedFromEngine() : void
//   {
//     var system : System = new MockSystem( this );
//     engine.addSystem( system, 0 );
//     asyncCallback = async.add( removedCallbackMethod, 10 );
//     engine.removeSystem( system );
//   }
//
//     [Test]
//     public function engineCallsUpdateOnSystems() : void
//   {
//     var system : System = new MockSystem( this );
//     engine.addSystem( system, 0 );
//     asyncCallback = async.add( updateCallbackMethod, 10 );
//     engine.update( 0.1 );
//   }

  it('default priority is zero', () => {
    const system:System = new MockSystem();
    assert.strictEqual(system.priority, 0);
  });

  it('can set priority when adding System', () => {
    const system:System = new MockSystem();
    engine.addSystem(system, 10);
    assert.strictEqual(system.priority, 10);
  });

//     [Test]
//     public function systemsUpdatedInPriorityOrderIfSameAsAddOrder() : void
//   {
//     system1 = new MockSystem( this );
//     engine.addSystem( system1, 10 );
//     system2 = new MockSystem( this );
//     engine.addSystem( system2, 20 );
//     asyncCallback = async.add( updateCallbackMethod1, 10 );
//     engine.update( 0.1 );
//   }
//
//     [Test]
//     public function systemsUpdatedInPriorityOrderIfReverseOfAddOrder() : void
//   {
//     system2 = new MockSystem( this );
//     engine.addSystem( system2, 20 );
//     system1 = new MockSystem( this );
//     engine.addSystem( system1, 10 );
//     asyncCallback = async.add( updateCallbackMethod1, 10 );
//     engine.update( 0.1 );
//   }
//
//     [Test]
//     public function systemsUpdatedInPriorityOrderIfPrioritiesAreNegative() : void
//   {
//     system2 = new MockSystem( this );
//     engine.addSystem( system2, 10 );
//     system1 = new MockSystem( this );
//     engine.addSystem( system1, -20 );
//     asyncCallback = async.add( updateCallbackMethod1, 10 );
//     engine.update( 0.1 );
//   }
//

  it('updating is true during update', () => {
    const system:System = new MockSystem2(mockObject);
    engine.addSystem(system, 0);
    mockObject.asyncCallback = assertsUpdatingIsTrue;
    engine.update(0.1);
  });

  it('updating is false after update', () => {
    engine.update(0.1);
    assert.isFalse(engine.updating);
  });

  // it('completeSignal is dispatched after update', () => {
  //   const system:System = new MockSystem2(mockObject);
  //   engine.addSystem(system, 0);
  //   mockObject.asyncCallback = listensForUpdateComplete;
  //   engine.update(0.1);
  // });
//
  it('getSystem returns the System', () => {
    const system1:System = new MockSystem();
    engine.addSystem(system1, 0);
    engine.addSystem(new MockSystem2(mockObject), 0);
    assert.strictEqual(engine.getSystem(MockSystem), system1);
  });

  it('getSystem returns null if no such System', () => {
    engine.addSystem(new MockSystem(), 0);
    assert.isNull(engine.getSystem(MockSystem2));
  });

  it('removeAllSystems does what it says', () => {
    engine.addSystem(new MockSystem(), 0);
    engine.addSystem(new MockSystem2(mockObject), 0);
    engine.removeAllSystems();
    assert.isNull(engine.getSystem(MockSystem));
    assert.isNull(engine.getSystem(MockSystem2));
  });

  it('removeAllSystemsSetsNextToNull', () => {
    const system1:System = new MockSystem();
    engine.addSystem(system1, 1);
    const system2:System = new MockSystem();
    engine.addSystem(system2, 2);
    assert.strictEqual(system1.next, system2);
    engine.removeAllSystems();
    assert.isNull(system1.next);
  });

  it('removeSystemAndAddItAgainDontCauseInvalidLinkedList', () => {
    const systemB:System = new MockSystem();
    const systemC:System = new MockSystem();
    engine.addSystem(systemB, 0);
    engine.addSystem(systemC, 0);
    engine.removeSystem(systemB);
    engine.addSystem(systemB, 0);
    assert.isNull(systemC.previous);
    assert.isNull(systemB.next);
  });

  // function addedCallbackMethod(system:System, action:String, systemEngine:Engine):void {
  //   assert.strictEqual(action, 'added');
  //   assert.strictEqual(systemEngine, engine);
  // }

  // function removedCallbackMethod(system:System, action:String, systemEngine:Engine):void {
  //   assert.strictEqual(action, 'removed');
  //   assert.strictEqual(systemEngine, engine);
  // }

  // function updateCallbackMethod(system:System, action:string, time:number):void {
  //   assert.strictEqual(action, 'update');
  //   assert.strictEqual(time, 0.1);
  // }

  // function updateCallbackMethod1(system:System, action:String, time:Number):void {
  // assert.strictEqual(system, system1);
  // asyncCallback = async.add(updateCallbackMethod2, 10);
  // }

  // function updateCallbackMethod2(system:System, action:string, payload:any):void {
  //   assert.strictEqual(system, system2);
  // }

  // function updatingIsFalseBeforeUpdate():void {
  //   assert.isFalse(engine.updating);
  // }

  function assertsUpdatingIsTrue(system:System, action:string, payload:any):void {
    assert.isTrue(engine.updating);
  }

  // function listensForUpdateComplete(system:System, action:string, payload:any):void {
  //   engine.updateComplete.add(async.add());
  // }
});
