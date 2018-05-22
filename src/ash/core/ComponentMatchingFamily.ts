import { Dictionary } from '../Dictionary';
import { Engine } from './Engine';
import { Entity } from './Entity';
import { IFamily } from './IFamily';
import { Node } from './Node';
import { NodeList } from './NodeList';
import { NodePool } from './NodePool';
import { ClassType } from '../Types';

/**
 * The default class for managing a NodeList. This class creates the NodeList and adds and removes
 * nodes to/from the list as the entities and the components in the engine change.
 *
 * It uses the basic entity matching pattern of an entity system - entities are added to the list if
 * they contain components matching all the public properties of the node class.
 */
export class ComponentMatchingFamily<TNode extends Node<any>> implements IFamily<TNode>
{
    private nodes!:NodeList<TNode>;
    private entities!:Dictionary<Entity, TNode>;
    private nodeClass:{ new():TNode };
    public components!:Dictionary<ClassType<any>, string>;
    private nodePool!:NodePool<TNode>;
    private engine:Engine;

    /**
     * The constructor. Creates a ComponentMatchingFamily to provide a NodeList for the
     * given node class.
     *
     * @param nodeClass The type of node to create and manage a NodeList for.
     * @param engine The engine that this family is managing teh NodeList for.
     */
    constructor( nodeClass:{ new():TNode }, engine:Engine )
    {
        this.nodeClass = nodeClass;
        this.engine = engine;
        this.init();
    }

    /**
     * Initialises the class. Creates the nodelist and other tools. Analyses the node to determine
     * what component types the node requires.
     */
    private init():void
    {
        this.nodes = new NodeList<TNode>();
        this.entities = new Dictionary<Entity, TNode>();
        this.components = new Dictionary<ClassType<any>, string>();
        this.nodePool = new NodePool<TNode>( this.nodeClass, this.components );

        let dummyNode:TNode = this.nodePool.get();
        this.nodePool.dispose( dummyNode );

        let types = (<any>dummyNode.constructor)[ '__ash_types__' ];

        for( let type in types )
        {
            if( types.hasOwnProperty( type ) )
            {
                this.components.set( types[ type ], type );
            }
        }
    }

    /**
     * The nodelist managed by this family. This is a reference that remains valid always
     * since it is retained and reused by Systems that use the list. i.e. we never recreate the list,
     * we always modify it in place.
     */
    public get nodeList():NodeList<TNode>
    {
        return this.nodes;
    }

    /**
     * Called by the engine when an entity has been added to it. We check if the entity should be in
     * this family's NodeList and add it if appropriate.
     */
    public newEntity( entity:Entity ):void
    {
        this.addIfMatch( entity );
    }

    /**
     * Called by the engine when a component has been added to an entity. We check if the entity is not in
     * this family's NodeList and should be, and add it if appropriate.
     */
    public componentAddedToEntity( entity:Entity, componentClass:ClassType<any> ):void
    {
        this.addIfMatch( entity );
    }

    /**
     * Called by the engine when a component has been removed from an entity. We check if the removed component
     * is required by this family's NodeList and if so, we check if the entity is in this this NodeList and
     * remove it if so.
     */
    public componentRemovedFromEntity( entity:Entity, componentClass:ClassType<any> ):void
    {
        if( this.components.has( componentClass ) )
        {
            this.removeIfMatch( entity );
        }
    }

    /**
     * Called by the engine when an entity has been rmoved from it. We check if the entity is in
     * this family's NodeList and remove it if so.
     */
    public removeEntity( entity:Entity ):void
    {
        this.removeIfMatch( entity );
    }

    /**
     * If the entity is not in this family's NodeList, tests the components of the entity to see
     * if it should be in this NodeList and adds it if so.
     */
    private addIfMatch( entity:Entity ):void
    {
        if( !this.entities.has( entity ) )
        {
            for( let componentClass of this.components.keys() )
            {
                if( !entity.has( componentClass ) )
                {
                    return;
                }
            }

            let node:TNode = this.nodePool.get();
            node.entity = entity;
            for( let componentClass of this.components.keys() )
            {
                let cmp = this.components.get( componentClass );
                if (cmp)
                    (<any>node)[ cmp ] = entity.get( componentClass );
            }

            this.entities.set( entity, node );
            this.nodes.add( node );
        }
    }

    /**
     * Removes the entity if it is in this family's NodeList.
     */
    private removeIfMatch( entity:Entity ):void
    {
        if( this.entities.has( entity ) )
        {
            let node:TNode = this.entities.get( entity )!;
            this.entities.remove( entity );
            this.nodes.remove( node );
            if( this.engine.updating )
            {
                this.nodePool.cache( node );
                this.engine.updateComplete.add( this.releaseNodePoolCache );
            }
            else
            {
                this.nodePool.dispose( node );
            }
        }
    }

    /**
     * Releases the nodes that were added to the node pool during this engine update, so they can
     * be reused.
     */
    private releaseNodePoolCache = () => {
        this.engine.updateComplete.remove( this.releaseNodePoolCache );
        this.nodePool.releaseCache();
    }

    /**
     * Removes all nodes from the NodeList.
     */
    public cleanUp():void
    {
        for( let node:Node<TNode> | null = this.nodes.head; node; node = node.next )
        {
            this.entities.remove( node.entity );
        }
        this.nodes.removeAll();
    }
}
