import { FrameTickProvider } from '../src';

describe('FrameTickProvider tests', () => {
  let tickProvider:FrameTickProvider;

  beforeEach(() => {
    tickProvider = new FrameTickProvider();
  });

  afterEach(() => {
    tickProvider.stop();
  });

  it('after creating playing should be false', () => {
    expect(tickProvider.isPlaying).toBe(false);
  });

  it('after starting playing flag should be true', () => {
    tickProvider.start();
    expect(tickProvider.isPlaying).toBe(true);
  });

  it('after starting and then stopping playing flag should be false', () => {
    tickProvider.start();
    tickProvider.stop();
    expect(tickProvider.isPlaying).toBe(false);
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

  it('should limit frame time', (done) => {
    tickProvider = new FrameTickProvider(0.0001);
    const callback = jest.fn(() => {
      expect(callback).toBeCalledWith(0.0001);
      done();
    });
    tickProvider.add(callback);
    tickProvider.start();
  });
});
