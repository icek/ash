import { SystemInstanceProvider } from '../src/SystemInstanceProvider';
import { MockSystem } from './__mocks__/MockSystem';

describe('SystemInstanceProvider tests', () => {
  it('provider returns the instance', () => {
    const instance = new MockSystem();
    const provider = new SystemInstanceProvider(instance);
    expect(provider.getSystem()).toBe(instance);
  });

  it('providers with same instance have same identifier', () => {
    const instance = new MockSystem();
    const provider1 = new SystemInstanceProvider(instance);
    const provider2 = new SystemInstanceProvider(instance);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different instance have different identifier', () => {
    const provider1 = new SystemInstanceProvider(new MockSystem());
    const provider2 = new SystemInstanceProvider(new MockSystem());
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
