import { defineNode } from '../../src';
import { MockComponent } from './MockComponent';

export class MockNode extends defineNode({
  component: MockComponent,
}) {}
