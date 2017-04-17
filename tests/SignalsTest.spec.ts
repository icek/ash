///// <reference path="../typings/main"/>
//
//import { assert, expect, should } from 'chai';
//import { Signal0 } from "../src/ash"
//
//describe( 'Signal0', () =>
//{
//    var async:IAsync;
//    var signal:Signal0;
//
//    afterEach( () =>
//    {
//        signal = null;
//    } );
//
//
//    it( 'new signal has null head', () =>
//    {
//        assertThat( signal.head, nullValue() );
//    } );
//
//
//    it( 'newSignalHasListenersCountZero', () =>
//    {
//        assertThat( signal.numListeners, equalTo( 0 ) );
//    } );
//
//
//    it( 'add listener then dispatch should call it', () =>
//    {
//        signal.add( async.add( newEmptyHandler(), 10 ) );
//        dispatchSignal();
//    } );
//
//
//    it( ' addListenerThenListenersCountIsOne', () =>
//    {
//        signal.add( newEmptyHandler() );
//        assertThat( signal.numListeners, equalTo( 1 ) );
//    } );
//
//
//    it( ' addListenerThenRemoveThenDispatchShouldNotCallListener', () =>
//        {
//            signal.add( failIfCalled );
//            signal.remove( failIfCalled );
//            dispatchSignal();
//        }
//    );
//    it( ' addListenerThenRemoveThenListenersCountIsZero', () =>
//        {
//            signal.add( failIfCalled );
//            signal.remove( failIfCalled );
//            assertThat( signal.numListeners, equalTo( 0 ) );
//        }
//    );
//    it( ' removeFunctionNotInListenersShouldNotThrowError', () =>
//        {
//            signal.remove( newEmptyHandler() );
//            dispatchSignal();
//        }
//    );
//    it( ' addListenerThenRemoveFunctionNotInListenersShouldStillCallListener', () =>
//        {
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            signal.remove( newEmptyHandler() );
//            dispatchSignal();
//        }
//    );
//    it( ' add2ListenersThenDispatchShouldCallBoth', () =>
//        {
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            dispatchSignal();
//        }
//    );
//    it( ' add2ListenersThenListenersCountIsTwo', () =>
//        {
//            signal.add( newEmptyHandler() );
//            signal.add( newEmptyHandler() );
//            assertThat( signal.numListeners, equalTo( 2 ) );
//        }
//    );
//    it( ' add2ListenersRemove1stThenDispatchShouldCall2ndNot1stListener', () =>
//        {
//            signal.add( failIfCalled );
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            signal.remove( failIfCalled );
//            dispatchSignal();
//        }
//    );
//    it( ' add2ListenersRemove2ndThenDispatchShouldCall1stNot2ndListener', () =>
//        {
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            signal.add( failIfCalled );
//            signal.remove( failIfCalled );
//            dispatchSignal();
//        }
//    );
//    it( ' add2ListenersThenRemove1ThenListenersCountIsOne', () =>
//        {
//            signal.add( newEmptyHandler() );
//            signal.add( failIfCalled );
//            signal.remove( failIfCalled );
//            assertThat( signal.numListeners, equalTo( 1 ) );
//        }
//    );
//    it( ' addSameListenerTwiceShouldOnlyAddItOnce', () =>
//        {
//            var count:int = 0;
//            var func = function ( ...args ):void { ++count; };
//            signal.add( func );
//            signal.add( func );
//            dispatchSignal();
//            assertThat( count, equalTo( 1 ) );
//        }
//    );
//    it( ' addTheSameListenerTwiceShouldNotThrowError', () =>
//        {
//            var listener:Function = newEmptyHandler();
//            signal.add( listener );
//            signal.add( listener );
//        }
//    );
//    it( ' addSameListenerTwiceThenListenersCountIsOne', () =>
//        {
//            signal.add( failIfCalled );
//            signal.add( failIfCalled );
//            assertThat( signal.numListeners, equalTo( 1 ) );
//        }
//    );
//    it( ' dispatch2Listeners1stListenerRemovesItselfThen2ndListenerIsStillCalled', () =>
//        {
//            signal.add( selfRemover );
//            signal.add( async.add( newEmptyHandler(), 10 ) );
//            dispatchSignal();
//        }
//    );
//    it( ' dispatch2Listeners2ndListenerRemovesItselfThen1stListenerIsStillCalled', () =>
//    {
//        signal.add( async.add( newEmptyHandler(), 10 ) );
//        signal.add( selfRemover );
//        dispatchSignal();
//    } );
//
//    function selfRemover( ...args ):void
//    {
//        signal.remove( selfRemover );
//    }
//
//
//    it( ' addingAListenerDuringDispatchShouldNotCallIt', () =>
//    {
//        signal.add( async.add( addListenerDuringDispatch, 10 ) );
//        dispatchSignal();
//    } );
//
//    function addListenerDuringDispatch():void
//    {
//        signal.add( failIfCalled );
//    }
//
//
//    it( ' addingAListenerDuringDispatchIncrementsListenersCount', () =>
//    {
//        signal.add( addListenerDuringDispatchToTestCount );
//        dispatchSignal();
//        assertThat( signal.numListeners, equalTo( 2 ) );
//    } );
//
//    function addListenerDuringDispatchToTestCount():void
//    {
//        assertThat( signal.numListeners, equalTo( 1 ) );
//        signal.add( newEmptyHandler() );
//        assertThat( signal.numListeners, equalTo( 2 ) );
//    }
//
//
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
//    function dispatchSignal():void
//    {
//        signal.dispatch();
//    }
//
//    function newEmptyHandler():() => {}
//    {
//        return ( ...args ) =>
//        {
//        };
//    }
//
//    function failIfCalled( ...args ):void
//    {
//        fail( 'This function should not have been called.' );
//    }
//
//} );
