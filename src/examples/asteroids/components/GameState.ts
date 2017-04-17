export class GameState
{
    public lives:number = 0;
    public level:number = 0;
    public hits:number = 0;
    public playing:boolean = false;

    public setForStart():void
    {
        this.lives = 3;
        this.level = 0;
        this.hits = 0;
        this.playing = true;
    }
}
