export class Position
{
    constructor( public x:number, public y:number, public rotation:number = 0 )
    {

    }

    static distance( x1:number, y1:number, x2:number, y2:number )
    {
        return Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) )
    }
}
