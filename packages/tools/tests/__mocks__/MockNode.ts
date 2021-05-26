import { defineNode } from '@ash.ts/core';
import { MockComponent1 } from './MockComponent1';
import { MockComponent2 } from './MockComponent2';

export class MockNode extends defineNode({
  component1: MockComponent1,
  component2: MockComponent2,
}) {}
