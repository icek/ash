import { keep, Node } from '../../src';
import { MockComponent, MockComponent1, MockComponent2 } from './MockComponent';

export class MockNode extends Node {
  @keep(MockComponent)
  public component!:MockComponent;
}

export class MockNode2 extends Node {
  @keep(MockComponent1)
  public component1!:MockComponent1;

  @keep(MockComponent2)
  public component2!:MockComponent2;
}
