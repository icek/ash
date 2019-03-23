import { RAFTickProvider } from 'ash.ts';

describe('RAFTickProvider tests', () => {
  let tickProvider:RAFTickProvider;

  beforeEach(() => {
    tickProvider = new RAFTickProvider();
  });

  afterEach(() => {
    tickProvider = null;
  });

  it('after creating playing should be false', () => {
    expect(tickProvider.playing).toBe(false);
  });
});
