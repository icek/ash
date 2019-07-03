import { ComponentTypeProvider } from '../src/ComponentTypeProvider';
import { MockComponent, MockComponent2 } from './__mocks__/MockComponent';

describe('ComponentTypeProvider tests', () => {
  it('provider returns an instance of type', () => {
    const provider = new ComponentTypeProvider(MockComponent);
    expect(provider.getComponent()).toBeInstanceOf(MockComponent);
  });

  it('provider returns new instance each time', () => {
    const provider = new ComponentTypeProvider(MockComponent);
    expect(provider.getComponent()).not.toBe(provider.getComponent());
  });

  it('providers with same type have same identifier', () => {
    const provider1 = new ComponentTypeProvider(MockComponent);
    const provider2 = new ComponentTypeProvider(MockComponent);
    expect(provider1.identifier).toBe(provider2.identifier);
  });

  it('providers with different type have different identifier', () => {
    const provider1 = new ComponentTypeProvider(MockComponent);
    const provider2 = new ComponentTypeProvider(MockComponent2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
