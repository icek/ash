import { assert } from 'chai';
import { RAFTickProvider } from 'ash.ts';

describe('Dictionary tests', () => {
  let tickProvider:RAFTickProvider;

  beforeEach(() => {
    tickProvider = new RAFTickProvider();
  });

  afterEach(() => {
    tickProvider = null;
  });

  it('after creating playing should be false', () => {
    assert.isFalse(tickProvider.playing);
  });
});
