import { ComponentSingletonProvider } from '../src/ComponentSingletonProvider';
import { MockComponent, MockComponent2 } from './__mocks__/MockComponent';

describe('ComponentSingletonProvider tests', () => {
  it('provider returns an instance of type', () => {
    const provider = new ComponentSingletonProvider(MockComponent);
    expect(provider.getComponent()).toBeInstanceOf(MockComponent);
  });

  it('provider returns same instance each time', () => {
    const provider = new ComponentSingletonProvider(MockComponent);
    expect(provider.getComponent()).toBe(provider.getComponent());
  });

  it('providers with same type have different identifier', () => {
    const provider1 = new ComponentSingletonProvider(MockComponent);
    const provider2 = new ComponentSingletonProvider(MockComponent);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });

  it('providers with different type have fifferent identifier', () => {
    const provider1 = new ComponentSingletonProvider(MockComponent);
    const provider2 = new ComponentSingletonProvider(MockComponent2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
