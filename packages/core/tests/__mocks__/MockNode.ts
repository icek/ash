import { keep, Node } from '../../src';
import { MockComponent } from './MockComponent';

export class MockNode extends Node {
  @keep(MockComponent)
  public component!:MockComponent;
}
