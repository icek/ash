/**
 * A node in the list of listeners in a signal.
 */
export class ListenerNode<TListener> {
  public previous:ListenerNode<TListener> | null = null;
  public next:ListenerNode<TListener> | null = null;
  public listener:TListener | null = null;
  public once:boolean = false;
}
