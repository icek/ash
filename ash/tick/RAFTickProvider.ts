import { Signal1 } from '../signals/Signal1';
import { ITickProvider } from './ITickProvider';

export class RAFTickProvider extends Signal1<number> implements ITickProvider
{
    private rafId:number = 0;
    private previousTime:number = 0;
    public playing:boolean = false;

    constructor()
    {
        super();
    }

    public start():void
    {
        this.previousTime = Date.now();
        this.playing = true;
        this.rafId = requestAnimationFrame( this.update );
    }

    private update = () => {
        this.rafId = requestAnimationFrame( this.update );
        let time = Date.now();
        this.dispatch( (time - this.previousTime) / 1000 );
        this.previousTime = time;
    };

    public stop():void
    {
        cancelAnimationFrame( this.rafId );
    }
}
