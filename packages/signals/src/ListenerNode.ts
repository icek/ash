/**
 * A node in the list of listeners in a signal.
 */
export class ListenerNode<TListener extends (...args:any[]) => void> {
  public previous:ListenerNode<TListener> | null = null;

  public next:ListenerNode<TListener> | null = null;

  public listener!:TListener;

  public once:boolean = false;
}
