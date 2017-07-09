const WORD_SIZE = 32;

export class KeyPoll
{
    private _keys:Int32Array = new Int32Array( 4 );

    constructor()
    {
        window.addEventListener( 'keyup', this.keyUpHandler );
        window.addEventListener( 'keydown', this.keyDownHandler );
    }

    public isDown( key:number ):boolean
    {
        let i = Math.floor( key / WORD_SIZE );
        return (this._keys[ i ] & (1 << key - i * WORD_SIZE)) != 0;
    }

    public isUp( key:number ):boolean
    {
        return !this.isDown( key );
    }

    private keyDownHandler = ( event:KeyboardEvent ) => {
        let { keyCode } = event;
        let index = Math.floor( keyCode / WORD_SIZE );
        this._keys[ index ] |= (1 << keyCode - index * WORD_SIZE);
    };

    private keyUpHandler = ( event:KeyboardEvent ) => {
        let { keyCode } = event;
        let index = Math.floor( keyCode / WORD_SIZE );
        this._keys[ index ] &= ~(1 << keyCode - index * WORD_SIZE);
    };
}
