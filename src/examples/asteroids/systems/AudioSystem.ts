import { ListIteratingSystem } from 'ash';
import { AudioNode } from '../nodes';

export class AudioSystem extends ListIteratingSystem<AudioNode>
{
    constructor()
    {
        super( AudioNode );
    }

    public updateNode( node:AudioNode, time:number ):void
    {
        // for( let name in node.audio.toPlay ) {
        //var sound : Sound = new type();
        //sound.play( 0, 1 );
        // }
        // node.audio.toPlay.length = 0;
    }
}
