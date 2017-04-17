import { Engine } from '../../ash/index';
import { CodecManager, EngineDecoder, EngineEncoder, IEngineCodec, IObjectCodec } from '../objectcodecs/index';
import { Signal1 } from '../../signals/index';

export class ObjectEngineCodec implements IEngineCodec
{
    private encoder:EngineEncoder;
    private decoder:EngineDecoder;
    private codecManager:CodecManager;
    private encodeCompleteSignal:Signal1 = new Signal1<Object>();
    private decodeCompleteSignal:Signal1 = new Signal1<Engine>();

    constructor()
    {
        this.codecManager = new CodecManager();
        this.encoder = new EngineEncoder( codecManager );
        this.decoder = new EngineDecoder( codecManager );
    }

    public addCustomCodec( codec:IObjectCodec, ...types:any[] ):void
    {
        for( var type of types )
        {
            this.codecManager.addCustomCodec( codec, type );
        }
    }

    public encodeEngine( engine:Engine ):Object
    {
        this.encoder.reset();
        var encoded:Object = this.encoder.encodeEngine( engine );
        this.encodeCompleteSignal.dispatch( encoded );
        return encoded;
    }

    public decodeEngine( encodedData:Object, engine:Engine ):void
    {
        this.decoder.reset();
        this.decoder.decodeEngine( encodedData, engine );
        this.decodeCompleteSignal.dispatch( engine );
    }

    public decodeOverEngine( encodedData:Object, engine:Engine ):void
    {
        this.decoder.reset();
        this.decoder.decodeOverEngine( encodedData, engine );
        this.decodeCompleteSignal.dispatch( engine );
    }

    public get encodeComplete():Signal1
    {
        return this.encodeCompleteSignal;
    }

    public get decodeComplete():Signal1
    {
        return this.decodeCompleteSignal;
    }
}
