/**
 * A node in the list of listeners in a signal.
 */
export class ListenerNode<TArgs extends any[]> {
  public previous:this | null = null;

  public next:this | null = null;

  public listener!:(...args:TArgs) => void;

  public once = false;
}
