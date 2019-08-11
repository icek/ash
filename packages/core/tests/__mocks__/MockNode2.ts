import { keep, Node } from '../../src';
import { MockComponent1 } from './MockComponent1';
import { MockComponent2 } from './MockComponent2';

export class MockNode2 extends Node {
  @keep(MockComponent1)
  public component1!:MockComponent1;

  @keep(MockComponent2)
  public component2!:MockComponent2;
}
