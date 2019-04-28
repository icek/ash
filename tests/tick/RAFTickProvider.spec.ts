import { RAFTickProvider } from 'ash';

describe('RAFTickProvider tests', () => {
  let tickProvider:RAFTickProvider;

  beforeEach(() => {
    tickProvider = new RAFTickProvider();
  });

  afterEach(() => {
    (tickProvider as RAFTickProvider | null) = null;
  });

  it('after creating playing should be false', () => {
    expect(tickProvider.playing).toBe(false);
  });
});
