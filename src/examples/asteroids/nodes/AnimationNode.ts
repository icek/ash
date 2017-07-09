import { Node, keep } from '../ash';
import { Animation } from '../components';

export class AnimationNode extends Node<AnimationNode>
{
    @keep( Animation )
    public animation:Animation;
}
