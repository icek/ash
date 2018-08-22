import { Engine } from '../core/Engine';
import { Node } from '../core/Node';
import { NodeList } from '../core/NodeList';
import { System } from '../core/System';

/**
 * A useful class for systems which simply iterate over a set of nodes, performing the same action on each node. This
 * class removes the need for a lot of boilerplate code in such systems. Extend this class and pass the node type and
 * a node update method into the constructor. The node update method will be called once per node on the update cycle
 * with the node instance and the frame time as parameters. e.g.
 *
 * <code>package
 * {
 *   public class MySystem extends ListIteratingSystem
 *   {
 *     public function MySystem()
 *     {
 *       super( MyNode, updateNode );
 *     }
 *
 *     private function updateNode( node : MyNode, time : Number ) : void
 *     {
 *       // process the node here
 *     }
 *   }
 * }</code>
 */

export abstract class ListIteratingSystem<TNode extends Node<any>> extends System
{
    protected nodeList:NodeList<TNode> | null = null;
    protected nodeClass:{ new():TNode };
    protected nodeAdded?:( node:Node<TNode> ) => void;
    protected nodeRemoved?:( node:Node<TNode> ) => void;

    constructor( nodeClass:{ new():TNode } )
    {
        super();

        this.nodeClass = nodeClass;
    }

    public addToEngine( engine:Engine ):void
    {
        this.nodeList = engine.getNodeList<TNode>( this.nodeClass );
        if( this.nodeAdded )
        {
            for( let node:Node<TNode> | null = this.nodeList.head; node; node = node.next )
            {
                this.nodeAdded( node );
            }
            this.nodeList.nodeAdded.add( this.nodeAdded );
        }
        if( this.nodeRemoved )
        {
            this.nodeList.nodeRemoved.add( this.nodeRemoved );
        }
    }

    public removeFromEngine( engine:Engine ):void
    {
        if( this.nodeAdded )
        {
            this.nodeList!.nodeAdded.remove( this.nodeAdded );
        }
        if( this.nodeRemoved )
        {
            this.nodeList!.nodeRemoved.remove( this.nodeRemoved );
        }
        this.nodeList = null;
    }

    public update( time:number ):void
    {
        for( let node:Node<TNode> | null = this.nodeList!.head; node; node = node.next )
        {
            this.updateNode( node, time );
        }
    }

    abstract updateNode( node:Node<TNode>, delta:number ):void;
}
