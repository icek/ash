import { Dictionary } from '../Dictionary';
import { ComponentMatchingFamily } from './ComponentMatchingFamily';
import { Entity } from './Entity';
import { EntityList } from './EntityList';
import { IFamily } from './IFamily';
import { Node } from './Node';
import { NodeList } from './NodeList';
import { SystemList } from './SystemList';
import { Signal0 } from '../signals/Signal0';
import { System } from './System';
import { ClassType } from '../Types';


/**
 * The Engine class is the central point for creating and managing your game state. Add
 * entities and systems to the engine, and fetch families of nodes from the engine.
 */
export class Engine
{
    private entityNames:{[key:string]:Entity | null};
    private entityList:EntityList;
    private systemList:SystemList;
    private families:Dictionary<{ new():Node<any> }, IFamily<any>>;

    /**
     * Indicates if the engine is currently in its update loop.
     */
    public updating:boolean = false;

    /**
     * Dispatched when the update loop ends. If you want to add and remove systems from the
     * engine it is usually best not to do so during the update loop. To avoid this you can
     * listen for this signal and make the change when the signal is dispatched.
     */
    public updateComplete:Signal0;

    /**
     * The class used to manage node lists. In most cases the default class is sufficient
     * but it is exposed here so advanced developers can choose to create and use a
     * different implementation.
     *
     * The class must implement the Family interface.
     */
    public familyClass:any = ComponentMatchingFamily;

    constructor()
    {
        this.entityList = new EntityList();
        this.entityNames = {};
        this.systemList = new SystemList();
        this.families = new Dictionary<{ new():Node<any> }, IFamily<any>>();
        this.updateComplete = new Signal0();
    }

    /**
     * Add an entity to the engine.
     *
     * @param entity The entity to add.
     */
    public addEntity( entity:Entity ):void
    {
        if( this.entityNames[ entity.name ] )
        {
            throw new Error( 'The entity name ' + entity.name + ' is already in use by another entity.' );
        }
        this.entityList.add( entity );
        this.entityNames[ entity.name ] = entity;
        entity.componentAdded.add( this.componentAdded );
        entity.componentRemoved.add( this.componentRemoved );
        entity.nameChanged.add( this.entityNameChanged );
        for( let family of this.families.values() )
        {
            family.newEntity( entity );
        }
    }

    /**
     * Remove an entity from the engine.
     *
     * @param entity The entity to remove.
     */
    public removeEntity( entity:Entity ):void
    {
        entity.componentAdded.remove( this.componentAdded );
        entity.componentRemoved.remove( this.componentRemoved );
        entity.nameChanged.remove( this.entityNameChanged );
        for( let family of this.families.values() )
        {
            family.removeEntity( entity );
        }
        this.entityNames[ entity.name ] = null;
        this.entityList.remove( entity );
    }

    private entityNameChanged = ( entity:Entity, oldName:string ) => {
        if( this.entityNames[ oldName ] === entity )
        {
            this.entityNames[ oldName ] = null;
            this.entityNames[ entity.name ] = entity;
        }
    };

    /**
     * Get an entity based n its name.
     *
     * @param name The name of the entity
     * @return The entity, or null if no entity with that name exists on the engine
     */
    public getEntityByName( name:string ):Entity | null
    {
        return this.entityNames[ name ];
    }

    /**
     * Remove all entities from the engine.
     */
    public removeAllEntities():void
    {
        while( this.entityList.head )
        {
            this.removeEntity( this.entityList.head );
        }
    }

    /**
     * Returns a vector containing all the entities in the engine.
     */
    public get entities():Entity[]
    {
        let entities:Entity[] = [];
        for( let entity:Entity | null = this.entityList.head; entity; entity = entity.next )
        {
            entities[ entities.length ] = entity;
        }
        return entities;
    }

    /**
     * @private
     */
    private componentAdded = ( entity:Entity, componentClass:ClassType<any> ) => {
        for( let family of this.families.values() )
        {
            family.componentAddedToEntity( entity, componentClass );
        }
    };

