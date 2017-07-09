import { WaitForStartView } from '../graphics';

export class WaitForStart
{
    public waitForStart:WaitForStartView;
    public startGame:boolean;

    constructor( waitForStart:WaitForStartView )
    {
        this.waitForStart = waitForStart;
        waitForStart.click.add( () => this.startGame = true );
    }
}
