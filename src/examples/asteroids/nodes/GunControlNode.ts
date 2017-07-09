import { Node, keep } from '../ash';
import { Audio, Gun, GunControls, Position } from '../components';

export class GunControlNode extends Node<GunControlNode>
{
    @keep( GunControls )
    public control:GunControls;
    @keep( Gun )
    public gun:Gun;
    @keep( Position )
    public position:Position;
    @keep( Audio )
    public audio:Audio;
}
