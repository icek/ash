export class Dictionary<TKey, TValue>
{
    private _keys:TKey[];
    private _values:TValue[];

    constructor()
    {
        this._keys = [];
        this._values = [];
    }

    public set( key:TKey, value:TValue ):TValue
    {
        let index = this._keys.indexOf( key );
        if( index < 0 )
        {
            let len = this._keys.length;
            this._keys[ len ] = key;
            this._values[ len ] = value;
        }
        else
        {
            this._values[ index ] = value;
        }
        return value;
    }

    public get( key:TKey ):TValue | null
    {
        let index = this._keys.indexOf( key );
        if( index < 0 )
        {
            return null;
        }
        else
        {
            return this._values[ index ];
        }
    }

    public has( key:TKey ):boolean
    {
        return !(this._keys.indexOf( key ) < 0);
    }

    public remove( key:TKey ):TValue | null
    {
        let index = this._keys.indexOf( key );
        if( index < 0 )
        {
            // throw Error?
            return null;
        }
        else
        {
            this._keys.splice( index, 1 );
            return this._values.splice( index, 1 )[ 0 ];
        }
    }

    public keys():TKey[]
    {
        return this._keys;
    }

    public values():TValue[]
    {
        return this._values;
    }
}
