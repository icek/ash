import { Entity } from '../core/Entity';
import { EntityState } from './EntityState';
import { IComponentProvider } from './IComponentProvider';
import { Dictionary } from '../Dictionary';
import { ClassType } from '../Types';

/**
 * This is a state machine for an entity. The state machine manages a set of states,
 * each of which has a set of component providers. When the state machine changes the state, it removes
 * components associated with the previous state and adds components associated with the new state.
 */
export class EntityStateMachine
{
    private states:Map<string, EntityState>;
    /**
     * The current state of the state machine.
     */
    private currentState?:EntityState;
    /**
     * The entity whose state machine this is
     */
    public entity:Entity;

    /**
     * Constructor. Creates an EntityStateMachine.
     */
    constructor( entity:Entity )
    {
        this.entity = entity;
        this.states = new Map();
    }

    /**
     * Add a state to this state machine.
     *
     * @param name The name of this state - used to identify it later in the changeState method call.
     * @param state The state.
     * @return This state machine, so methods can be chained.
     */
    public addState( name:string, state:EntityState ):this
    {
        this.states.set(name, state);
        return this;
    }

    /**
     * Create a new state in this state machine.
     *
     * @param name The name of the new state - used to identify it later in the changeState method call.
     * @return The new EntityState object that is the state. This will need to be configured with
     * the appropriate component providers.
     */
    public createState( name:string ):EntityState
    {
        let state:EntityState = new EntityState();
        this.states.set(name, state);
        return state;
    }

    /**
     * Change to a new state. The components from the old state will be removed and the components
     * for the new state will be added.
     *
     * @param name The name of the state to change to.
     */
    public changeState( name:string ):void
    {
        let newState:EntityState | null = this.states.get(name);
        if( !newState )
        {
            throw( new Error( `Entity state ${name} doesn't exist` ) );
        }
        if( newState === this.currentState )
        {
            newState = null;
            return;
        }
        let toAdd:Dictionary<ClassType<any>, IComponentProvider<any>>;

        if( this.currentState )
        {
            toAdd = new Dictionary<ClassType<any>, IComponentProvider<any>>();
            for( let type of newState.providers.keys() )
            {
                toAdd.set( type, newState.providers.get( type )! );
            }
            for( let type of this.currentState.providers.keys() )
            {
                let other:IComponentProvider<any> | null = toAdd.get( type );

                if( other && other.identifier === this.currentState!.providers.get( type )!.identifier )
                {
                    toAdd.remove( type );
                }
                else
                {
                    this.entity.remove( type );
                }
            }
        }
        else
        {
            toAdd = newState.providers;
        }
        for( let type of toAdd.keys() )
        {
            this.entity.add( <IComponentProvider<any>>( toAdd.get( type )! ).getComponent(), type );
        }
        this.currentState = newState;
    }
}
