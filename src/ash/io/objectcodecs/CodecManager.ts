import { ArrayObjectCodec, ClassObjectCodec, IObjectCodec,
    NativeObjectCodec, ReflectionObjectCodec } from '../objectcodecs';
import { Dictionary } from '../../ds';

type Class = { new( ..._:any[] ):any };
export class CodecManager
{
    private codecs:Dictionary;
    private reflectionCodec:ReflectionObjectCodec;
    private arrayCodec:ArrayObjectCodec;

    constructor()
    {
        this.codecs = new Dictionary();
        var nativeCodec:NativeObjectCodec = new NativeObjectCodec();
        this.addCustomCodec( nativeCodec, number );
        this.addCustomCodec( nativeCodec, string );
        this.addCustomCodec( nativeCodec, boolean );
        this.reflectionCodec = new ReflectionObjectCodec();
        this.arrayCodec = new ArrayObjectCodec();
        this.addCustomCodec( arrayCodec, array );
        this.addCustomCodec( new ClassObjectCodec(), Class );
    }

    public getCodecForObject( object:Object ):IObjectCodec
    {
        var type:{new( ..._:any[] ):any}; // object is Class ? Class : object.constructor as Class;
        if( this.codecs[ type ] )
        {
            return this.codecs[ type ];
        }
        if( getQualifiedClassName( object ).substr( 0, 20 ) === '__AS3__.vec::Vector.' )
        {
            return this.arrayCodec;
        }
        return null;
    }

    public getCodecForType( type:Class ):IObjectCodec
    {
        if( this.codecs[ type ] )
        {
            return this.codecs[ type ];
        }
        if( getQualifiedClassName( type ).substr( 0, 20 ) === '__AS3__.vec::Vector.' )
        {
            return this.arrayCodec;
        }
        return null;
    }

    public getCodecForComponent( component:Object ):IObjectCodec
    {
        var codec:IObjectCodec = this.getCodecForObject( component );
        if( codec == null )
        {
            return this.reflectionCodec;
        }
        return codec;
    }

    public getCodecForComponentType( type:Class ):IObjectCodec
    {
        var codec:IObjectCodec = this.getCodecForType( type );
        if( codec == null )
        {
            return this.reflectionCodec;
        }
        return codec;
    }

    public addCustomCodec( codec:IObjectCodec, type:{new( ..._:any[] ):any} ):void
    {
        this.codecs[ type ] = codec;
    }

    public encodeComponent( object:Object ):Object
    {
        if( object === null )
        {
            return { value: null };
        }
        var codec:IObjectCodec = this.getCodecForComponent( object );
        if( codec )
        {
            return codec.encode( object, this );
        }
        return { value: null };
    }

    public encodeObject( object:Object ):Object
    {
        if( object === null )
        {
            return { value: null };
        }
        var codec:IObjectCodec = this.getCodecForObject( object );
        if( codec )
        {
            return codec.encode( object, this );
        }
        return { value: null };
    }

    public decodeComponent( object:Object ):Object
    {
        if( !object.hasOwnProperty( 'type' ) || ( object.hasOwnProperty( 'value' ) && object.value === null ) )
        {
            return null;
        }
        var codec:IObjectCodec = getCodecForComponentType( getDefinitionByName( object.type ) as Class );
        if( codec )
        {
            return codec.decode( object, this );
        }
        return null;
    }

    public decodeObject( object:Object ):Object
    {
        if( !object.hasOwnProperty( 'type' ) || ( object.hasOwnProperty( 'value' ) && object.value === null ) )
        {
            return null;
        }
        var codec:IObjectCodec = getCodecForType( getDefinitionByName( object.type ) as Class );
        if( codec )
        {
            return codec.decode( object, this );
        }
        return null;
    }

    public decodeIntoComponent( target:Object, encoded:Object ):void
    {
        if( !encoded.hasOwnProperty( 'type' ) || ( encoded.hasOwnProperty( 'value' ) && encoded.value === null ) )
        {
            return;
        }
        var codec:IObjectCodec = getCodecForComponentType( getDefinitionByName( encoded.type ) as Class );
        if( codec )
        {
            codec.decodeIntoObject( target, encoded, this );
        }
    }

    public decodeIntoProperty( parent:Object, property:String, encoded:Object ):void
    {
        if( !encoded.hasOwnProperty( 'type' ) || ( encoded.hasOwnProperty( 'value' ) && encoded.value === null ) )
        {
            return;
        }
        var codec:IObjectCodec = getCodecForType( getDefinitionByName( encoded.type ) as Class );
        if( codec )
        {
            codec.decodeIntoProperty( parent, property, encoded, this );
        }
    }
}
}

