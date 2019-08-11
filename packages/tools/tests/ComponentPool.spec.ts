import { ComponentPool } from '../src';
import { MockComponent1 } from './__mocks__';

describe('ComponentPool tests', () => {
  afterEach(() => {
    ComponentPool.empty();
  });

  it('get retrieves object of appropriate class', () => {
    expect(ComponentPool.get(MockComponent1)).toBeInstanceOf(MockComponent1);
  });

  it('disposed components are retrieved by get', () => {
    const mockComponent = new MockComponent1();
    ComponentPool.dispose(mockComponent);
    const retrievedComponent = ComponentPool.get(MockComponent1);
    expect(retrievedComponent).toBe(mockComponent);
  });

  it('empty prevents retrieval of previously disposed components', () => {
    const mockComponent = new MockComponent1();
    ComponentPool.dispose(mockComponent);
    ComponentPool.empty();
    const retrievedComponent = ComponentPool.get(MockComponent1);
    expect(retrievedComponent).not.toBe(mockComponent);
  });
});
