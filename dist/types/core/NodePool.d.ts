import { Dictionary } from '../Dictionary';
import { Node } from './Node';
import { ClassType } from '../Types';
export declare class NodePool<TNode extends Node<any>> {
    private tail;
    private nodeClass;
    private cacheTail;
    private components;
    constructor(nodeClass: {
        new (): TNode;
    }, components: Dictionary<ClassType<any>, string>);
    get(): TNode;
    dispose(node: TNode): void;
    cache(node: TNode): void;
    releaseCache(): void;
}
