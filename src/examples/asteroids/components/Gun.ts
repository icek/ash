export class Gun
{
    public shooting:boolean = false;
    public timeSinceLastShot:number = 0;

    constructor( public offsetFromParentX:number, public offsetFromParentY:number, public minimumShotInterval:number = 0, public bulletLifetime:number = 0 )
    {

    }
}
