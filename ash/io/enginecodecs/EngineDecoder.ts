import { Engine, Entity } from '../../ash';
import { CodecManager, IObjectCodec } from '../objectcodecs';

export class EngineDecoder
{
    private codecManager:CodecManager;
    private componentMap:array;
    private encodedComponentMap:array;

    constructor( codecManager:CodecManager )
    {
        this.codecManager = codecManager;
        componentMap = [];
        encodedComponentMap = [];
    }

    public reset():void
    {
        componentMap.length = 0;
        encodedComponentMap.length = 0;
    }

    public decodeEngine( encodedData:Object, engine:Engine ):void
    {
        for( var encodedComponent of encodedData.components )
        {
            decodeComponent( encodedComponent );
        }

        for ( var encodedEntity of encodedData.entities )
        {
            engine.addEntity( decodeEntity( encodedEntity ) );
        }
    }

    public decodeOverEngine( encodedData:Object, engine:Engine ):void
    {
        for( var encodedComponent of encodedData.components )
        {
            encodedComponentMap[ encodedComponent.id ] = encodedComponent;
            decodeComponent( encodedComponent );
        }

        for( var encodedEntity of encodedData.entities )
        {
            if( encodedEntity.hasOwnProperty( 'name' ) )
            {
                var name:String = encodedEntity.name;
                if( name )
                {
                    var existingEntity:Entity = engine.getEntityByName( name );
                    if( existingEntity )
                    {
                        overlayEntity( existingEntity, encodedEntity );
                        continue;
                    }
                }
            }
            engine.addEntity( decodeEntity( encodedEntity ) );
        }
    }

    private overlayEntity( entity:Entity, encodedEntity:Object ):void
    {
        for( var componentId of encodedEntity.components )
        {
            if( componentMap.hasOwnProperty( componentId ) )
            {
                var newComponent:Object = componentMap[ componentId ];
                if( newComponent )
                {
                    var type:Class = newComponent.constructor as Class;
                    var existingComponent:Object = entity.get( type );
                    if( existingComponent )
                    {
                        codecManager.decodeIntoComponent( existingComponent, encodedComponentMap[ componentId ] );
                    }
                    else
                    {
                        entity.add( newComponent );
                    }
                }
            }
        }
    }

    private decodeEntity( encodedEntity:Object ):Entity
    {
        var entity:Entity = new Entity();
        if( encodedEntity.hasOwnProperty( 'name' ) )
        {
            entity.name = encodedEntity.name;
        }
        for( var componentId of encodedEntity.components )
        {
            if( componentMap.hasOwnProperty( componentId ) )
            {
                entity.add( componentMap[ componentId ] );
            }
        }
        return entity;
    }

    private decodeComponent( encodedComponent:Object ):void
    {
        var codec:IObjectCodec = codecManager.getCodecForComponent( getDefinitionByName( encodedComponent.type ) );
        if( codec )
        {
            componentMap[ encodedComponent.id ] = codecManager.decodeComponent( encodedComponent );
        }
    }
}
