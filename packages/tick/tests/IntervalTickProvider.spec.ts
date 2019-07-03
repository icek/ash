import { IntervalTickProvider } from '../src';

describe('IntervalTickProvider tests', () => {
  let tickProvider:IntervalTickProvider;

  beforeEach(() => {
    tickProvider = new IntervalTickProvider();
  });

  afterEach(() => {
    tickProvider.stop();
  });

  it('after creating playing should be false', () => {
    expect(tickProvider.playing).toBe(false);
  });

  it('after starting playing flag should be true', () => {
    tickProvider.start();
    expect(tickProvider.playing).toBe(true);
  });

  it('after starting and then stopping playing flag should be false', () => {
    tickProvider.start();
    tickProvider.stop();
    expect(tickProvider.playing).toBe(false);
  });

  it('should be able to add callback', () => {
    const callback = jest.fn();
    tickProvider.add(callback);
    expect(tickProvider.numListeners).toBe(1);
  });

  it('adding callback and then starting should execute callback', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toBeCalled();
      done();
    });
    tickProvider.add(callback);
    tickProvider.start();
  });

  it('callback should be execute with delta time', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toBeCalledWith(expect.any(Number));
      done();
    });
    tickProvider.add(callback);
    tickProvider.start();
  });

  it('callback should be execute with delta time', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toBeCalledWith(expect.any(Number));
      done();
    });
    tickProvider.add(callback);
    tickProvider.start();
  });

  it('should be able to set custom interval', () => {
    tickProvider.interval = 50;
    expect(tickProvider.inteval).toBe(50);
  });

  it('callback should be executed with interval time', (done) => {
    const matcher = {
      asymmetricMatch: (actual:number) => {
        expect(actual).toBeCloseTo(50 / 1000, 2);
        return true;
      },
    };
    const callback = jest.fn(() => {
      expect(callback).toBeCalledWith(matcher);
      done();
    });
    tickProvider.interval = 50;
    tickProvider.add(callback);
    tickProvider.start();
  });
});
