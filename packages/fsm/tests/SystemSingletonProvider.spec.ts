import { SystemSingletonProvider } from '../src/SystemSingletonProvider';
import { MockSystem, MockSystem2 } from './__mocks__';

describe('SystemSingletonProvider tests', () => {
  it('provider returns an instance of system', () => {
    const provider = new SystemSingletonProvider(MockSystem);
    expect(provider.getSystem()).toBeInstanceOf(MockSystem);
  });

  it('provider returns same instance each time', () => {
    const provider = new SystemSingletonProvider(MockSystem);
    expect(provider.getSystem()).toBe(provider.getSystem());
  });

  it('providers with same system have different identifier', () => {
    const provider1 = new SystemSingletonProvider(MockSystem);
    const provider2 = new SystemSingletonProvider(MockSystem);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });

  it('providers with different systems have different identifier', () => {
    const provider1 = new SystemSingletonProvider(MockSystem);
    const provider2 = new SystemSingletonProvider(MockSystem2);
    expect(provider1.identifier).not.toBe(provider2.identifier);
  });
});
