import { defineNode } from '../../src';
import { MockComponent1 } from './MockComponent1';
import { MockComponent2 } from './MockComponent2';

export class MockNode2 extends defineNode({
  component1: MockComponent1,
  component2: MockComponent2,
}) {}
