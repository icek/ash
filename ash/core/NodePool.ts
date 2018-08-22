import { Dictionary } from '../Dictionary';
import { Node } from './Node';
import { ClassType } from '../Types';

/**
 * This internal class maintains a pool of deleted nodes for reuse by the framework. This reduces the overhead
 * from object creation and garbage collection.
 *
 * Because nodes may be deleted from a NodeList while in use, by deleting Nodes from a NodeList
 * while iterating through the NodeList, the pool also maintains a cache of nodes that are added to the pool
 * but should not be reused yet. They are then released into the pool by calling the releaseCache method.
 */
export class NodePool<TNode extends Node<any>>
{
    private tail:TNode | null = null;
    private nodeClass:{ new():TNode };
    private cacheTail:TNode | null = null;
    private components:Dictionary<ClassType<any>, string>;

    /**
     * Creates a pool for the given node class.
     */
    constructor( nodeClass:{ new():TNode }, components:Dictionary<ClassType<any>, string> )
    {
        this.nodeClass = nodeClass;
        this.components = components;
    }

    /**
     * Fetches a node from the pool.
     */
    public get():TNode
    {
        if( this.tail )
        {
            let node:TNode = this.tail;
            this.tail = this.tail.previous;
            node.previous = null;
            return node;
        }
        else
        {
            return new this.nodeClass();
        }
    }

    /**
     * Adds a node to the pool.
     */
    public dispose( node:TNode ):void
    {
        for( let val of this.components.values() )
        {
            (<any>node)[ val ] = null;
        }
        (<any>node.entity) = null;

        node.next = null;
        node.previous = this.tail;
        this.tail = node;
    }

    /**
     * Adds a node to the cache
     */
    public cache( node:TNode ):void
    {
        node.previous = this.cacheTail;
        this.cacheTail = node;
    }

    /**
     * Releases all nodes from the cache into the pool
     */
    public releaseCache():void
    {
        while( this.cacheTail )
        {
            let node:TNode = this.cacheTail;
            this.cacheTail = node.previous;
            this.dispose( node );
        }
    }
}
