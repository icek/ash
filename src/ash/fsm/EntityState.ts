import { IComponentProvider } from './IComponentProvider';
import { StateComponentMapping } from './StateComponentMapping';
import { ClassMap } from '../ClassMap';

/**
 * Represents a state for an EntityStateMachine. The state contains any number of ComponentProviders which
 * are used to add components to the entity when this state is entered.
 */
export class EntityState
{
    /**
     * @private
     */
    public providers:ClassMap<{new( ..._:any[] ):any}, any> = new ClassMap<{new( ..._:any[] ):any}, any>();

    /**
     * Add a new ComponentMapping to this state. The mapping is a utility class that is used to
     * map a component type to the provider that provides the component.
     *
     * @param type The type of component to be mapped
     * @return The component mapping to use when setting the provider for the component
     */
    public add<TComponent>( type:{new( ..._:any[] ):TComponent} ):StateComponentMapping<TComponent>
    {
        return new StateComponentMapping<TComponent>( this, type );
    }

    /**
     * Get the ComponentProvider for a particular component type.
     *
     * @param type The type of component to get the provider for
     * @return The ComponentProvider
     */
    public get<TComponent>( type:{new( ..._:any[] ):TComponent} ):IComponentProvider<TComponent>
    {
        return this.providers.get( type );
    }

    /**
     * To determine whether this state has a provider for a specific component type.
     *
     * @param type The type of component to look for a provider for
     * @return true if there is a provider for the given type, false otherwise
     */
    public has<TComponent>( type:{new( ..._:any[] ):TComponent} ):Boolean
    {
        return this.providers.has( type );
    }
}
