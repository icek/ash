import { defineNode } from '../src';

describe('defineNode tests', () => {
  it('should create class', () => {
    const NodeClass = defineNode({});
    const node = new NodeClass();
    expect(node).toBeInstanceOf(NodeClass);
  });
});
