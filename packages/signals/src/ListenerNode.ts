/**
 * A node in the list of listeners in a signal.
 */
export class ListenerNode<TArgs extends any[]> {
  public previous:ListenerNode<TArgs> | null = null;

  public next:ListenerNode<TArgs> | null = null;

  public listener!:(...args:TArgs) => void;

  public once = false;
}
