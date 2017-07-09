import { Node, keep } from '../ash';
import { Audio } from '../components';

export class AudioNode extends Node<AudioNode>
{
    @keep( Audio )
    public audio:Audio;
}