    /**
     * @private
     */
    private componentRemoved = ( entity:Entity, componentClass:ClassType<any> ) => {
        for( let family of this.families.values() )
        {
            family.componentRemovedFromEntity( entity, componentClass );
        }
    };

    /**
     * Get a collection of nodes from the engine, based on the type of the node required.
     *
     * <p>The engine will create the appropriate NodeList if it doesn't already exist and
     * will keep its contents up to date as entities are added to and removed from the
     * engine.</p>
     *
     * <p>If a NodeList is no longer required, release it with the releaseNodeList method.</p>
     *
     * @param nodeClass The type of node required.
     * @return A linked list of all nodes of this type from all entities in the engine.
     */
    public getNodeList<TNode extends Node<any>>( nodeClass:{ new():TNode } ):NodeList<TNode>
    {
        if( this.families.has( nodeClass ) )
        {
            return this.families.get( nodeClass )!.nodeList;
        }
        let family:IFamily<TNode> = new this.familyClass( nodeClass, this );
        this.families.set( nodeClass, family );
        for( let entity:Entity | null = this.entityList.head; entity; entity = entity.next )
        {
            family.newEntity( entity );
        }
        return family.nodeList;
    }

    /**
     * If a NodeList is no longer required, this method will stop the engine updating
     * the list and will release all references to the list within the framework
     * classes, enabling it to be garbage collected.
     *
     * <p>It is not essential to release a list, but releasing it will free
     * up memory and processor resources.</p>
     *
     * @param nodeClass The type of the node class if the list to be released.
     */
    public releaseNodeList<TNode extends Node<any>>( nodeClass:{ new():TNode } ):void
    {
        if( this.families.has( nodeClass ) )
        {
            this.families.get( nodeClass )!.cleanUp();
        }
        this.families.remove( nodeClass );
    }

    /**
     * Add a system to the engine, and set its priority for the order in which the
     * systems are updated by the engine update loop.
     *
     * <p>The priority dictates the order in which the systems are updated by the engine update
     * loop. Lower numbers for priority are updated first. i.e. a priority of 1 is
     * updated before a priority of 2.</p>
     *
     * @param system The system to add to the engine.
     * @param priority The priority for updating the systems during the engine loop. A
     * lower number means the system is updated sooner.
     */
    public addSystem( system:System, priority:number ):void
    {
        system.priority = priority;
        system.addToEngine( this );
        this.systemList.add( system );
    }

    /**
     * Get the system instance of a particular type from within the engine.
     *
     * @param type The type of system
     * @return The instance of the system type that is in the engine, or
     * null if no systems of this type are in the engine.
     */
    public getSystem<TSystem extends System>( type:{ new( ...args:any[] ):TSystem } ):TSystem | null
    {
        return this.systemList.get( type );
    }

    /**
     * Returns a vector containing all the systems in the engine.
     */
    public get systems():System[]
    {
        let systems:System[] = [];
        for( let system:System | null = this.systemList.head; system; system = system.next )
        {
            systems[ systems.length ] = system;
        }
        return systems;
    }

    /**
     * Remove a system from the engine.
     *
     * @param system The system to remove from the engine.
     */
    public removeSystem( system:System ):void
    {
        this.systemList.remove( system );
        system.removeFromEngine( this );
    }

    /**
     * Remove all systems from the engine.
     */
    public removeAllSystems():void
    {
        while( this.systemList.head )
        {
            let system:System = this.systemList.head;
            this.systemList.head = this.systemList.head.next;
            system.previous = null;
            system.next = null;
            system.removeFromEngine( this );
        }
        this.systemList.tail = null;
    }

    /**
     * Update the engine. This causes the engine update loop to run, calling update on all the
     * systems in the engine.
     *
     * <p>The package net.richardlord.ash.tick contains classes that can be used to provide
     * a steady or variable tick that calls this update method.</p>
     *
     * @time The duration, in seconds, of this update step.
     */
    public update( time:number ):void
    {
        this.updating = true;
        for( let system:System | null = this.systemList.head; system; system = system.next )
        {
            system.update( time );
        }
        this.updating = false;
        this.updateComplete.dispatch();
    }
}
