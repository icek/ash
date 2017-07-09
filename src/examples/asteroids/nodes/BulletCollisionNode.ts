import { Node, keep } from '../ash';
import { Bullet, Collision, Position } from '../components';

export class BulletCollisionNode extends Node<BulletCollisionNode>
{
    @keep( Bullet )
    public bullet:Bullet;
    @keep( Position )
    public position:Position;
    @keep( Collision )
    public collision:Collision;

}
