export declare class ListenerNode<TListener> {
    previous: ListenerNode<TListener> | null;
    next: ListenerNode<TListener> | null;
    listener: TListener | null;
    once: boolean;
}
