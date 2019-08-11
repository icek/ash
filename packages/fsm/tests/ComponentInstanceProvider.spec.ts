import { ComponentInstanceProvider } from '../src/ComponentInstanceProvider';
import { MockComponent } from './__mocks__';

describe('ComponentInstanceProvider tests', () => {
  it('provider returns the instance', () => {
    const instance = new MockComponent();
    const provider = new ComponentInstanceProvider(instance);
    expect(provider.getComponent()).toBe(instance);
  });

  it('providers with same instance have same identifier', () => {
    const instance = new MockComponent();
    const provider1 = new ComponentInstanceProvider(instance);
    const provider2 = new ComponentInstanceProvider(instance);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different instance have different identifier', () => {
    const provider1 = new ComponentInstanceProvider(new MockComponent());
    const provider2 = new ComponentInstanceProvider(new MockComponent());
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
