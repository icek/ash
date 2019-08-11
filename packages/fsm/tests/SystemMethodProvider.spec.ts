import { DynamicSystemProvider } from '../src/DynamicSystemProvider';
import { MockSystem } from './__mocks__';

describe('SystemMethodProvider tests', () => {
  it('provider returns the instance', () => {
    const instance = new MockSystem();
    const providerMethod = ():MockSystem => instance;
    const provider = new DynamicSystemProvider(providerMethod);
    expect(provider.getSystem()).toBe(instance);
  });

  it('providers with same method have same identifier', () => {
    const instance = new MockSystem();
    const providerMethod = ():MockSystem => instance;
    const provider1 = new DynamicSystemProvider(providerMethod);
    const provider2 = new DynamicSystemProvider(providerMethod);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different method have different identifier', () => {
    const instance = new MockSystem();
    const providerMethod1 = ():MockSystem => instance;
    const providerMethod2 = ():MockSystem => instance;
    const provider1 = new DynamicSystemProvider(providerMethod1);
    const provider2 = new DynamicSystemProvider(providerMethod2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
