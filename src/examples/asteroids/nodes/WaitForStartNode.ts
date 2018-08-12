import { Node, keep } from 'ash.ts';
import { WaitForStart } from '../components';

export class WaitForStartNode extends Node<WaitForStartNode>
{
    @keep( WaitForStart )
    public wait!:WaitForStart;
}
