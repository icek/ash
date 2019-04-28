import { keep, Node } from 'ash';
import { MockComponent, MockComponent1, MockComponent2 } from './MockComponent';

export class MockNode extends Node<MockNode> {
  @keep(MockComponent)
  public component!:MockComponent;
}

export class MockNode2 extends Node<MockNode2> {
  @keep(MockComponent1)
  public component1!:MockComponent1;
  @keep(MockComponent2)
  public component2!:MockComponent2;
}
