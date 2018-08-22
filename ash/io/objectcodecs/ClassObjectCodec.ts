export class ClassObjectCodec implements IObjectCodec
{
    public encode( object:Object, codecManager:CodecManager ):Object
    {
        return { type: 'Class', value: getQualifiedClassName( object ) };
    }

    public decode( object:Object, codecManager:CodecManager ):Object
    {
        return getDefinitionByName( object.value );
    }

    public decodeIntoObject( target:Object, object:Object, codecManager:CodecManager ):void
    {
        target = getDefinitionByName( object.value ); // this won't work because native objects (i.e. target) are not passed by reference
    }

    public decodeIntoProperty( parent:Object, property:String, object:Object, codecManager:CodecManager ):void
    {
        decodeIntoObject( parent[ property ], object, codecManager );
    }
}
