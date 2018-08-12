import { ListenerNode } from './ListenerNode';
export declare class ListenerNodePool<TListener> {
    private tail;
    private cacheTail;
    get(): ListenerNode<TListener>;
    dispose(node: ListenerNode<TListener>): void;
    cache(node: ListenerNode<TListener>): void;
    releaseCache(): void;
}
