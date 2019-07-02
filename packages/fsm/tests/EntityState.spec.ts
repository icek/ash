import { ComponentInstanceProvider } from '../src/ComponentInstanceProvider';
import { ComponentSingletonProvider } from '../src/ComponentSingletonProvider';
import { ComponentTypeProvider } from '../src/ComponentTypeProvider';
import { DynamicComponentProvider } from '../src/DynamicComponentProvider';
import { EntityState } from '../src/EntityState';
import { MockComponent, MockComponentExtended } from './__mocks__/MockComponent';

describe('EntityState tests', () => {
  let state:EntityState;

  beforeEach(() => {
    state = new EntityState();
  });

  it('add with no qualifier creates type provider', () => {
    state.add(MockComponent);
    const provider = state.providers.get(MockComponent)!;
    expect(provider).toBeInstanceOf(ComponentTypeProvider);
    expect(provider.getComponent()).toBeInstanceOf(MockComponent);
  });

  it('add with type qualifier creates type provider', () => {
    state.add(MockComponent).withType(MockComponentExtended);
    const provider = state.providers.get(MockComponent)!;
    expect(provider).toBeInstanceOf(ComponentTypeProvider);
    expect(provider.getComponent()).toBeInstanceOf(MockComponentExtended);
  });

  it('add with instance qualifier creates instance provider', () => {
    const component = new MockComponent();
    state.add(MockComponent).withInstance(component);
    const provider = state.providers.get(MockComponent)!;
    expect(provider).toBeInstanceOf(ComponentInstanceProvider);
    expect(provider.getComponent()).toBe(component);
  });

  it('add with singleton qualifier creates singleton provider', () => {
    state.add(MockComponent).withSingleton(MockComponent);
    const provider = state.providers.get(MockComponent)!;
    expect(provider).toBeInstanceOf(ComponentSingletonProvider);
    expect(provider.getComponent()).toBeInstanceOf(MockComponent);
  });

  it('add with method qualifier creates dynamic provider', () => {
    const dynamicProvider = () => new MockComponent();
    state.add(MockComponent).withMethod(dynamicProvider);
    const provider = state.providers.get(MockComponent)!;
    expect(provider).toBeInstanceOf(DynamicComponentProvider);
    expect(provider.getComponent()).toBeInstanceOf(MockComponent);
  });
});
