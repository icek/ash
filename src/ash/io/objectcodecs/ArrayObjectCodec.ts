export class ArrayObjectCodec implements IObjectCodec
{
    public encode( object:Object, codecManager:CodecManager ):Object
    {
        var type:String = getQualifiedClassName( object );
        var values:Object = [];
        var codec:IObjectCodec;
        for( var value of object )
        {
            values[ values.length ] = codecManager.encodeObject( value );
        }
        return { type: type, values: values };
    }

    public decode( object:Object, codecManager:CodecManager ):Object
    {
        var type:Class = getDefinitionByName( object.type ) as Class;
        var decoded:Object = new type();
        for( var obj of object.values )
        {
            decoded[ decoded.length ] = codecManager.decodeObject( obj );
        }
        return decoded;
    }

    public decodeIntoObject( target:Object, object:Object, codecManager:CodecManager ):void
    {
        for( var obj of object.values )
        {
            target[ target.length ] = codecManager.decodeObject( obj );
        }
    }

    public decodeIntoProperty( parent:Object, property:String, object:Object, codecManager:CodecManager ):void
    {
        decodeIntoObject( parent[ property ], object, codecManager );
    }
}
