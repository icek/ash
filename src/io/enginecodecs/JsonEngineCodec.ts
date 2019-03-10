import { Engine } from '../../ash';

export class JsonEngineCodec extends ObjectEngineCodec implements IEngineCodec
{
    public encodeEngine( engine:Engine ):Object
    {
        var object:Object = super.encodeEngine( engine );
        var encoded:String = JSON.stringify( object );
        return encoded;
    }

    public decodeEngine( encodedData:Object, engine:Engine ):void
    {
        var object:Object = JSON.parse( encodedData as String );
        super.decodeEngine( object, engine );
    }

    public decodeOverEngine( encodedData:Object, engine:Engine ):void
    {
        var object:Object = JSON.parse( encodedData as String );
        super.decodeOverEngine( object, engine );
    }
}
