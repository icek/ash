import { Node, keep } from 'ash.ts';
import { Display, Position } from '../components';

export class RenderNode extends Node<RenderNode>
{
    @keep( Position )
    public position!:Position;
    @keep( Display )
    public display!:Display;
}
