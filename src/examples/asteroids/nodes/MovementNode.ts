import { Node, keep } from 'ash';
import { Motion, Position } from '../components';

export class MovementNode extends Node<MovementNode>
{
    @keep( Position )
    public position:Position;
    @keep( Motion )
    public motion:Motion;
}
