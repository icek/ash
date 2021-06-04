import { Node } from '../../src';
import { MockComponent } from './MockComponent';

export class MockNode extends Node {
  public component!:MockComponent;

  public static propTypes = { component: MockComponent };
}
