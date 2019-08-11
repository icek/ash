import { DynamicComponentProvider } from '../src/DynamicComponentProvider';
import { MockComponent } from './__mocks__';

describe('DynamicComponentProvider tests', () => {
  it('provider returns the instance', () => {
    const instance:MockComponent = new MockComponent();
    const providerMethod = ():MockComponent => instance;
    const provider = new DynamicComponentProvider(providerMethod);
    expect(provider.getComponent()).toBe(instance);
  });

  it('providers with same method have same identifier', () => {
    const instance:MockComponent = new MockComponent();
    const providerMethod = ():MockComponent => instance;
    const provider1 = new DynamicComponentProvider(providerMethod);
    const provider2 = new DynamicComponentProvider(providerMethod);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different methods have different identifier', () => {
    const instance:MockComponent = new MockComponent();
    const providerMethod1 = ():MockComponent => instance;
    const providerMethod2 = ():MockComponent => instance;
    const provider1 = new DynamicComponentProvider(providerMethod1);
    const provider2 = new DynamicComponentProvider(providerMethod2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
