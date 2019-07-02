import { DynamicSystemProvider } from '../src/DynamicSystemProvider';
import { EngineState } from '../src/EngineState';
import { SystemInstanceProvider } from '../src/SystemInstanceProvider';
import { SystemSingletonProvider } from '../src/SystemSingletonProvider';
import { MockSystem } from './__mocks__/MockSystem';

describe('SystemState tests', () => {
  let state:EngineState;

  beforeEach(() => {
    state = new EngineState();
  });

  it('add instance creates instance provider', () => {
    const system = new MockSystem();
    state.addInstance(system);
    const provider = state.providers[0];
    expect(provider).toBeInstanceOf(SystemInstanceProvider);
    expect(provider.getSystem()).toBe(system);
  });

  it('add singleton creates singleton provider', () => {
    state.addSingleton(MockSystem);
    const provider = state.providers[0];
    expect(provider).toBeInstanceOf(SystemSingletonProvider);
    expect(provider.getSystem()).toBeInstanceOf(MockSystem);
  });

  it('add method creates method provider', () => {
    const instance = new MockSystem();
    const methodProvider = ():MockSystem => instance;
    state.addMethod(methodProvider);
    const provider = state.providers[0];
    expect(provider).toBeInstanceOf(DynamicSystemProvider);
    expect(provider.getSystem()).toBeInstanceOf(MockSystem);
  });

  it('with priority sets priority on provider', () => {
    const priority = 10;
    state.addSingleton(MockSystem).withPriority(priority);
    const provider = state.providers[0];
    expect(provider.priority).toBe(priority);
  });
});
