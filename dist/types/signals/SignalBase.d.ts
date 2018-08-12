import { ListenerNode } from './ListenerNode';
export declare class SignalBase<TListener> {
    protected head: ListenerNode<TListener> | null;
    protected tail: ListenerNode<TListener> | null;
    private nodes;
    private listenerNodePool;
    private toAddHead;
    private toAddTail;
    private dispatching;
    private _numListeners;
    constructor();
    protected startDispatch(): void;
    protected endDispatch(): void;
    readonly numListeners: number;
    add(listener: TListener): void;
    addOnce(listener: TListener): void;
    protected addNode(node: ListenerNode<TListener>): void;
    remove(listener: TListener): void;
    removeAll(): void;
}
