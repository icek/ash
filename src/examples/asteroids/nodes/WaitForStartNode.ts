import { Node, keep } from "../ash";
import { WaitForStart } from "../components/index";

export class WaitForStartNode extends Node<WaitForStartNode>
{
    @keep(WaitForStart)
    public wait:WaitForStart;
}
