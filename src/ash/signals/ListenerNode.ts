/**
 * A node in the list of listeners in a signal.
 */
export class ListenerNode<TListener>
{
    public previous:ListenerNode<TListener>;
    public next:ListenerNode<TListener>;
    public listener:TListener;
    public once:boolean;
}
