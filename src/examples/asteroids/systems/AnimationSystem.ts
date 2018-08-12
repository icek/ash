import { AnimationNode } from '../nodes';
import { ListIteratingSystem } from 'ash.ts';

export class AnimationSystem extends ListIteratingSystem<AnimationNode>
{
    constructor()
    {
        super( AnimationNode );
    }

    public updateNode( node:AnimationNode, time:number ):void
    {
        node.animation.animation.animate( time );
    }
}
