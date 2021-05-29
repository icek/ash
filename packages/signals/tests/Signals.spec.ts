import { Signal } from '../src';

describe('Signals tests', () => {
  let signal:Signal;

  beforeEach(() => {
    signal = new Signal();
  });

  afterEach(() => {
    signal = null!;
  });

  it('new signal has null head', () => {
    expect((signal as any).head).toBeNull();
  });

  it('new Signal has listeners count zero', () => {
    expect(signal.numListeners).toBe(0);
  });

  it('add listener then dispatch should call it', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.dispatch();
    expect(callback).toBeCalled();
  });

  it('add listener then listeners count is one', () => {
    signal.add(jest.fn());
    expect(signal.numListeners).toBe(1);
  });

  it('add listener then remove then dispatch should not call listener', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.remove(callback);
    signal.dispatch();
    expect(callback).not.toBeCalled();
  });

  it('add listener then remove then listeners count is zero', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.remove(callback);
    expect(signal.numListeners).toBe(0);
  });

  it('remove function not in listeners should not throw Error', () => {
    signal.remove(jest.fn());
    signal.dispatch();
  });

  it('add listener then remove function not in listeners should still call listener', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.remove(jest.fn());
    signal.dispatch();
    expect(callback).toBeCalled();
  });

  it(' add2ListenersThenDispatchShouldCallBoth', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    signal.add(callback1);
    signal.add(callback2);
    signal.dispatch();
    expect(callback1).toBeCalled();
    expect(callback2).toBeCalled();
  });

  it('add 2 listeners then listeners count is two', () => {
    signal.add(jest.fn());
    signal.add(jest.fn());
    const numListeners = 2;
    expect(signal.numListeners).toBe(numListeners);
  });

  it('add 2 listeners remove 1st then dispatch should call 2nd not 1st listener', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    signal.add(callback1);
    signal.add(callback2);
    signal.remove(callback1);
    signal.dispatch();
    expect(callback1).not.toBeCalled();
    expect(callback2).toBeCalled();
  });
  it('add 2 listeners remove 2nd then dispatch should call 1st not 2nd listener', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    signal.add(callback1);
    signal.add(callback2);
    signal.remove(callback2);
    signal.dispatch();
    expect(callback1).toBeCalled();
    expect(callback2).not.toBeCalled();
  });

  it('add 2 listeners then remove1 then listeners count is one', () => {
    const callback = jest.fn();
    signal.add(jest.fn());
    signal.add(callback);
    signal.remove(callback);
    expect(signal.numListeners).toBe(1);
  });

  it('add same listener twice should only add it once', () => {
    let count = 0;
    const func = ():void => {
      count += 1;
    };
    signal.add(func);
    signal.add(func);
    signal.dispatch();
    expect(count).toBe(1);
  });

  it('add the same listener twice should mot throw Error', () => {
    const listener = jest.fn();
    signal.add(listener);
    signal.add(listener);
  });

  it('add same listener twice then listeners count is one', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.add(callback);
    expect(signal.numListeners).toBe(1);
  });

  it('dispatch 2 listeners 1st listener removes itself then 2nd listener is still called', () => {
    const callback1:() => void = jest.fn(() => signal.remove(callback1));
    const callback2 = jest.fn();
    signal.add(callback1);
    signal.add(callback2);
    signal.dispatch();
    expect(callback2).toBeCalled();
  });

  it('dispatch 2 Listeners 2nd listener removes itself then 1st listener is still called', () => {
    const callback1 = jest.fn();
    const callback2:() => void = jest.fn(() => signal.remove(callback1));
    signal.add(callback1);
    signal.add(callback2);
    signal.dispatch();
    expect(callback1).toBeCalled();
  });

  it('adding a listener during dispatch should not call it', () => {
    const callback = jest.fn();
    setTimeout(() => signal.add(callback), 10);
    signal.dispatch();
    expect(callback).not.toBeCalled();
  });

  it('adding a listener during dispatch increments listeners count', () => {
    const callback = ():void => {
      expect(signal.numListeners).toBe(1);
      signal.add(jest.fn());
      expect(signal.numListeners).toBe(2);
    };
    signal.add(callback);
    signal.dispatch();
    expect(signal.numListeners).toBe(2);
  });

  it('dispatch 2 listeners 2nd listener removes 1st then 1st listener is not called', () => {
    const callback1 = jest.fn();
    const callback2 = ():void => {
      signal.remove(callback1);
    };
    signal.add(callback2);
    signal.add(callback1);
    signal.dispatch();
    expect(callback1).not.toBeCalled();
  });

  it('add 2 listeners then remove all should leave no listeners', () => {
    signal.add(jest.fn());
    signal.add(jest.fn());
    signal.removeAll();
    expect((signal as any).head).toBeNull();
  });

  it('add listener then remove all then add again should add listener', () => {
    const callback = jest.fn();
    signal.add(callback);
    signal.removeAll();
    signal.add(callback);
    expect(signal.numListeners).toBe(1);
  });

  it('add 2 listeners then remove all then listener count is zero', () => {
    signal.add(jest.fn());
    signal.add(jest.fn());
    signal.removeAll();
    expect(signal.numListeners).toBe(0);
  });

  it(' removeAllDuringDispatchShouldStopAll', () => {
    const callback1 = ():void => signal.removeAll();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    signal.add(callback1);
    signal.add(callback2);
    signal.add(callback3);
    signal.dispatch();
    expect(callback2).not.toBeCalled();
    expect(callback3).not.toBeCalled();
  });

  it('addOnce listener then dispatch should call it', () => {
    const callback = jest.fn();
    signal.addOnce(callback);
    signal.dispatch();
    expect(callback).toBeCalled();
  });

  it('addOnce listener should be removed after dispatch', () => {
    signal.addOnce(jest.fn());
    signal.dispatch();
    expect((signal as any).head).toBeNull();
  });

  it('addOnce listener should be called just once', () => {
    const callback = jest.fn();
    signal.addOnce(callback);
    signal.dispatch();
    signal.dispatch();
    expect(callback).toBeCalledTimes(1);
  });

  it('Signal should dispatch 1 parameter', () => {
    const param = 'test';
    const signal1 = new Signal<[string]>();
    const callback = jest.fn();
    signal1.add(callback);
    signal1.dispatch(param);
    expect(callback).toBeCalledWith(param);
  });

  it('Signal1 addOnce should dispatch 1 parameter just once', () => {
    const param = 'test';
    const signal1 = new Signal<[string]>();
    const callback = jest.fn();
    signal1.addOnce(callback);
    signal1.dispatch(param);
    signal1.dispatch(param);
    expect(callback).toBeCalledTimes(1);
  });

  it('Signal2 should dispatch 2 parameters', () => {
    const param1 = 'test';
    const param2 = 13.75;
    const signal2 = new Signal<[string, number]>();
    const callback = jest.fn();
    signal2.add(callback);
    signal2.dispatch(param1, param2);
    expect(callback).toBeCalledWith(param1, param2);
  });

  it('Signal2 addOnce should dispatch just once', () => {
    const param1 = 'test';
    const param2 = 13.75;
    const signal2 = new Signal<[string, number]>();
    const callback = jest.fn();
    signal2.addOnce(callback);
    signal2.dispatch(param1, param2);
    signal2.dispatch(param1, param2);
    expect(callback).toBeCalledTimes(1);
  });

  it('Signal3 should dispatch 3 parameters', () => {
    const param1 = 'test';
    const param2 = 13.75;
    const param3 = { test: 123 };
    const signal3 = new Signal<[string, number, { test:number }]>();
    const callback = jest.fn();
    signal3.add(callback);
    signal3.dispatch(param1, param2, param3);
    expect(callback).toBeCalledWith(param1, param2, param3);
  });

  it('Signal3 addOnce should be called just once', () => {
    const param1 = 'test';
    const param2 = 13.75;
    const param3 = { test: 123 };
    const signal3 = new Signal<[string, number, { test:number }]>();
    const callback = jest.fn();
    signal3.addOnce(callback);
    signal3.dispatch(param1, param2, param3);
    signal3.dispatch(param1, param2, param3);
    expect(callback).toBeCalledTimes(1);
  });
});
