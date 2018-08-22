export class ObjectReflection
{
    private _propertyTypes:Object = {};
    private _type:string;

    constructor( component:Object )
    {
        this._type = getQualifiedClassName( component );
        var description:XML = describeType( component );
        var list:XMLList = description.variable.( attribute( 'uri' ).length() === 0 );
        for( var xml of list )
        {
            this._propertyTypes[ xml.@name.toString() ] = xml.@type.toString();
        }
        // list = description.accessor.(@access === 'readwrite').( attribute('uri').length() === 0 );
        for( var xml of list )
        {
            this._propertyTypes[ xml.@name.toString() ] = xml.@type.toString();
        }
    }

    public get propertyTypes():Object
    {
        return this._propertyTypes;
    }

    public get type():String
    {
        return this._type;
    }
}
