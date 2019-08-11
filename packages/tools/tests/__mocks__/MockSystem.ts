import { ListIteratingSystem } from '../../src';
import { MockNode } from './MockNode';

export class MockSystem extends ListIteratingSystem<MockNode> {
  public constructor() {
    super(MockNode);
  }

  public updateNode(node:MockNode):void {
  }
}
