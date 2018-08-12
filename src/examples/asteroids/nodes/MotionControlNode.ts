import { Node, keep } from 'ash.ts';
import { Motion, MotionControls, Position } from '../components';

export class MotionControlNode extends Node<MotionControlNode>
{
    @keep( MotionControls )
    public control!:MotionControls;
    @keep( Position )
    public position!:Position;
    @keep( Motion )
    public motion!:Motion;
}
