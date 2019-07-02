import { DynamicSystemProvider } from '../src/DynamicSystemProvider';
import { MockSystem } from './__mocks__/MockSystem';

describe('SystemMethodProvider tests', () => {
  it('provider returns the instance', () => {
    const instance = new MockSystem();
    const providerMethod = () => instance;
    const provider = new DynamicSystemProvider(providerMethod);
    expect(provider.getSystem()).toBe(instance);
  });

  it('providers with same method have same identifier', () => {
    var instance = new MockSystem();
    var providerMethod = () => instance;
    var provider1 = new DynamicSystemProvider(providerMethod);
    var provider2 = new DynamicSystemProvider(providerMethod);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different method have different identifier', () => {
    const instance = new MockSystem();
    const providerMethod1 = () => instance;
    const providerMethod2 = () => instance;
    const provider1 = new DynamicSystemProvider(providerMethod1);
    const provider2 = new DynamicSystemProvider(providerMethod2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
