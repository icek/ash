import { CodecManager, IObjectCodec } from 'index';

export class NativeObjectCodec implements IObjectCodec
{
    public encode( object:Object, codecManager:CodecManager ):Object
    {
        return { type: getQualifiedClassName( object ), value: object };
    }

    public decode( object:Object, codecManager:CodecManager ):Object
    {
        return object.value;
    }

    public decodeIntoObject( target:Object, object:Object, codecManager:CodecManager ):void
    {
        throw( new Error( 'Can\'t decode into a native object because the object is passed by value, not by reference,'
                          + 'so we\'re decoding into a local copy not the original.' ) );
    }

    public decodeIntoProperty( parent:Object, property:String, object:Object, codecManager:CodecManager ):void
    {
        parent[ property ] = object.value;
    }
}

