// tslint:disable:no-magic-numbers
import { Signal0 } from 'ash.ts';
import { assert } from 'chai';

describe('Signals tests', () => {
  // let async:IAsync;
  let signal:Signal0;

  beforeEach(() => {
    signal = new Signal0();
  });

  afterEach(() => {
    signal = null;
  });

  // it('new signal has null head', () => {
  //   assert.isNull(signal.head);
  // });

  it('new Signal has listeners count zero', () => {
    assert.equal(signal.numListeners, 0);
  });

  // it('add listener then dispatch should call it', () => {
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   dispatchSignal();
  // });
//
  it('add listener then listeners count is one', () => {
    signal.add(newEmptyHandler());
    assert.equal(signal.numListeners, 1);
  });

  it('add listener then remove then dispatch should not call listener', () => {
    signal.add(failIfCalled);
    signal.remove(failIfCalled);
    dispatchSignal();
  });

  it('add listener then remove then listeners count is zero', () => {
    signal.add(failIfCalled);
    signal.remove(failIfCalled);
    assert.equal(signal.numListeners, 0);
  });

  it('remove function not in listeners should not throw Error', () => {
    signal.remove(newEmptyHandler());
    dispatchSignal();
  });

  // it(' addListenerThenRemoveFunctionNotInListenersShouldStillCallListener', () => {
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   signal.remove(newEmptyHandler());
  //   dispatchSignal();
  // });

  // it(' add2ListenersThenDispatchShouldCallBoth', () => {
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   dispatchSignal();
  // });

  it('add 2 listeners then listeners count is two', () => {
    signal.add(newEmptyHandler());
    signal.add(newEmptyHandler());
    const numListeners = 2;
    assert.equal(signal.numListeners, numListeners);
  });

  // it(' add2ListenersRemove1stThenDispatchShouldCall2ndNot1stListener', () => {
  //   signal.add(failIfCalled);
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   signal.remove(failIfCalled);
  //   dispatchSignal();
  // });

//    it( ' add2ListenersRemove2ndThenDispatchShouldCall1stNot2ndListener', () =>
//        {
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            signal.add( failIfCalled );
//            signal.remove( failIfCalled );
//            dispatchSignal();
//        }
//    );

  it('add 2 listeners then remove1 then listeners count is one', () => {
    signal.add(newEmptyHandler());
    signal.add(failIfCalled);
    signal.remove(failIfCalled);
    assert.equal(signal.numListeners, 1);
  });

  it('add same listener twice should only add it once', () => {
    let count:number = 0;
    const func = () => ++count;
    signal.add(func);
    signal.add(func);
    dispatchSignal();
    assert.equal(count, 1);
  });

  it('add the same listener twice should mot throw Error', () => {
    const listener = newEmptyHandler();
    signal.add(listener);
    signal.add(listener);
  });

  it('add same listener twice then listeners count is one', () => {
    signal.add(failIfCalled);
    signal.add(failIfCalled);
    assert.equal(signal.numListeners, 1);
  });

  // it(' dispatch2Listeners1stListenerRemovesItselfThen2ndListenerIsStillCalled', () => {
  //   signal.add(selfRemover);
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   dispatchSignal();
  // });

  // it(' dispatch2Listeners2ndListenerRemovesItselfThen1stListenerIsStillCalled', () => {
  //   signal.add(async.add(newEmptyHandler(), 10));
  //   signal.add(selfRemover);
  //   dispatchSignal();
  // });

  // function selfRemover():void {
  //   signal.remove(selfRemover);
  // }

  // it(' addingAListenerDuringDispatchShouldNotCallIt', () => {
  //   signal.add(async.add(addListenerDuringDispatch, 10));
  //   dispatchSignal();
  // });

  // function addListenerDuringDispatch():void {
  //   signal.add(failIfCalled);
  // }


  it('adding a listener during dispatch increments listeners count', () => {
    signal.add(addListenerDuringDispatchToTestCount);
    dispatchSignal();
    assert.equal(signal.numListeners, 2);
  });

  function addListenerDuringDispatchToTestCount():void {
    assert.equal(signal.numListeners, 1);
    signal.add(newEmptyHandler());
    assert.equal(signal.numListeners, 2);
  }


  //    it( ' dispatch2Listeners2ndListenerRemoves1stThen1stListenerIsNotCalled', () =>
//    {
//        signal.add( async.add( removeFailListener, 10 ) );
//        signal.add( failIfCalled );
//        dispatchSignal();
//    } );
//
//    function removeFailListener( ...args ):void
//    {
//        signal.remove( failIfCalled );
//    }
//
//
//    it( ' add2ListenersThenRemoveAllShouldLeaveNoListeners', () =>
//        {
//            signal.add( newEmptyHandler() );
//            signal.add( newEmptyHandler() );
//            signal.removeAll();
//            assertThat( signal.head, nullValue() );
//        }
//    );
//    it( ' addListenerThenRemoveAllThenAddAgainShouldAddListener', () =>
//        {
//            var handler:Function = newEmptyHandler();
//            signal.add( handler );
//            signal.removeAll();
//            signal.add( handler );
//            assertThat( signal.numListeners, equalTo( 1 ) );
//        }
//    );
//    it( ' add2ListenersThenRemoveAllThenListenerCountIsZero', () =>
//        {
//            signal.add( newEmptyHandler() );
//            signal.add( newEmptyHandler() );
//            signal.removeAll();
//            assertThat( signal.numListeners, equalTo( 0 ) );
//        }
//    );
//    it( ' removeAllDuringDispatchShouldStopAll', () =>
//    {
//        signal.add( removeAllListeners );
//        signal.add( failIfCalled );
//        signal.add( newEmptyHandler() );
//        dispatchSignal();
//    } );
//
//    function removeAllListeners( ...args ):void
//    {
//        signal.removeAll();
//    }
//
//    it( ' addOnceListenerThenDispatchShouldCallIt', () =>
//        {
//            signal.addOnce( async.add( newEmptyHandler(), 10 ) );
//            dispatchSignal();
//        }
//    );
//    it( ' addOnceListenerShouldBeRemovedAfterDispatch', () =>
//    {
//        signal.addOnce( newEmptyHandler() );
//        dispatchSignal();
//        assertThat( signal.head, nullValue() );
//    } );
//
//    // //// UTILITY METHODS // ////
//
  function dispatchSignal():void {
    signal.dispatch();
  }


  function newEmptyHandler():() => {} {
    return () => ({});
  }


  function failIfCalled():void {
    assert.fail('This function should not have been called.');
  }
});
