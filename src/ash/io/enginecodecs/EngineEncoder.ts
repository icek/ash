import { Engine, Entity } from '../../ash';
import { CodecManager, IObjectCodec } from '../objectcodecs';

export class EngineEncoder
{
    private codecManager:CodecManager;
    private componentEncodingMap:Dictionary;
    private encodedEntities:array;
    private encodedComponents:array;
    private nextComponentId:number;
    private encoded:Object;

    constructor( codecManager:CodecManager )
    {
        this.codecManager = codecManager;
        reset();
    }

    public reset():void
    {
        nextComponentId = 1;
        encodedEntities = [];
        encodedComponents = [];
        componentEncodingMap = new Dictionary();
        encoded = { entities: encodedEntities, components: encodedComponents };
    }

    public encodeEngine( engine:Engine ):Object
    {
        var entities:Entity[] = engine.entities;

        for( var entity of entities )
        {
            encodeEntity( entity );
        }
        return encoded;
    }

    private encodeEntity( entity:Entity ):void
    {
        var components:Array = entity.getAll();
        var componentIds:Array = [];
        for( var component of components )
        {
            var encodedComponent:Object = encodeComponent( component );
            if( encodedComponent )
            {
                componentIds[ componentIds.length ] = encodedComponent;
            }
        }
        encodedEntities[ encodedEntities.length ] = {
            name: entity.name,
            components: componentIds
        };
    }

    private encodeComponent( component:Object ):uint
    {
        if( componentEncodingMap[ component ] )
        {
            return componentEncodingMap[ component ].id;
        }
        var encoded:Object = codecManager.encodeComponent( component );
        if( encoded )
        {
            encoded.id = nextComponentId++;
            componentEncodingMap[ component ] = encoded;
            encodedComponents[ encodedComponents.length ] = encoded;
            return encoded.id;
        }
        return 0;
    }
}
